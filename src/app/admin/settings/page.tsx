"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

// Interfejs dla ustawień systemowych
interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
  };
  database: {
    cleanupInterval: number; // w dniach
    backupEnabled: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    adminEmail: string;
  };
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [settings, setSettings] = useState<SystemSettings>({
    maintenance: {
      enabled: false,
      message: "Trwają prace konserwacyjne. Prosimy spróbować później.",
    },
    database: {
      cleanupInterval: 30,
      backupEnabled: true,
    },
    notifications: {
      emailEnabled: true,
      adminEmail: "admin@wiezniarki.pl",
    },
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

  // Pobierz ustawienia systemowe
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/settings");

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania ustawień systemowych");
        }

        const data = await response.json();
        setSettings({
          maintenance: data.maintenance || settings.maintenance,
          database: data.database || settings.database,
          notifications: data.notifications || settings.notifications,
        });
      } catch (error) {
        console.error("Błąd pobierania ustawień:", error);
        setError(
          "Wystąpił błąd podczas pobierania ustawień systemowych. Używamy ustawień domyślnych."
        );
        // Używamy domyślnych ustawień zdefiniowanych w stanie
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchSettings();
    }
  }, [
    user,
    router,
    settings.maintenance,
    settings.database,
    settings.notifications,
  ]);

  // Obsługa zmian w formularzach
  const handleChange = (
    section: keyof SystemSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Zapisz ustawienia
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Pobierz aktualne ustawienia, aby nie utracić sekcji registration
      const response = await fetch("/api/admin/settings");
      const currentSettings = await response.json();

      // Zachowaj sekcję registration z aktualnych ustawień
      const updatedSettings = {
        ...settings,
        registration: currentSettings.registration || {
          enabled: true,
          requireVerification: true,
        },
      };

      const saveResponse = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!saveResponse.ok) {
        throw new Error("Błąd podczas zapisywania ustawień systemowych");
      }

      setSuccess("Ustawienia systemowe zostały pomyślnie zaktualizowane");
    } catch (error) {
      console.error("Błąd zapisywania ustawień:", error);
      setError(
        "Wystąpił błąd podczas zapisywania ustawień systemowych. Spróbuj ponownie."
      );
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ustawienia Systemowe</h1>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? "Zapisywanie..." : "Zapisz ustawienia"}
        </button>
      </div>

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

      {/* Tryb konserwacji */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Tryb konserwacji</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenance-enabled"
              checked={settings.maintenance.enabled}
              onChange={(e) =>
                handleChange("maintenance", "enabled", e.target.checked)
              }
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="maintenance-enabled"
              className="ml-2 block text-sm text-gray-700"
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
              value={settings.maintenance.message}
              onChange={(e) =>
                handleChange("maintenance", "message", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
            />
          </div>
        </div>
      </div>

      {/* Ustawienia bazy danych */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Ustawienia bazy danych</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="db-cleanup"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Częstotliwość czyszczenia nieaktywnych kont (dni)
            </label>
            <input
              type="number"
              id="db-cleanup"
              value={settings.database.cleanupInterval}
              onChange={(e) =>
                handleChange(
                  "database",
                  "cleanupInterval",
                  parseInt(e.target.value)
                )
              }
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <p className="mt-1 text-sm text-gray-500">
              Konta, które nie zostały aktywowane w tym czasie, zostaną usunięte
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="db-backup"
              checked={settings.database.backupEnabled}
              onChange={(e) =>
                handleChange("database", "backupEnabled", e.target.checked)
              }
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="db-backup"
              className="ml-2 block text-sm text-gray-700"
            >
              Włącz automatyczne kopie zapasowe bazy danych
            </label>
          </div>
        </div>
      </div>

      {/* Ustawienia powiadomień */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Ustawienia powiadomień</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-enabled"
              checked={settings.notifications.emailEnabled}
              onChange={(e) =>
                handleChange("notifications", "emailEnabled", e.target.checked)
              }
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="email-enabled"
              className="ml-2 block text-sm text-gray-700"
            >
              Włącz powiadomienia email
            </label>
          </div>

          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email administratora do powiadomień
            </label>
            <input
              type="email"
              id="admin-email"
              value={settings.notifications.adminEmail}
              onChange={(e) =>
                handleChange("notifications", "adminEmail", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
