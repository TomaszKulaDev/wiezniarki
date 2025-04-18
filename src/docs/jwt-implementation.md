# Dokumentacja implementacji JWT z rotacją tokenów w projekcie Więźniarki

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Architektura systemu](#architektura-systemu)
3. [Komponenty i implementacja](#komponenty-i-implementacja)
   - [Serwis JWT](#serwis-jwt)
   - [Konfiguracja JWT](#konfiguracja-jwt)
   - [Middleware Next.js](#middleware-nextjs)
   - [Integracja z usługą autoryzacji](#integracja-z-usługą-autoryzacji)
   - [Endpointy API](#endpointy-api)
   - [Implementacja po stronie klienta](#implementacja-po-stronie-klienta)
4. [Cykl życia tokenów](#cykl-życia-tokenów)
5. [Bezpieczeństwo](#bezpieczeństwo)
6. [Zidentyfikowane problemy i rozwiązania](#zidentyfikowane-problemy-i-rozwiązania)
7. [Rekomendowane usprawnienia](#rekomendowane-usprawnienia)
8. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Wprowadzenie

System JWT (JSON Web Tokens) z rotacją tokenów w projekcie Więźniarki służy do bezpiecznego uwierzytelniania i autoryzacji użytkowników. Implementacja obejmuje mechanizmy generowania, weryfikacji, odświeżania i unieważniania tokenów, a także środki bezpieczeństwa chroniące przed nieautoryzowanym dostępem.

Główne cechy zaimplementowanego systemu:

- Krótkotrwałe tokeny dostępu (access tokens) do autoryzacji (15 minut)
- Długotrwałe tokeny odświeżające (refresh tokens) do odzyskiwania dostępu (7 dni)
- Rotacja tokenów odświeżających przy każdym użyciu
- Przechowywanie tokenów odświeżających w bazie danych MongoDB
- System rodzin tokenów do wykrywania kradzieży tokenów
- HTTP-only cookies dla bezpiecznego przechowywania tokenów

## Architektura systemu

System JWT w projekcie opiera się na następujących komponentach:

1. **Serwis JWT** - zarządzanie tokenami (generowanie, weryfikacja, rotacja)
2. **Konfiguracja JWT** - parametry tokenów (sekrety, czas ważności)
3. **Middleware Next.js** - weryfikacja tokenów w żądaniach i ochrona chronionych ścieżek
4. **Integracja z usługą autoryzacji** - logowanie, wylogowywanie, odświeżanie tokenów
5. **Endpointy API** - punkty końcowe do zarządzania sesją
6. **Implementacja po stronie klienta** - przechowywanie tokenów w ciasteczkach i zarządzanie stanem autoryzacji

## Komponenty i implementacja

### Serwis JWT

Główny serwis zaimplementowany w pliku `src/backend/services/jwtService.ts` zawiera:

```typescript
export const jwtService = {
  // Generowanie tokenu dostępu (krótko żyjącego)
  generateAccessToken(user: Pick<User, "id" | "email" | "role">): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, Buffer.from(jwtConfig.accessToken.secret), {
      expiresIn: jwtConfig.accessToken.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    } as jwt.SignOptions);
  },

  // Generowanie tokenu odświeżającego (długo żyjącego)
  async generateRefreshToken(
    user: Pick<User, "id" | "email" | "role">,
    family?: string
  ): Promise<string> {
    // Losowy token z dodatkową entropią
    const tokenFamily = family || Math.random().toString(36).substring(2);

    const refreshToken = jwt.sign(
      { userId: user.id, family: tokenFamily },
      Buffer.from(jwtConfig.refreshToken.secret),
      {
        expiresIn: jwtConfig.refreshToken.expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      } as jwt.SignOptions
    );

    // Zapisz token odświeżający w bazie danych
    // ...
    return refreshToken;
  },

  // Weryfikacja tokenu dostępu
  verifyAccessToken(token: string): TokenPayload | null {
    // Implementacja weryfikacji tokenu
  },

  // Weryfikacja tokenu odświeżającego
  async verifyRefreshToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    family?: string;
  }> {
    // Implementacja weryfikacji z bazą danych
  },

  // Rotacja tokenów - unieważnij stary i wygeneruj nowy token odświeżający
  async rotateRefreshToken(
    oldToken: string,
    user: Pick<User, "id" | "email" | "role">
  ): Promise<string | null> {
    try {
      const { valid, family } = await this.verifyRefreshToken(oldToken);

      if (!valid || !family) {
        return null;
      }

      // Unieważnij stary token
      await this.revokeRefreshToken(oldToken);

      // Generuj nowy token z tą samą rodziną
      return await this.generateRefreshToken(user, family);
    } catch (error) {
      console.error("Błąd podczas rotacji tokenu:", error);
      return null;
    }
  },

  // Pozostałe metody: unieważnianie, zarządzanie rodzinami tokenów, itp.
};
```

### Konfiguracja JWT

Konfiguracja w pliku `src/backend/config/jwt.ts` definiuje parametry tokenów:

```typescript
export const jwtConfig = {
  accessToken: {
    secret:
      process.env.JWT_ACCESS_TOKEN_SECRET ||
      "fallback_access_secret_development_only",
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m", // 15 minut
  },
  refreshToken: {
    secret:
      process.env.JWT_REFRESH_TOKEN_SECRET ||
      "fallback_refresh_secret_development_only",
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d", // 7 dni
  },
  issuer: process.env.JWT_ISSUER || "wiezniarki.app",
  audience: process.env.JWT_AUDIENCE || "wiezniarki.app",
};
```

### Middleware Next.js

Middleware w pliku `src/middleware.ts` chroni określone ścieżki i zarządza autoryzacją:

```typescript
// Middleware Next.js
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

  // Jeśli mamy token dostępu, kontynuuj nawigację
  if (accessToken) {
    return response;
  }

  // Jeśli nie mamy tokenu dostępu, ale mamy token odświeżający, spróbuj odświeżyć
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (refreshToken) {
    try {
      // Obsługa odświeżania tokenów z timeout dla bezpieczeństwa
      // ...
    } catch (error) {
      // Obsługa błędów
    }
  }

  // Przekierowanie na stronę logowania
  // ...
}

// Konfiguracja ścieżek chronionych
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

### Integracja z usługą autoryzacji

Serwis autoryzacji w pliku `src/backend/services/authService.ts` integruje JWT z procesem uwierzytelniania:

```typescript
export const authService = {
  // Logowanie z generowaniem JWT
  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "passwordHash">;
  }> {
    // Weryfikacja poświadczeń i generowanie tokenów
  },

  // Odświeżanie tokenów
  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const result = await jwtService.verifyRefreshToken(refreshToken);

    if (!result.valid || !result.userId) {
      return null;
    }

    // Pobierz dane użytkownika
    const user = await mongodbService.findDocument<User>(
      dbName,
      COLLECTION_NAME,
      { id: result.userId }
    );

    if (!user) {
      return null;
    }

    // Wygeneruj nowy token dostępu
    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Rotacja tokenu odświeżającego (dla bezpieczeństwa)
    const newRefreshToken = await jwtService.rotateRefreshToken(refreshToken, {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    if (!newRefreshToken) {
      return null;
    }

    return { accessToken, refreshToken: newRefreshToken };
  },

  // Wylogowanie (unieważnienie tokenów)
  async logout(refreshToken: string): Promise<boolean> {
    // Unieważnienie tokenu odświeżającego
  },

  // Pozostałe metody autoryzacji
};
```

### Endpointy API

Zaimplementowane endpointy API do zarządzania sesją:

1. **`/api/auth/login`** - logowanie i wydawanie tokenów
2. **`/api/auth/register`** - rejestracja użytkownika
3. **`/api/auth/me`** - pobieranie danych zalogowanego użytkownika
4. **`/api/auth/refresh`** - odświeżanie wygasłych tokenów
5. **`/api/auth/logout`** - wylogowanie i unieważnienie tokenów
6. **`/api/auth/verify-email`** - weryfikacja konta przez email
7. **`/api/auth/forgot-password`** - żądanie resetowania hasła
8. **`/api/auth/reset-password`** - resetowanie hasła

### Implementacja po stronie klienta

Frontend używa Redux Toolkit i RTK Query do zarządzania stanem autoryzacji:

```typescript
// Definiowanie API za pomocą RTK Query
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery, // fetch z dołączaniem credentials
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query<Omit<User, "passwordHash">, void>({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    // Inne endpointy
  }),
});

// W komponencie Navbar.tsx - obsługa stanu autoryzacji
const { data: user, isLoading } = useGetCurrentUserQuery();

// Sprawdzamy czy otrzymaliśmy dane użytkownika i aktualizujemy stan Redux
useEffect(() => {
  if (user) {
    dispatch(
      loginSuccess({
        id: user.id,
        email: user.email,
        role: user.role,
      })
    );
    setIsMounted(true);
  } else if (!isLoading) {
    setIsMounted(true);
  }
}, [user, isLoading, dispatch]);
```

## Cykl życia tokenów

### Logowanie

1. Użytkownik podaje poświadczenia
2. System weryfikuje poświadczenia
3. System generuje token dostępu (krótkotrwały, 15 minut)
4. System generuje token odświeżający (długotrwały, 7 dni) i zapisuje go w bazie
5. Tokeny są zwracane do klienta i przechowywane w HTTP-only cookies

### Autoryzacja żądań

1. Middleware Next.js sprawdza obecność ciasteczka z access token
2. Jeśli token jest ważny, żądanie przechodzi
3. Jeśli token jest nieważny lub wygasł, middleware próbuje odświeżyć go używając refresh token

### Odświeżanie tokenów

1. Gdy token dostępu wygasa, middleware próbuje odświeżyć go używając refresh token
2. Serwer weryfikuje token odświeżający
3. Jeśli jest ważny, serwer:
   - Generuje nowy token dostępu
   - Unieważnia stary token odświeżający
   - Generuje nowy token odświeżający (rotacja)
   - Ustawia nowe tokeny w cookies
4. Tokeny są rotowane przy każdym odświeżeniu dla zwiększenia bezpieczeństwa

### Wylogowanie

1. Klient wywołuje endpoint `/api/auth/logout`
2. Serwer unieważnia token odświeżający w bazie danych
3. Serwer usuwa ciasteczka z tokenami
4. Stan autoryzacji w Redux jest resetowany

## Bezpieczeństwo

Zaimplementowany system JWT zawiera następujące mechanizmy bezpieczeństwa:

1. **HTTP-only cookies** - tokeny są przechowywane w ciasteczkach HTTP-only, co zabezpiecza przed atakami XSS
2. **Krótki czas życia tokenów dostępu** (15 minut) - minimalizacja ryzyka w przypadku kradzieży
3. **Rotacja tokenów odświeżających** - każde użycie tokenu generuje nowy token
4. **System rodzin tokenów** - wykrywanie równoczesnego użycia tego samego tokenu (potencjalna kradzież)
5. **Unieważnianie tokenów** - możliwość natychmiastowego unieważnienia sesji
6. **Przechowywanie tokenów w bazie danych** - umożliwia kontrolę nad sesjami i ich unieważnianie
7. **Timeout dla odświeżania tokenów** - zabezpiecza przed zawieszeniem procesu odświeżania
8. **SameSite=lax dla cookies** - zabezpieczenie przed atakami CSRF

## Zidentyfikowane problemy i rozwiązania

Podczas analizy systemu zidentyfikowano i rozwiązano następujące problemy:

1. **Niespójność przechowywania tokenów** - konflikt między localStorage i ciasteczkami HTTP-only

   - **Rozwiązanie**: Używanie spójnie tylko jednego mechanizmu (ciasteczek HTTP-only)

2. **Nieprawidłowa konfiguracja middleware** - nieoptymalna konfiguracja matchera middleware

   - **Rozwiązanie**: Precyzyjna konfiguracja ścieżek chronionych: `/dashboard/:path*`, `/profile/:path*`

3. **Problemy z obsługą błędów 404** - niepotrzebne wylogowanie na nieistniejących stronach

   - **Rozwiązanie**: Lepsza obsługa błędów i precyzyjne dopasowywanie ścieżek w middleware

4. **Brak obsługi timeoutu** - potencjalne zawieszanie się zapytań odświeżania tokenów
   - **Rozwiązanie**: Dodany timeout (5 sekund) i AbortController dla odświeżania tokenów

## Rekomendowane usprawnienia

Pomimo kompleksowej implementacji, system można dalej ulepszyć:

1. **Mechanizm wykrywania kradzieży tokenów**:

   - Pełne wykorzystanie funkcji `revokeTokenFamily` przy wykryciu podejrzanej aktywności
   - Logowanie podejrzanych wzorców użycia tokenów

2. **Zarządzanie sesjami**:

   - Implementacja mechanizmu wygaśnięcia sesji podczas bezczynności
   - Panel administratora do zarządzania aktywnymi sesjami

3. **Monitorowanie bezpieczeństwa**:

   - Rozbudowa mechanizmów logowania nieudanych prób autoryzacji
   - Alerty bezpieczeństwa dla podejrzanych działań
   - Limity logowań z jednego adresu IP

4. **Automatyczne czyszczenie wygasłych tokenów**:

   - Wdrożenie zadania cron dla funkcji `cleanupExpiredTokens`

5. **Uwierzytelnianie dwuskładnikowe**:
   - Implementacja opcjonalnego 2FA dla dodatkowej warstwy zabezpieczeń

## Rozwiązywanie problemów

### Typowe problemy i rozwiązania

1. **Nieoczekiwane wylogowanie przy odświeżaniu strony**

   - Sprawdź implementację middleware i jego konfigurację
   - Upewnij się, że cookies są poprawnie ustawiane (path, domain, httpOnly)
   - Zweryfikuj, czy middleware nie wykonuje się niepotrzebnie na ścieżkach, które nie wymagają autoryzacji

2. **Nieoczekiwane wylogowanie po przejściu na stronę 404**

   - Zoptymalizuj konfigurację matchera middleware, aby działał tylko na określonych ścieżkach
   - W pliku not-found.tsx nie wywołuj niepotrzebnych zapytań autoryzacyjnych

3. **Token nie jest akceptowany przez API**

   - Sprawdź czy token nie wygasł
   - Zweryfikuj czy sekret JWT jest taki sam po stronie klienta i serwera
   - Upewnij się, że tokeny są poprawnie przechowywane w ciasteczkach z opcją `httpOnly`

4. **Odświeżanie tokenów nie działa**
   - Sprawdź w DevTools zakładkę Network, czy żądanie do `/api/auth/refresh` jest wykonywane
   - Upewnij się, że token odświeżający nie wygasł lub nie został unieważniony
   - Sprawdź timeout dla zapytania odświeżania (domyślnie 5 sekund)

---

Dokumentacja przygotowana przez zespół projektowy Więźniarki. Ostatnia aktualizacja: [Obecna data]
