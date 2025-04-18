"use client";

import { useState, useEffect } from "react";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { useRouter } from "next/navigation";

export default function AdminTokensPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [cleanupConfig, setCleanupConfig] = useState({
    removeExpired: true,
    removeRevoked: true,
    olderThan: 30,
    dryRun: true,
  });

  // Przekieruj, jeśli użytkownik nie jest administratorem
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleCleanupConfigChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setCleanupConfig((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/admin/cleanup-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanupConfig),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Wystąpił błąd podczas czyszczenia tokenów"
        );
      }

      setResults(data.result);
      setSuccess(data.message);
    } catch (error) {
      console.error("Błąd czyszczenia tokenów:", error);
      setError(
        error instanceof Error ? error.message : "Wystąpił nieznany błąd"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Brak dostępu</h1>
        <p className="text-gray-600 mb-6">
          Nie masz uprawnień do wyświetlenia tej strony.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Zarządzanie tokenami uwierzytelniającymi
        </h1>
        <p className="text-gray-600 mt-1">
          Czyszczenie i monitorowanie tokenów JWT w bazie danych
        </p>
      </div>

      {/* Przewodnik dla administratorów */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          Przewodnik zarządzania tokenami dla administratorów
        </h2>
        <p className="text-blue-700 mb-4">
          Ta sekcja zawiera niezbędne informacje dla administratorów o tym, jak
          i kiedy przeprowadzać czyszczenie tokenów.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-blue-800">
              Co to są tokeny JWT?
            </h3>
            <p className="text-sm text-blue-700">
              JSON Web Tokens (JWT) to mechanizm używany do bezpiecznego
              uwierzytelniania użytkowników. Każdy zalogowany użytkownik
              otrzymuje tokeny dostępowe (krótkotrwałe) i odświeżające
              (długotrwałe), które są przechowywane w bazie danych.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <h3 className="font-medium text-blue-800 mb-2">
                Kiedy przeprowadzać czyszczenie?
              </h3>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                <li>
                  Co najmniej raz w miesiącu dla utrzymania wydajności bazy
                </li>
                <li>
                  Po wykryciu nieautoryzowanego dostępu (unieważnij wszystkie
                  tokeny)
                </li>
                <li>Przed planowanymi pracami konserwacyjnymi</li>
                <li>
                  Gdy liczba dokumentów w kolekcji tokenów przekracza 10,000
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <h3 className="font-medium text-blue-800 mb-2">
                Najlepsze praktyki
              </h3>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                <li>Zawsze najpierw uruchom w trybie testowym (dry-run)</li>
                <li>Wykonuj czyszczenie w godzinach niskiego ruchu</li>
                <li>
                  Sprawdź logi po czyszczeniu, aby upewnić się, że operacja
                  przebiegła pomyślnie
                </li>
                <li>
                  Zrób kopię zapasową bazy danych przed większymi czyszczeniami
                </li>
                <li>Monitoruj wydajność aplikacji po czyszczeniu</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-2">Wygasłe tokeny</h3>
              <p className="text-sm text-gray-600 mb-2">
                To tokeny, których data ważności minęła. Są one już nieużyteczne
                dla użytkowników i powinny być regularnie usuwane.
              </p>
              <p className="text-sm text-gray-700 font-medium">
                <span className="text-red-600">Zalecenie:</span> Czyść co 2
                tygodnie.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-2">
                Unieważnione tokeny
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                To tokeny, które zostały celowo unieważnione, np. podczas
                wylogowania użytkownika lub zmiany hasła. Nie służą już żadnemu
                celowi.
              </p>
              <p className="text-sm text-gray-700 font-medium">
                <span className="text-yellow-600">Zalecenie:</span> Czyść co
                miesiąc.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-2">Stare tokeny</h3>
              <p className="text-sm text-gray-600 mb-2">
                To tokeny, które są starsze niż określona liczba dni. Mogą być
                nadal ważne, ale istnieje ryzyko, że są zapomniane lub
                nieużywane.
              </p>
              <p className="text-sm text-gray-700 font-medium">
                <span className="text-blue-600">Zalecenie:</span> Czyść tokeny
                starsze niż 30-60 dni.
              </p>
            </div>
          </div>

          {/* Nowa sekcja - wpływ na użytkowników */}
          <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm mt-2">
            <h3 className="font-medium text-blue-800 mb-3">
              Wpływ usuwania tokenów na użytkowników
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <svg
                      className="h-4 w-4 text-green-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Bezpieczne do usunięcia
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>
                      <strong>Wygasłe tokeny</strong> - Brak wpływu na
                      użytkowników, ponieważ tokeny te już nie działają
                    </li>
                    <li>
                      <strong>Unieważnione tokeny</strong> - Brak wpływu, tokeny
                      zostały celowo dezaktywowane przez system
                    </li>
                    <li>
                      <strong>Bardzo stare tokeny</strong> (ponad 60 dni) -
                      Minimalne ryzyko, użytkownicy prawdopodobnie już
                      zalogowali się ponownie
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <svg
                      className="h-4 w-4 text-yellow-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Potencjalne konsekwencje
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>
                      <strong>Aktywne tokeny odświeżające</strong> - Użytkownicy
                      zostaną wylogowani przy następnym odświeżeniu sesji
                    </li>
                    <li>
                      <strong>Tokeny &quot;Zapamiętaj mnie&quot;</strong> -
                      Użytkownicy będą musieli zalogować się ponownie ręcznie
                    </li>
                    <li>
                      <strong>Aktywne API tokeny</strong> - Aplikacje mobilne
                      lub integracje mogą utracić połączenie
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">
                  Gdy użytkownik zostanie wylogowany
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Jeśli usuniesz aktywne tokeny odświeżające, które nie są
                  wygasłe ani unieważnione, użytkownik zostanie wylogowany i
                  będzie musiał zalogować się ponownie. Oto, co dzieje się w
                  różnych scenariuszach:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="border border-gray-200 rounded p-2">
                    <p className="text-xs font-medium text-gray-700">
                      Użytkownik aktywnie korzysta z aplikacji
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Użytkownik może zostać wylogowany podczas przeglądania.
                      Przy następnej akcji wymagającej uwierzytelnienia,
                      zostanie przekierowany do strony logowania.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded p-2">
                    <p className="text-xs font-medium text-gray-700">
                      Użytkownik ma otwartą aplikację, ale nie jest aktywny
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Gdy użytkownik wróci do aplikacji i podejmie akcję,
                      zostanie poproszony o ponowne zalogowanie.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded p-2">
                    <p className="text-xs font-medium text-gray-700">
                      Użytkownik używa funkcji &quot;Zapamiętaj mnie&quot;
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Przy następnym wejściu na stronę funkcja automatycznego
                      logowania nie zadziała i użytkownik będzie musiał podać
                      swoje dane logowania.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <h4 className="font-medium text-yellow-800 mb-1">
                  Zalecenia bezpieczeństwa vs. doświadczenie użytkownika
                </h4>
                <p className="text-sm text-yellow-700">
                  Regularne czyszczenie tokenów zwiększa bezpieczeństwo, ale
                  może powodować wylogowanie aktywnych użytkowników. Dla
                  optymalnego doświadczenia użytkowników zalecamy:
                </p>
                <ul className="list-disc pl-5 text-sm text-yellow-700 mt-2">
                  <li>
                    Zawsze usuwaj wygasłe i unieważnione tokeny - nie ma
                    negatywnego wpływu na użytkowników
                  </li>
                  <li>
                    Usuwaj bardzo stare tokeny (ponad 60 dni) - użytkownicy
                    prawdopodobnie już się ponownie zalogowali
                  </li>
                  <li>
                    Informuj z wyprzedzeniem o planowanych czyszczeniach, które
                    mogą wymagać ponownego logowania
                  </li>
                  <li>
                    Przeprowadzaj większe czyszczenia w godzinach niskiej
                    aktywności użytkowników
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Czyszczenie tokenów JWT
          </h2>
          <p className="text-sm text-gray-500">
            Zarządzaj tokenami uwierzytelniającymi w bazie danych
          </p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-blue-50 rounded-full p-1 mr-2">
                <svg
                  className="h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Funkcja czyszczenia tokenów pomaga utrzymać bazę danych w
                porządku, usuwając niepotrzebne tokeny JWT, które są używane do
                uwierzytelniania użytkowników.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Typy tokenów, które można wyczyścić:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="font-medium text-gray-700">
                      Wygasłe tokeny
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tokeny, których czas ważności już upłynął
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="font-medium text-gray-700">
                      Unieważnione tokeny
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tokeny, które zostały celowo unieważnione (np. przy
                    wylogowaniu)
                  </p>
                </div>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium text-gray-700">
                      Stare tokeny
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tokeny starsze niż określona liczba dni
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Opcje czyszczenia
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="removeExpired"
                        type="checkbox"
                        name="removeExpired"
                        checked={cleanupConfig.removeExpired}
                        onChange={handleCleanupConfigChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="removeExpired"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Usuń wygasłe tokeny
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="removeRevoked"
                        type="checkbox"
                        name="removeRevoked"
                        checked={cleanupConfig.removeRevoked}
                        onChange={handleCleanupConfigChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="removeRevoked"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Usuń unieważnione tokeny
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Dodatkowe ustawienia
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="olderThan"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Usuń tokeny starsze niż (dni)
                      </label>
                      <input
                        type="number"
                        id="olderThan"
                        name="olderThan"
                        value={cleanupConfig.olderThan}
                        onChange={handleCleanupConfigChange}
                        min={1}
                        className="block w-24 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        id="dryRun"
                        type="checkbox"
                        name="dryRun"
                        checked={cleanupConfig.dryRun}
                        onChange={handleCleanupConfigChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="dryRun"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Tryb testowy (tylko sprawdź, nie usuwaj)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Przetwarzanie..." : "Sprawdź tokeny"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {results && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Wyniki czyszczenia
            </h2>
            <p className="text-sm text-gray-500">
              {cleanupConfig.dryRun
                ? "Symulacja czyszczenia tokenów - żadne tokeny nie zostały usunięte"
                : "Raport z wykonanego czyszczenia tokenów"}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <div className="text-sm font-medium text-gray-500">
                  Wygasłe tokeny
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {results.expiredRemoved}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tokeny, których czas ważności minął i są bezużyteczne
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <div className="text-sm font-medium text-gray-500">
                  Unieważnione tokeny
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {results.revokedRemoved}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tokeny wylogowanych użytkowników lub celowo anulowane
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <div className="text-sm font-medium text-gray-500">
                  Stare tokeny
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.oldRemoved}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tokeny starsze niż {cleanupConfig.olderThan} dni, potencjalnie
                  nieużywane
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <div className="text-sm font-medium text-gray-500">Łącznie</div>
                <div className="text-2xl font-bold text-green-600">
                  {results.totalRemoved}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Całkowita liczba tokenów przeznaczonych do usunięcia
                </p>
              </div>
            </div>

            {cleanupConfig.dryRun && (
              <div className="mt-4 rounded-md bg-yellow-50 p-4 border border-yellow-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Powyższe liczby pokazują, ile tokenów zostałoby
                      usuniętych.{" "}
                      <strong>
                        Żadne tokeny nie zostały faktycznie usunięte
                      </strong>{" "}
                      w trybie testowym. Aby przeprowadzić rzeczywiste
                      czyszczenie, odznacz opcję &quot;Tryb testowy&quot;.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!cleanupConfig.dryRun && results.totalRemoved > 0 && (
              <div className="mt-4 rounded-md bg-green-50 p-4 border border-green-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Operacja zakończona pomyślnie. Usunięto łącznie{" "}
                      <strong>{results.totalRemoved}</strong> tokenów, co
                      powinno poprawić wydajność bazy danych i zmniejszyć jej
                      rozmiar.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dodatkowe wyjaśnienie wpływu na użytkowników po faktycznym usunięciu tokenów */}
            {!cleanupConfig.dryRun && results.totalRemoved > 0 && (
              <div className="mt-4 bg-gray-50 p-4 border border-gray-200 rounded-md">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Wpływ na użytkowników
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      <strong>
                        Wygasłe tokeny ({results.expiredRemoved}):
                      </strong>{" "}
                      Usunięcie nie ma wpływu na użytkowników, ponieważ te
                      tokeny już nie działały.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      <strong>
                        Unieważnione tokeny ({results.revokedRemoved}):
                      </strong>{" "}
                      Usunięcie nie ma wpływu na użytkowników, te tokeny były
                      już wcześniej dezaktywowane przez system.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      <strong>Stare tokeny ({results.oldRemoved}):</strong>{" "}
                      Jeśli wśród usuniętych jest aktywny token odświeżający,
                      użytkownik zostanie wylogowany przy następnej próbie
                      odświeżenia sesji i będzie musiał zalogować się ponownie.
                    </p>
                  </div>

                  {/* Dodatkowa wskazówka */}
                  {results.oldRemoved > 0 && (
                    <div className="border-l-4 border-blue-300 bg-blue-50 p-3 mt-2">
                      <p className="text-sm text-blue-700">
                        <strong>Porada:</strong> W przypadku zgłoszeń od
                        użytkowników o nieoczekiwanym wylogowaniu, poinformuj
                        ich, że przeprowadzono rutynowe czyszczenie bazy danych,
                        które mogło spowodować wygaśnięcie niektórych
                        długotrwałych sesji. Jest to normalne działanie systemu
                        zwiększające bezpieczeństwo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
