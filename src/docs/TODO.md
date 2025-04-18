# Lista zadań do implementacji - Więźniarki

## Backend

### Baza danych

- [] Wybór systemu bazodanowego (PostgreSQL/MongoDB)
- [] Konfiguracja połączenia z bazą danych
- [ ] Definicja schematów/modeli dla bazy danych
- [ ] Migracja mockowych danych do bazy
- [ ] Implementacja repozytoriów dla dostępu do danych

### API Endpointy

- [ ] API dla wiadomości (`/api/messages`)
  - [ ] Pobieranie wszystkich wiadomości użytkownika
  - [ ] Pobieranie konwersacji między użytkownikami
  - [ ] Wysyłanie nowej wiadomości
  - [ ] Oznaczanie wiadomości jako przeczytanej
- [ ] API dla dopasowań (`/api/matches`)
  - [ ] Pobieranie dopasowań użytkownika
  - [ ] Tworzenie nowego dopasowania
  - [ ] Akceptacja/odrzucenie dopasowania
- [ ] API dla zarządzania kontem (`/api/user`)
  - [ ] Aktualizacja danych użytkownika
  - [ ] Zmiana hasła
  - [ ] Usunięcie konta
- [ ] API dla statystyk (`/api/stats`)
  - [ ] Pobieranie statystyk użytkownika
  - [ ] Statystyki dla administratorów

### Autentykacja

- [ ] Implementacja JWT (JSON Web Tokens)
  - [ ] Generowanie tokenów
  - [ ] Weryfikacja tokenów
  - [ ] Odświeżanie tokenów
- [ ] Weryfikacja email
  - [ ] Wysyłanie emaili weryfikacyjnych
  - [ ] Endpoint do weryfikacji konta
- [ ] Odzyskiwanie hasła
  - [ ] Wysyłanie emaili resetujących hasło
  - [ ] Endpoint do resetowania hasła

### Bezpieczeństwo

- [ ] Middleware do weryfikacji autoryzacji
- [ ] Walidacja danych wejściowych
- [ ] Obsługa limitów zapytań (rate limiting)
- [ ] Szyfrowanie wrażliwych danych
- [ ] Logowanie zdarzeń bezpieczeństwa

## Frontend

### Funkcjonalności aplikacji

- [ ] System wiadomości
  - [ ] Lista konwersacji
  - [ ] Widok konwersacji
  - [ ] Formularz nowej wiadomości
  - [ ] Powiadomienia o nowych wiadomościach
- [ ] System dopasowań
  - [ ] Widok dostępnych dopasowań
  - [ ] Akceptacja/odrzucanie dopasowań
  - [ ] Powiadomienia o nowych dopasowaniach
- [ ] Zarządzanie profilem
  - [ ] Formularz tworzenia profilu
  - [ ] Formularz edycji profilu
  - [ ] Przesyłanie i zarządzanie zdjęciami
- [ ] System powiadomień
  - [ ] Lista powiadomień
  - [ ] Oznaczanie jako przeczytane
  - [ ] Preferencje powiadomień

### RTK Query

- [ ] `messagesApi` - API do zarządzania wiadomościami
  - [ ] `getMessages` - pobieranie wszystkich wiadomości
  - [ ] `getConversation` - pobieranie konwersacji
  - [ ] `sendMessage` - wysyłanie wiadomości
  - [ ] `markAsRead` - oznaczanie jako przeczytane
- [ ] `matchesApi` - API do zarządzania dopasowaniami
  - [ ] `getMatches` - pobieranie dopasowań
  - [ ] `createMatch` - tworzenie dopasowania
  - [ ] `acceptMatch` - akceptacja dopasowania
  - [ ] `rejectMatch` - odrzucenie dopasowania
- [ ] `userApi` - API do zarządzania kontem
  - [ ] `updateUser` - aktualizacja danych
  - [ ] `changePassword` - zmiana hasła
  - [ ] `deleteAccount` - usunięcie konta

### Funkcje użytkownika

- [ ] System zarządzania kontem
  - [ ] Zmiana hasła
  - [ ] Edycja danych kontaktowych
  - [ ] Ustawienia prywatności
- [ ] System weryfikacji
  - [ ] Interfejs weryfikacji emaila
  - [ ] Ponowne wysyłanie kodu weryfikacyjnego
- [ ] System odzyskiwania hasła
  - [ ] Formularz zapomnienia hasła
  - [ ] Interfejs resetowania hasła

## Integracja i wdrożenie

### Integracja

- [ ] Integracja wszystkich API z frontend
- [ ] Integracja autentykacji z całą aplikacją
- [ ] Testy integracyjne

### Wdrożenie

- [ ] Konfiguracja środowiska produkcyjnego
- [ ] Konfiguracja CORS i bezpieczeństwa
- [ ] Automatyzacja procesu wdrożenia (CI/CD)
- [ ] Monitoring i logowanie

## Testy i QA

- [ ] Testy jednostkowe
  - [ ] Backend
  - [ ] Frontend
- [ ] Testy end-to-end
- [ ] Testy bezpieczeństwa
- [ ] Audyt dostępności (accessibility)

## Dokumentacja

- [ ] Dokumentacja API
- [ ] Dokumentacja funkcjonalności
- [ ] Instrukcja wdrożenia
