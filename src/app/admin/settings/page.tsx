"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [maintenanceSettings, setMaintenanceSettings] =
    useState<MaintenanceSettings>({
      enabled: false,
      message: "Trwają prace konserwacyjne. Prosimy spróbować później.",
    });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Przekieruj, jeśli użytkownik nie jest administratorem
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Pobierz ustawienia trybu konserwacji
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Używaj endpointu maintenance zamiast admin/settings
        const response = await fetch("/api/settings/maintenance");

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania ustawień");
        }

        const data = await response.json();

        setMaintenanceSettings({
          enabled: !!data.enabled,
          message:
            data.message ||
            "Trwają prace konserwacyjne. Prosimy spróbować później.",
        });
      } catch (error) {
        console.error("Błąd pobierania ustawień:", error);
        setError(
          "Wystąpił błąd podczas pobierania ustawień. Używamy ustawień domyślnych."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchSettings();
    }
  }, [user]);

  // Zapisz ustawienia
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Dodaj więcej szczegółów dla debugowania
      console.log("Zapisywanie ustawień:", maintenanceSettings);

      const saveResponse = await fetch("/api/settings/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(maintenanceSettings),
      });

      // Zapisz odpowiedź, aby zobaczyć komunikat błędu
      const responseData = await saveResponse.json();
      console.log("Odpowiedź z API:", responseData);

      if (!saveResponse.ok) {
        throw new Error(
          responseData.message || "Błąd podczas zapisywania ustawień"
        );
      }

      setSuccess("Tryb konserwacji został pomyślnie zaktualizowany");

      // Po zapisie, odśwież stronę po 2 sekundach, aby pokazać zmiany
      if (maintenanceSettings.enabled) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Błąd zapisywania ustawień:", error);
      setError("Wystąpił błąd podczas zapisywania ustawień. Spróbuj ponownie.");
    } finally {
      setIsSaving(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return null; // Zabezpieczenie przed renderowaniem strony dla nie-administratorów
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tryb konserwacji</h1>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Zapisywanie..." : "Zapisz ustawienia"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenance-enabled"
              checked={maintenanceSettings.enabled}
              onChange={(e) =>
                setMaintenanceSettings({
                  ...maintenanceSettings,
                  enabled: e.target.checked,
                })
              }
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="maintenance-enabled"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Włącz tryb konserwacji (strona będzie niedostępna dla
              użytkowników)
            </label>
          </div>

          <div>
            <label
              htmlFor="maintenance-message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Komunikat w trybie konserwacji
            </label>
            <textarea
              id="maintenance-message"
              value={maintenanceSettings.message}
              onChange={(e) =>
                setMaintenanceSettings({
                  ...maintenanceSettings,
                  message: e.target.value,
                })
              }
              rows={4}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Wpisz komunikat, który zostanie wyświetlony użytkownikom podczas konserwacji"
            />
            <p className="mt-2 text-sm text-gray-500">
              Ten komunikat będzie widoczny dla wszystkich odwiedzających
              stronę.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Uwaga</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Włączenie trybu konserwacji sprawi, że strona będzie
                    niedostępna dla wszystkich użytkowników oprócz
                    administratorów. Upewnij się, że komunikat zawiera
                    informacje o przewidywanym czasie trwania prac.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
