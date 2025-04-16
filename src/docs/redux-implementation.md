# Dokumentacja implementacji Redux Toolkit i RTK Query

## Struktura Store

Projekt wykorzystuje Redux Toolkit i RTK Query do zarządzania stanem aplikacji i komunikacji z API. Główna struktura znajduje się w katalogu `src/frontend/store`:

src/frontend/store/
├── apis/ # Definicje API dla RTK Query
│ ├── profileApi.ts # API dla operacji na profilach
│ ├── authApi.ts # API dla autoryzacji i użytkowników
│ └── statsApi.ts # API dla statystyk
├── slices/ # Slices dla Redux Toolkit
│ ├── authSlice.ts # Stan autoryzacji
│ ├── profileSlice.ts # Zarządzanie stanem profili i filtrów
│ ├── uiSlice.ts # Stan UI (modalne, komunikaty)
│ └── notificationSlice.ts # Stan powiadomień
├── hooks.ts # Typowane hooki (useAppDispatch, useAppSelector)
└── index.ts # Konfiguracja głównego store

## Konfiguracja Store

Główny store jest skonfigurowany w `src/frontend/store/index.ts` i zawiera:

- Reducery API z RTK Query
- Reducery dla poszczególnych fragmentów stanu (slices)
- Middleware dla RTK Query
- Setup dla refetchingu przy ponownym połączeniu

## API Endpoints

### Profile API

- `getProfiles` - pobieranie listy profili z filtrowaniem
- `getProfileById` - pobieranie szczegółów profilu
- `updateProfile` - aktualizacja profilu

### Auth API

- `login` - logowanie użytkownika
- `register` - rejestracja użytkownika
- `getCurrentUser` - pobieranie danych zalogowanego użytkownika
- `logout` - wylogowanie użytkownika

### Stats API

- `getUserStats` - pobieranie statystyk użytkownika

## Slices

Store używa następujących slices do zarządzania stanem:

- `authSlice` - stan autoryzacji (user, isLoggedIn, error)
- `profileSlice` - stan profili i filtrów wyszukiwania
- `uiSlice` - stan interfejsu użytkownika
- `notificationSlice` - powiadomienia

## Typowane Hooki

Aplikacja używa typowanych hooków dla lepszej integracji z TypeScript:

- `useAppDispatch` - typowany hook dla dispatch
- `useAppSelector` - typowany hook dla selectora

## Przykłady Użycia

### Pobieranie danych z API

```tsx
const { data: profiles, isLoading, error } = useGetProfilesQuery(filterParams);
```

### Mutacja danych

```tsx
const [updateProfile, { isLoading }] = useUpdateProfileMutation();
await updateProfile({ id: profileId, ...data }).unwrap();
```

### Zarządzanie stanem globalnym

```tsx
const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);

// Aktualizacja stanu
dispatch(loginSuccess({ id, email, role }));
```

## Korzyści z RTK Query

1. **Automatyczne zarządzanie cache** - Dane są automatycznie zapisywane w cache
2. **Deduplikacja zapytań** - Eliminacja duplikujących się zapytań
3. **Zarządzanie stanem ładowania/błędów** - Automatyczne śledzenie stanów
4. **Invalidacja cache** - Inteligentne odświeżanie po mutacjach
5. **Pełne wsparcie dla TypeScript** - Silne

## Plany rozwoju

1. **Dodanie nowych API** - wiadomości, powiadomienia, moderacja
2. **Rozszerzenie istniejących API** - filtry, sortowanie, paginacja
3. **Optymalizacja wydajności** - selektywna invalidacja, transformacje danych
4. **Testowanie** - unit testy dla reducerów i API endpointów
