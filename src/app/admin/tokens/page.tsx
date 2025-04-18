"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/frontend/components/admin/AdminLayout";
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
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (user && user.role !== "admin") {
    return null; // Zabezpieczenie przed renderowaniem strony dla nie-administratorów
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Zarządzanie tokenami uwierzytelniającymi
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Czyszczenie tokenów JWT
            </h2>
            <p className="text-sm text-gray-500">
              Zarządzaj tokenami uwierzytelniającymi w bazie danych
            </p>
          </div>
          <div className="p-4">
            <div className="mb-4">
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
                  porządku, usuwając niepotrzebne tokeny JWT. Tokeny te są
                  używane do uwierzytelniania użytkowników i mogą się gromadzić
                  w bazie danych, zwłaszcza jeśli użytkownicy często logują się
                  i wylogowują, lub po prostu wygasają.
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Typy tokenów, które można wyczyścić:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded border border-gray-200">
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
                  <div className="bg-white p-3 rounded border border-gray-200">
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
                  <div className="bg-white p-3 rounded border border-gray-200">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Opcje czyszczenia
                    </h3>

                    <div className="space-y-2">
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Dodatkowe ustawienia
                    </h3>

                    <div className="space-y-2">
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
                          className="mt-1 block w-20 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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

                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mt-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Wyniki czyszczenia
              </h2>
              <p className="text-sm text-gray-500">
                {cleanupConfig.dryRun
                  ? "Symulacja czyszczenia tokenów - żadne tokeny nie zostały usunięte"
                  : "Raport z wykonanego czyszczenia tokenów"}
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Wygasłe tokeny
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.expiredRemoved}
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Unieważnione tokeny
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.revokedRemoved}
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Stare tokeny
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {results.oldRemoved}
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Łącznie
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.totalRemoved}
                  </div>
                </div>
              </div>

              {cleanupConfig.dryRun && (
                <div className="mt-3 rounded-md bg-yellow-50 p-3 border border-yellow-100">
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
                        w trybie testowym.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
