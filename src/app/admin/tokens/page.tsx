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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (user && user.role !== "admin") {
    return null; // Zabezpieczenie przed renderowaniem strony dla nie-administratorów
  }

  return (
    <AdminLayout>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          Zarządzanie tokenami uwierzytelniającymi
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Czyszczenie tokenów</h2>
          <p className="text-gray-600 mb-4">
            Funkcja czyszczenia tokenów pomaga utrzymać bazę danych w porządku,
            usuwając niepotrzebne tokeny zgodnie z wybranymi kryteriami.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="removeExpired"
                  checked={cleanupConfig.removeExpired}
                  onChange={handleCleanupConfigChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Usuń wygasłe tokeny</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="removeRevoked"
                  checked={cleanupConfig.removeRevoked}
                  onChange={handleCleanupConfigChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">
                  Usuń unieważnione tokeny
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuń tokeny starsze niż (dni)
              </label>
              <input
                type="number"
                name="olderThan"
                value={cleanupConfig.olderThan}
                onChange={handleCleanupConfigChange}
                min={1}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="dryRun"
                  checked={cleanupConfig.dryRun}
                  onChange={handleCleanupConfigChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">
                  Tryb testowy (tylko sprawdź, nie usuwaj)
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#1e50a0" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Przetwarzanie..." : "Wykonaj czyszczenie"}
              </button>
            </div>
          </form>
        </div>

        {results && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Wyniki czyszczenia</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Wygasłe tokeny</div>
                  <div className="text-2xl font-bold">
                    {results.expiredRemoved}
                  </div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="text-sm text-gray-500">
                    Unieważnione tokeny
                  </div>
                  <div className="text-2xl font-bold">
                    {results.revokedRemoved}
                  </div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Stare tokeny</div>
                  <div className="text-2xl font-bold">{results.oldRemoved}</div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Razem</div>
                  <div className="text-2xl font-bold">
                    {results.totalRemoved}
                  </div>
                </div>
              </div>

              {cleanupConfig.dryRun && (
                <p className="mt-4 text-amber-600 text-sm">
                  Uwaga: Powyższe liczby pokazują, ile tokenów zostałoby
                  usuniętych. Żadne tokeny nie zostały faktycznie usunięte w
                  trybie testowym.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
