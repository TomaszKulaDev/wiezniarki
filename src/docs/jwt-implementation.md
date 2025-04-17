Analiza implementacji JWT z rotacją tokenów w projekcie Więźniarki
Po dokładnej analizie kodu źródłowego, poniżej przedstawiam stan implementacji systemu JWT z rotacją tokenów.

1. Elementy już zaimplementowane
   Backend
   Serwis JWT (jwtService.ts)
   ✅ Generowanie tokenów dostępu (access tokens)
   ✅ Generowanie tokenów odświeżających (refresh tokens)
   ✅ Weryfikacja tokenów
   ✅ Unieważnianie tokenów
   ✅ Rotacja tokenów odświeżających
   ✅ System rodzin tokenów (ochrona przed kradzieżą)
   ✅ Czyszczenie wygasłych tokenów
   Konfiguracja JWT (jwt.config.ts)
   ✅ Ustawienia sekretów dla tokenów
   ✅ Konfiguracja czasu wygaśnięcia (15 minut dla access token, 7 dni dla refresh token)
   ✅ Parametry wydawcy (issuer) i odbiorcy (audience)
   Middleware autoryzacji (authMiddleware.ts)
   ✅ Weryfikacja tokenu w nagłówku żądania
   ✅ Przekazywanie danych użytkownika do handlerów
   ✅ Middleware kontroli dostępu opartej na rolach
   Integracja z serwisem autoryzacji (authService.ts)
   ✅ Logowanie z generowaniem JWT
   ✅ Odświeżanie tokenów
   ✅ Wylogowanie z unieważnianiem tokenów
   Endpointy API:
   ✅ /api/auth/login - endpoint logowania (wydawanie tokenów)
   ✅ /api/auth/register - rejestracja użytkownika
   ✅ /api/auth/me - pobieranie danych zalogowanego użytkownika
   ✅ /api/auth/refresh - odświeżanie tokenów
   ✅ /api/auth/logout - wylogowywanie (unieważnianie tokenów)
   ✅ /api/auth/verify-email - weryfikacja konta przez email
   ✅ /api/auth/forgot-password - żądanie resetowania hasła
   ✅ /api/auth/reset-password - resetowanie hasła
   Frontend
   Konfiguracja Redux RTK Query (authApi.ts)
   ✅ BaseQuery z automatycznym odświeżaniem tokenów
   ✅ Mutacje i zapytania do wszystkich endpointów
   ✅ Obsługa wygasania tokenów i odświeżania
   Komponenty uwierzytelniania
   ✅ Logowanie z zapisywaniem tokenów w localStorage/sessionStorage
   ✅ Wylogowywanie z usuwaniem tokenów
   ✅ Obsługa resetowania hasła
   Zarządzanie stanem autoryzacji
   ✅ Przechowywanie tokenów
   ✅ Automatyczne odświeżanie tokenów
   ✅ Automatyczne dodawanie tokenu do nagłówków żądań
2. Elementy wymagające dopracowania
   Zabezpieczenia tokenu
   ⚠️ Brak zabezpieczenia przed atakami XSS (tokeny przechowywane w localStorage)
   ⚠️ Brak implementacji tokenów CSRF dla operacji modyfikujących
   ⚠️ Brak zabezpieczenia przed wyścigami (race conditions) przy odświeżaniu tokenu
   Monitorowanie i audyt
   ⚠️ Brak mechanizmu logowania nieudanych prób autoryzacji
   ⚠️ Brak monitorowania podejrzanych wzorców używania tokenów
   Konfiguracja produkcyjna
   ⚠️ Sekret JWT powinien być bezpieczniej przechowywany (np. zmienne środowiskowe)
   ⚠️ Brak możliwości konfiguracji czasu wygaśnięcia tokenów w runtime
   Testy
   ⚠️ Brak kompleksowych testów dla systemu autoryzacji
3. Rekomendowane usprawnienia
   Bezpieczeństwo tokenów
   Ochrona przed XSS:
   Rozważyć użycie HttpOnly cookies zamiast localStorage do przechowywania refresh token
   Zaimplementować mechanizm SameSite=strict dla cookies

# Dokumentacja implementacji JWT z rotacją tokenów

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Architektura systemu](#architektura-systemu)
3. [Komponenty i implementacja](#komponenty-i-implementacja)
   - [Serwis JWT](#serwis-jwt)
   - [Konfiguracja JWT](#konfiguracja-jwt)
   - [Middleware autoryzacji](#middleware-autoryzacji)
   - [Integracja z usługą autoryzacji](#integracja-z-usługą-autoryzacji)
   - [Endpointy API](#endpointy-api)
   - [Implementacja po stronie klienta](#implementacja-po-stronie-klienta)
4. [Cykl życia tokenów](#cykl-życia-tokenów)
5. [Bezpieczeństwo](#bezpieczeństwo)
6. [Rekomendowane usprawnienia](#rekomendowane-usprawnienia)
7. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Wprowadzenie

System JWT (JSON Web Tokens) z rotacją tokenów w projekcie Więźniarki służy do bezpiecznego uwierzytelniania i autoryzacji użytkowników. Implementacja obejmuje mechanizmy generowania, weryfikacji, odświeżania i unieważniania tokenów, a także środki bezpieczeństwa chroniące przed nieautoryzowanym dostępem.

Główne cechy zaimplementowanego systemu:

- Krótkotrwałe tokeny dostępu (access tokens) do autoryzacji
- Długotrwałe tokeny odświeżające (refresh tokens) do odzyskiwania dostępu
- Rotacja tokenów odświeżających przy każdym użyciu
- Przechowywanie tokenów odświeżających w bazie danych
- System rodzin tokenów do wykrywania kradzieży tokenów

## Architektura systemu

System JWT w projekcie opiera się na następujących komponentach:

1. **Serwis JWT** - zarządzanie tokenami (generowanie, weryfikacja, rotacja)
2. **Konfiguracja JWT** - parametry tokenów (sekrety, czas ważności)
3. **Middleware autoryzacji** - weryfikacja tokenów w żądaniach API
4. **Integracja z usługą autoryzacji** - logowanie, wylogowywanie, odświeżanie tokenów
5. **Endpointy API** - punkty końcowe do zarządzania sesją
6. **Implementacja po stronie klienta** - przechowywanie i odświeżanie tokenów w przeglądarce

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
    // Implementacja z zapisem tokenu w bazie danych
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

  // Pozostałe metody: unieważnianie, rotacja tokenów, itp.
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

### Middleware autoryzacji

Middleware w pliku `src/backend/middlewares/authMiddleware.ts` weryfikuje tokeny w żądaniach:

```typescript
export async function authMiddleware(
  request: AuthenticatedRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Pobranie i weryfikacja tokenu z nagłówka
    // Dodanie danych użytkownika do żądania
    // Przekazanie kontroli do właściwego handlera
  } catch (error) {
    // Obsługa błędów
  }
}

// Middleware do weryfikacji roli
export function roleMiddleware(
  request: AuthenticatedRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  allowedRoles: string[]
): Promise<NextResponse> {
  // Implementacja kontroli dostępu opartej na rolach
}
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
    // Weryfikacja poświadczeń
    // Generowanie tokenów JWT
    // Zwracanie tokenów i danych użytkownika
  },

  // Odświeżanie tokenów
  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    // Weryfikacja tokenu odświeżającego
    // Generowanie nowego tokenu dostępu
    // Rotacja tokenu odświeżającego
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
2. **`/api/auth/refresh`** - odświeżanie wygasłych tokenów
3. **`/api/auth/logout`** - wylogowanie i unieważnienie tokenów
4. **`/api/auth/me`** - pobieranie danych zalogowanego użytkownika

### Implementacja po stronie klienta

Frontend używa RTK Query z automatycznym odświeżaniem tokenów:

```typescript
// Zaawansowany baseQuery z automatycznym odświeżaniem tokenów
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Próba odświeżenia tokenów
    // Ponowna próba oryginalnego zapytania z nowym tokenem
  }

  return result;
};

// Obsługa tokenów w komponencie Navbar
const checkAuthStatus = useCallback(() => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // Automatyczne pobieranie danych użytkownika
    } else if (refreshToken) {
      // Próba odświeżenia tokenu
    } else {
      // Wylogowanie
    }
  } catch (error) {
    // Obsługa błędów
  }
}, [dispatch, refresh]);
```

## Cykl życia tokenów

### Logowanie

1. Użytkownik podaje poświadczenia
2. System weryfikuje poświadczenia
3. System generuje token dostępu (krótkotrwały)
4. System generuje token odświeżający (długotrwały) i zapisuje go w bazie
5. Tokeny są zwracane do klienta i przechowywane w localStorage/sessionStorage

### Autoryzacja żądań

1. Klient dołącza token dostępu w nagłówku Authorization
2. Serwer weryfikuje token przy każdym żądaniu
3. Serwer odrzuca żądania z nieważnym tokenem (status 401)

### Odświeżanie tokenów

1. Gdy token dostępu wygasa, klient wysyła token odświeżający do endpointu `/api/auth/refresh`
2. Serwer weryfikuje token odświeżający
3. Jeśli jest ważny, serwer:
   - Generuje nowy token dostępu
   - Unieważnia stary token odświeżający
   - Generuje nowy token odświeżający (rotacja)
   - Zwraca nową parę tokenów do klienta

### Wylogowanie

1. Klient wysyła token odświeżający do endpointu `/api/auth/logout`
2. Serwer unieważnia token odświeżający w bazie danych
3. Klient usuwa tokeny z localStorage/sessionStorage

## Bezpieczeństwo

Zaimplementowany system JWT zawiera następujące mechanizmy bezpieczeństwa:

1. **Krótki czas życia tokenów dostępu** - minimalizacja ryzyka w przypadku kradzieży
2. **Rotacja tokenów odświeżających** - każde użycie tokenu generuje nowy token
3. **System rodzin tokenów** - wykrywanie równoczesnego użycia tego samego tokenu (potencjalna kradzież)
4. **Unieważnianie tokenów** - możliwość natychmiastowego unieważnienia sesji
5. **Weryfikacja podpisu** - zapewnienie integralności tokenów
6. **Kontrola dostępu oparta na rolach** - ograniczenie dostępu do zasobów

## Rekomendowane usprawnienia

Pomimo kompleksowej implementacji, system można dalej ulepszyć:

1. **Przechowywanie tokenów**:

   - Używanie HttpOnly cookies zamiast localStorage dla tokenów odświeżających
   - Implementacja zabezpieczeń SameSite=strict dla cookies

2. **Ochrona przed CSRF**:

   - Dodanie tokenów CSRF dla operacji modyfikujących
   - Weryfikacja nagłówków Origin/Referer

3. **Monitorowanie bezpieczeństwa**:

   - Logowanie nieudanych prób autoryzacji
   - Wykrywanie podejrzanych wzorców użycia
   - Alerty bezpieczeństwa

4. **Konfiguracja produkcyjna**:
   - Bezpieczniejsze przechowywanie sekretów JWT
   - Rotacja sekretów JWT
   - Kompleksowa konfiguracja CORS

## Rozwiązywanie problemów

### Typowe problemy i rozwiązania

1. **Token nie jest akceptowany przez API**

   - Sprawdź czy token nie wygasł
   - Upewnij się, że nagłówek Authorization jest poprawnie sformatowany (`Bearer TOKEN`)
   - Zweryfikuj czy sekret JWT jest taki sam po stronie klienta i serwera

2. **Odświeżanie tokenów nie działa**

   - Sprawdź czy token odświeżający nie wygasł
   - Upewnij się, że token nie został już użyty (każda rotacja unieważnia poprzedni token)
   - Zweryfikuj czy token jest poprawnie przechowywany w bazie danych

3. **Problemy z automatycznym odświeżaniem**
   - Upewnij się, że implementacja `baseQueryWithReauth` jest poprawna
   - Sprawdź czy klient prawidłowo przechowuje nowe tokeny po odświeżeniu

---

Dokumentacja przygotowana przez zespół projektowy Więźniarki.
