# Dokumentacja systemu wysyłki emaili w projekcie Więźniarki

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Architektura systemu](#architektura-systemu)
3. [Konfiguracja](#konfiguracja)
   - [Zmienne środowiskowe](#zmienne-środowiskowe)
   - [Gmail - specjalna konfiguracja](#gmail---specjalna-konfiguracja)
4. [Implementacja](#implementacja)
   - [emailService.ts](#emailservicets)
   - [Integracja z authService.ts](#integracja-z-authservicets)
5. [Rodzaje wysyłanych wiadomości](#rodzaje-wysyłanych-wiadomości)
6. [Środowisko deweloperskie vs produkcyjne](#środowisko-deweloperskie-vs-produkcyjne)
7. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
8. [Przyszłe rozszerzenia](#przyszłe-rozszerzenia)

## Wprowadzenie

System wysyłki emaili w projekcie Więźniarki umożliwia automatyczne wysyłanie powiadomień email do użytkowników w różnych przypadkach interakcji z systemem, w tym:

- Potwierdzenie rejestracji i weryfikacja konta
- Resetowanie hasła
- (Przyszłe) Powiadomienia o interakcjach w systemie

System bazuje na bibliotece Nodemailer i zapewnia elastyczną konfigurację umożliwiającą działanie zarówno w środowisku deweloperskim, jak i produkcyjnym.

## Architektura systemu

System wysyłki emaili składa się z:

1. **emailService.ts** - główny moduł usługi odpowiedzialny za konfigurację i wysyłanie wiadomości
2. **Integracja z authService.ts** - wykorzystanie usługi email przy weryfikacji konta i resetowaniu hasła
3. **Konfiguracja środowiskowa** - zmienne w plikach `.env` i `.env.local`
4. **Szablony HTML** - gotowe szablony wiadomości dla różnych przypadków użycia

## Konfiguracja

### Zmienne środowiskowe

Wymagane zmienne środowiskowe (w plikach `.env` dla produkcji i `.env.local` dla środowiska deweloperskiego):

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=twój_email@gmail.com
EMAIL_PASSWORD=twoje_hasło_aplikacji
EMAIL_FROM=nazwa_nadawcy@domena.pl
NEXT_PUBLIC_APP_URL=https://twoj-adres-url.pl

### Gmail - specjalna konfiguracja

Jeśli używasz konta Gmail jako nadawcy wiadomości, musisz wykonać dodatkowe kroki:

1. Włącz weryfikację dwuetapową dla konta Google:

   - Przejdź do [Bezpieczeństwo konta Google](https://myaccount.google.com/security)
   - Włącz weryfikację dwuetapową

2. Wygeneruj hasło do aplikacji:
   - Przejdź do [Hasła do aplikacji](https://myaccount.google.com/apppasswords)
   - Wybierz aplikację: "Inna (nazwa niestandardowa)" i wpisz "Więźniarki"
   - Kliknij "Generuj"
   - Skopiuj wygenerowane hasło (16 znaków bez spacji) i użyj go jako `EMAIL_PASSWORD`

> **WAŻNE**: Nie używaj zwykłego hasła do konta Google w zmiennej `EMAIL_PASSWORD`. Gmail wymaga hasła aplikacji dla zewnętrznych aplikacji korzystających z SMTP.

## Implementacja

### emailService.ts

Główna implementacja usługi email znajduje się w pliku `src/backend/services/emailService.ts` i zawiera:

1. **createTransporter()** - funkcja tworząca transporter Nodemailer na podstawie konfiguracji
2. **createEtherealTransporter()** - funkcja tworząca testowy transporter dla środowiska deweloperskiego
3. **emailService** - obiekt eksportujący metody:
   - `sendVerificationEmail(email, verificationCode)` - wysyłanie emaila weryfikacyjnego
   - `sendPasswordResetEmail(email, resetToken)` - wysyłanie emaila z linkiem do resetowania hasła
   - `sendEmail(options)` - ogólna metoda do wysyłania dowolnych emaili

### Integracja z authService.ts

Usługa email jest zintegrowana z `authService.ts` i wykorzystywana w następujących metodach:

1. **register()** - wysyłanie kodu weryfikacyjnego po rejestracji
2. **requestPasswordReset()** - wysyłanie tokenu do resetowania hasła
3. **verifyAccount()** - weryfikacja kodu aktywacyjnego

## Rodzaje wysyłanych wiadomości

Aktualnie system obsługuje dwa rodzaje wiadomości:

1. **Email weryfikacyjny** - zawiera:

   - Link do strony weryfikacyjnej z zakodowanymi parametrami email i kod weryfikacyjny
   - Kod weryfikacyjny do ręcznego wprowadzenia
   - Informacje o ważności kodu (24 godziny)

2. **Email resetowania hasła** - zawiera:
   - Link do strony resetowania hasła z zakodowanymi parametrami email i token
   - Informacje o ważności linku (1 godzina)

Każda wiadomość zawiera zarówno wersję HTML jak i automatycznie generowaną wersję tekstową.

## Środowisko deweloperskie vs produkcyjne

System obsługuje dwa tryby pracy, zależne od zmiennej środowiskowej `NODE_ENV`:

### Tryb deweloperski (`NODE_ENV=development`)

- Jeśli nie skonfigurowano zmiennych email, używany jest serwis Ethereal Email do testowania
- Kody weryfikacyjne i tokeny resetowania są wyświetlane w konsoli
- W pliku `.env.local` można skonfigurować prawdziwy serwer SMTP do testów
- Konta są automatycznie weryfikowane bez konieczności potwierdzania emaila

### Tryb produkcyjny (`NODE_ENV=production`)

- Wymagana jest pełna konfiguracja SMTP
- Wszystkie emaile są fizycznie wysyłane
- Konta wymagają weryfikacji przez email
- Błędy wysyłania emaili są rejestrowane i zgłaszane

## Rozwiązywanie problemów

### Typowe problemy i rozwiązania

1. **Email nie jest wysyłany w środowisku deweloperskim**

   - Jest to oczekiwane zachowanie. Sprawdź konsolę, gdzie wyświetlane są kody weryfikacyjne.
   - Jeśli chcesz testować fizyczne wysyłanie, ustaw `NODE_ENV=production` tymczasowo.

2. **Błąd uwierzytelnienia SMTP**

   - Dla Gmail: upewnij się, że używasz hasła do aplikacji, nie zwykłego hasła
   - Sprawdź poprawność adresu email i hasła
   - Sprawdź czy port jest prawidłowy (587 dla TLS, 465 dla SSL)

3. **Email wysyłany, ale nie dociera do skrzynki**
   - Sprawdź folder SPAM
   - Upewnij się, że adres email odbiorcy jest poprawny
   - W przypadku Gmaila, sprawdź czy Twoje konto nie jest ograniczone przez limit wysyłki

## Przyszłe rozszerzenia

Planowane rozszerzenia systemu wysyłki emaili:

1. Dodanie nowych rodzajów wiadomości:

   - Powiadomienia o nowych dopasowaniach
   - Powiadomienia o nowych wiadomościach
   - Newsletter i komunikaty administracyjne

2. Ulepszenia techniczne:

   - Szablony Handlebars/EJS zamiast literałów szablonowych
   - Kolejkowanie emaili dla lepszej skalowalności
   - Śledzenie dostarczalności emaili

3. Ulepszenia UI/UX:
   - Bardziej zaawansowane szablony HTML
   - Dostosowanie wyglądu do preferencji użytkownika

---

**Uwaga**: Chronienie poufnych danych, takich jak hasła i dane uwierzytelniające, jest kluczowe. Nigdy nie umieszczaj rzeczywistych haseł w plikach, które mogą trafić do repozytorium kodu.

Gdzie:

- `EMAIL_HOST` - adres serwera SMTP
- `EMAIL_PORT` - port serwera SMTP (najczęściej 587 dla TLS lub 465 dla SSL)
- `EMAIL_USER` - nazwa użytkownika do logowania SMTP
- `EMAIL_PASSWORD` - hasło do logowania SMTP (dla Gmail: hasło aplikacji)
- `EMAIL_FROM` - adres email nadawcy
- `NEXT_PUBLIC_APP_URL` - bazowy URL aplikacji (używany do tworzenia linków w emailach)

### Gmail - specjalna konfiguracja

Jeśli używasz konta Gmail jako nadawcy wiadomości, musisz wykonać dodatkowe kroki:

1. Włącz weryfikację dwuetapową dla konta Google:

   - Przejdź do [Bezpieczeństwo konta Google](https://myaccount.google.com/security)
   - Włącz weryfikację dwuetapową

2. Wygeneruj hasło do aplikacji:
   - Przejdź do [Hasła do aplikacji](https://myaccount.google.com/apppasswords)
   - Wybierz aplikację: "Inna (nazwa niestandardowa)" i wpisz "Więźniarki"
   - Kliknij "Generuj"
   - Skopiuj wygenerowane hasło (16 znaków bez spacji) i użyj go jako `EMAIL_PASSWORD`

> **WAŻNE**: Nie używaj zwykłego hasła do konta Google w zmiennej `EMAIL_PASSWORD`. Gmail wymaga hasła aplikacji dla zewnętrznych aplikacji korzystających z SMTP.

## Implementacja

### emailService.ts

Główna implementacja usługi email znajduje się w pliku `src/backend/services/emailService.ts` i zawiera:

1. **createTransporter()** - funkcja tworząca transporter Nodemailer na podstawie konfiguracji
2. **createEtherealTransporter()** - funkcja tworząca testowy transporter dla środowiska deweloperskiego
3. **emailService** - obiekt eksportujący metody:
   - `sendVerificationEmail(email, verificationCode)` - wysyłanie emaila weryfikacyjnego
   - `sendPasswordResetEmail(email, resetToken)` - wysyłanie emaila z linkiem do resetowania hasła
   - `sendEmail(options)` - ogólna metoda do wysyłania dowolnych emaili

### Integracja z authService.ts

Usługa email jest zintegrowana z `authService.ts` i wykorzystywana w następujących metodach:

1. **register()** - wysyłanie kodu weryfikacyjnego po rejestracji
2. **requestPasswordReset()** - wysyłanie tokenu do resetowania hasła
3. **verifyAccount()** - weryfikacja kodu aktywacyjnego

## Rodzaje wysyłanych wiadomości

Aktualnie system obsługuje dwa rodzaje wiadomości:

1. **Email weryfikacyjny** - zawiera:

   - Link do strony weryfikacyjnej z zakodowanymi parametrami email i kod weryfikacyjny
   - Kod weryfikacyjny do ręcznego wprowadzenia
   - Informacje o ważności kodu (24 godziny)

2. **Email resetowania hasła** - zawiera:
   - Link do strony resetowania hasła z zakodowanymi parametrami email i token
   - Informacje o ważności linku (1 godzina)

Każda wiadomość zawiera zarówno wersję HTML jak i automatycznie generowaną wersję tekstową.

## Środowisko deweloperskie vs produkcyjne

System obsługuje dwa tryby pracy, zależne od zmiennej środowiskowej `NODE_ENV`:

### Tryb deweloperski (`NODE_ENV=development`)

- Jeśli nie skonfigurowano zmiennych email, używany jest serwis Ethereal Email do testowania
- Kody weryfikacyjne i tokeny resetowania są wyświetlane w konsoli
- W pliku `.env.local` można skonfigurować prawdziwy serwer SMTP do testów
- Konta są automatycznie weryfikowane bez konieczności potwierdzania emaila

### Tryb produkcyjny (`NODE_ENV=production`)

- Wymagana jest pełna konfiguracja SMTP
- Wszystkie emaile są fizycznie wysyłane
- Konta wymagają weryfikacji przez email
- Błędy wysyłania emaili są rejestrowane i zgłaszane

## Rozwiązywanie problemów

### Typowe problemy i rozwiązania

1. **Email nie jest wysyłany w środowisku deweloperskim**

   - Jest to oczekiwane zachowanie. Sprawdź konsolę, gdzie wyświetlane są kody weryfikacyjne.
   - Jeśli chcesz testować fizyczne wysyłanie, ustaw `NODE_ENV=production` tymczasowo.

2. **Błąd uwierzytelnienia SMTP**

   - Dla Gmail: upewnij się, że używasz hasła do aplikacji, nie zwykłego hasła
   - Sprawdź poprawność adresu email i hasła
   - Sprawdź czy port jest prawidłowy (587 dla TLS, 465 dla SSL)

3. **Email wysyłany, ale nie dociera do skrzynki**
   - Sprawdź folder SPAM
   - Upewnij się, że adres email odbiorcy jest poprawny
   - W przypadku Gmaila, sprawdź czy Twoje konto nie jest ograniczone przez limit wysyłki

## Przyszłe rozszerzenia

Planowane rozszerzenia systemu wysyłki emaili:

1. Dodanie nowych rodzajów wiadomości:

   - Powiadomienia o nowych dopasowaniach
   - Powiadomienia o nowych wiadomościach
   - Newsletter i komunikaty administracyjne

2. Ulepszenia techniczne:

   - Szablony Handlebars/EJS zamiast literałów szablonowych
   - Kolejkowanie emaili dla lepszej skalowalności
   - Śledzenie dostarczalności emaili

3. Ulepszenia UI/UX:
   - Bardziej zaawansowane szablony HTML
   - Dostosowanie wyglądu do preferencji użytkownika

---

**Uwaga**: Chronienie poufnych danych, takich jak hasła i dane uwierzytelniające, jest kluczowe. Nigdy nie umieszczaj rzeczywistych haseł w plikach, które mogą trafić do repozytorium kodu.
