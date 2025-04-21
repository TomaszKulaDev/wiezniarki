import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cache dla statusu maintenance - przechowuje informację o trybie konserwacji
// Używamy cache'owania aby zredukować liczbę zapytań do API
// status: boolean - czy tryb konserwacji jest włączony
// lastChecked: number - timestamp ostatniego sprawdzenia statusu
const maintenanceCache = {
  status: false,
  lastChecked: 0,
};

// Czas przez jaki cache pozostaje ważny (30 minut)
// Po tym czasie zostanie wykonane nowe zapytanie do API
const CACHE_DURATION = 30 * 60 * 1000; // 30 minut

// Pomocnicza funkcja do sprawdzania, czy ścieżka zaczyna się od któregokolwiek z podanych prefiksów
const pathStartsWith = (path: string, prefixes: string[]): boolean => {
  return prefixes.some((prefix) => path.startsWith(prefix));
};

async function checkMaintenanceStatus(request: NextRequest): Promise<boolean> {
  const now = Date.now();

  // Użyj cache jeśli nie minęło więcej niż 5 minut
  if (now - maintenanceCache.lastChecked < CACHE_DURATION) {
    return maintenanceCache.status;
  }

  try {
    const maintenanceResponse = await fetch(
      `${request.nextUrl.origin}/api/settings/maintenance`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (maintenanceResponse.ok) {
      const { enabled } = await maintenanceResponse.json();

      // Aktualizuj cache
      maintenanceCache.status = enabled;
      maintenanceCache.lastChecked = now;

      return enabled;
    }
  } catch (error) {
    console.error("Błąd sprawdzania trybu konserwacji:", error);
  }

  return false;
}

export async function middleware(request: NextRequest) {
  // Utworzenie bazowej odpowiedzi
  const response = NextResponse.next();
  const currentPath = request.nextUrl.pathname;

  // Jeśli już jesteśmy na stronie maintenance, przepuść zapytanie
  if (currentPath === "/maintenance") {
    return response;
  }

  // Lista dozwolonych ścieżek (które są dostępne nawet w trybie konserwacji)
  const allowedInMaintenance = [
    "/api/auth/login",
    "/api/auth/me",
    "/api/auth/refresh",
    "/api/settings/maintenance",
    "/login",
    "/_next",
    "/favicon.ico",
    "/logo.svg",
  ];

  // Jeśli jesteśmy na jednej z dozwolonych ścieżek, przepuść dalej
  if (allowedInMaintenance.some((path) => currentPath.startsWith(path))) {
    return response;
  }

  // Pobierz token dostępu z ciasteczek
  const accessToken = request.cookies.get("accessToken")?.value;

  // Sprawdź, czy użytkownik jest administratorem
  let isAdmin = false;
  if (accessToken) {
    try {
      const userResponse = await fetch(
        `${request.nextUrl.origin}/api/auth/me`,
        {
          headers: {
            Cookie: `accessToken=${accessToken}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData && userData.role === "admin") {
          isAdmin = true;
        }
      }
    } catch (error) {
      console.error("Błąd sprawdzania statusu użytkownika:", error);
    }
  }

  // Jeśli użytkownik jest administratorem, przepuść zapytanie
  if (isAdmin) {
    return response;
  }

  // Sprawdź status maintenance z cache
  const isMaintenanceMode = await checkMaintenanceStatus(request);
  if (isMaintenanceMode) {
    const maintenanceUrl = new URL("/maintenance", request.url);
    return NextResponse.redirect(maintenanceUrl);
  }

  // Ścieżki chronione, które wymagają autoryzacji
  const protectedPaths = ["/dashboard", "/profile", "/admin"];

  // Jeśli nie jesteśmy na chronionej ścieżce, po prostu przechodzimy dalej
  if (!pathStartsWith(currentPath, protectedPaths)) {
    return response;
  }

  // Jeśli mamy token dostępu, kontynuuj nawigację
  if (accessToken) {
    return response;
  }

  // Jeśli nie mamy tokenu dostępu, ale mamy token odświeżający, spróbuj odświeżyć
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (refreshToken) {
    try {
      // Dodaj obsługę timeoutu dla zapytania odświeżania tokenu
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sekund timeout

      // Wywołaj API odświeżania tokenu
      const refreshResponse = await fetch(
        `${request.nextUrl.origin}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();

        // Ustaw nowe tokeny w ciasteczkach
        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15, // 15 minut
          path: "/",
        });

        response.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 dni
          path: "/",
        });

        return response;
      }
    } catch (error) {
      // Nie loguj błędów timeoutu i przerwanych zapytań
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Nie można odświeżyć tokenu:", error);
      }
    }
  }

  // Jeśli nie udało się odświeżyć tokenu lub nie mamy żadnego tokenu,
  // przekieruj na stronę logowania z przechwyceniem oryginalnej ścieżki
  const url = new URL("/login", request.url);
  url.searchParams.set(
    "redirect",
    encodeURIComponent(request.nextUrl.pathname)
  );
  return NextResponse.redirect(url);
}

// Rozszerzona konfiguracja matcher, aby działało dla wszystkich ścieżek
export const config = {
  matcher: [
    "/((?!api/settings/maintenance|_next/static|_next/image|favicon.ico|logo.svg).*)",
  ],
};
