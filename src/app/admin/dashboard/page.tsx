"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

// Interfejs dla statystyk
interface DashboardStats {
  users: {
    total: number;
    active: number;
    prisoner: number;
    partner: number;
    admin: number;
    moderator: number;
    newLastWeek: number;
  };
  profiles: {
    total: number;
    active: number;
    prisoner: number;
    partner: number;
    newLastWeek: number;
  };
  activity: {
    logins: number;
    registrations: number;
    profilesCreated: number;
    messages: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Przekieruj, jeśli użytkownik nie jest administratorem
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Pobierz statystyki
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/stats");

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania statystyk");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Błąd pobierania statystyk:", error);
        setError(
          "Wystąpił błąd podczas pobierania statystyk. Spróbuj odświeżyć stronę."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchStats();
    }
  }, [user]);

  if (userLoading) {
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
        <h1 className="text-2xl font-bold">Panel Administratora - Dashboard</h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Odśwież dane
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : stats ? (
        <>
          {/* Statystyki użytkowników */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Użytkownicy</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Łącznie</div>
                <div className="text-2xl font-bold">{stats.users.total}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Aktywni</div>
                <div className="text-2xl font-bold">{stats.users.active}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Więźniarki</div>
                <div className="text-2xl font-bold">{stats.users.prisoner}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Partnerzy</div>
                <div className="text-2xl font-bold">{stats.users.partner}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Nowi użytkownicy w tym tygodniu:{" "}
              <span className="font-semibold">{stats.users.newLastWeek}</span>
            </div>
          </div>

          {/* Statystyki profili */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Łącznie</div>
                <div className="text-2xl font-bold">{stats.profiles.total}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Więźniarki</div>
                <div className="text-2xl font-bold">
                  {stats.profiles.prisoner}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Partnerzy</div>
                <div className="text-2xl font-bold">
                  {stats.profiles.partner}
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Nowe profile w tym tygodniu:{" "}
              <span className="font-semibold">
                {stats.profiles.newLastWeek}
              </span>
            </div>
          </div>

          {/* Aktywność */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Aktywność (ostatnie 7 dni)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Logowania</div>
                <div className="text-2xl font-bold">
                  {stats.activity.logins}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Rejestracje</div>
                <div className="text-2xl font-bold">
                  {stats.activity.registrations}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Utworzone profile</div>
                <div className="text-2xl font-bold">
                  {stats.activity.profilesCreated}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Wiadomości</div>
                <div className="text-2xl font-bold">
                  {stats.activity.messages}
                </div>
              </div>
            </div>
          </div>

          {/* Skróty do najważniejszych akcji */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Szybkie akcje</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center"
              >
                <span className="text-lg font-semibold">
                  Zarządzaj użytkownikami
                </span>
                <span className="text-sm mt-1">
                  Blokuj, usuwaj, zmieniaj role
                </span>
              </button>
              <button
                onClick={() => router.push("/admin/profiles")}
                className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors flex flex-col items-center"
              >
                <span className="text-lg font-semibold">Moderuj profile</span>
                <span className="text-sm mt-1">
                  Przeglądaj i moderuj profile
                </span>
              </button>
              <button
                onClick={() => router.push("/admin/tokens")}
                className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center"
              >
                <span className="text-lg font-semibold">
                  Zarządzaj tokenami
                </span>
                <span className="text-sm mt-1">Czyść i monitoruj tokeny</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-gray-500">
            Brak danych do wyświetlenia
          </p>
        </div>
      )}
    </div>
  );
}
