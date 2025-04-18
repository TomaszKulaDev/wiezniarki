import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pomocnicza funkcja do sprawdzania, czy ścieżka zaczyna się od któregokolwiek z podanych prefiksów
const pathStartsWith = (path: string, prefixes: string[]): boolean => {
  return prefixes.some((prefix) => path.startsWith(prefix));
};

export async function middleware(request: NextRequest) {
  // Utworzenie bazowej odpowiedzi
  const response = NextResponse.next();

  // Ścieżki chronione, które wymagają autoryzacji
  const protectedPaths = ["/dashboard", "/profile"];
  const currentPath = request.nextUrl.pathname;

  // Jeśli nie jesteśmy na chronionej ścieżce, po prostu przechodzimy dalej
  if (!pathStartsWith(currentPath, protectedPaths)) {
    return response;
  }

  // Sprawdź tokeny w ciasteczkach
  const accessToken = request.cookies.get("accessToken")?.value;

  // Dodaj logowanie dla debugowania (możesz to usunąć w produkcji)
  console.log(`Middleware uruchomione dla ścieżki: ${currentPath}`);
  console.log(`Access token obecny: ${!!accessToken}`);

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

// Dokładna konfiguracja matcher, aby działało tylko dla określonych ścieżek
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
