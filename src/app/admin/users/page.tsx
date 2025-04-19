"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import {
  useGetDatabaseSettingsQuery,
  useUpdateDatabaseSettingsMutation,
  useLazyGetInactiveUsersQuery,
  useVerifyUserMutation,
} from "@/frontend/store/apis/settingsApi";
import Link from "next/link";

// Interfejs dla użytkownika (uproszczony)
interface UserListItem {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  active: boolean;
  locked: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  profileId?: string;
  loginAttempts?: number;
  lockedUntil?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt-desc");

  // Paginacja
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Statystyki użytkowników
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    locked: 0,
    byRole: { prisoner: 0, partner: 0, admin: 0, moderator: 0 },
  });

  // Akcje
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Dla modalu edycji
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserListItem | null>(null);
  const [editForm, setEditForm] = useState({
    role: "",
    active: false,
    locked: false,
  });

  // Ustawienia rejestracji
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(
    null
  );

  // RTK Query hooki zamiast bezpośredniego fetch
  const { data: databaseSettings, isLoading: isDatabaseSettingsLoading } =
    useGetDatabaseSettingsQuery(undefined, {
      // Skip wykonanie zapytania, jeśli użytkownik nie jest adminem
      skip: !user || user.role !== "admin",
    });

  const [
    updateDatabaseSettings,
    {
      isLoading: isUpdatingDatabaseSettings,
      isSuccess: isDatabaseSettingsUpdateSuccess,
      error: databaseSettingsUpdateError,
      reset: resetDatabaseSettingsUpdate,
    },
  ] = useUpdateDatabaseSettingsMutation();

  // Zamiast useGetInactiveUsersQuery, użyj triggera
  const [
    triggerGetInactiveUsers,
    {
      data: inactiveUsers,
      isLoading: isInactiveUsersLoading,
      isSuccess: isInactiveUsersSuccess,
    },
  ] = useLazyGetInactiveUsersQuery();

  const [verifyUser, { isLoading: isVerifyingUser }] = useVerifyUserMutation();

  // Lokalny stan dla czyszczenia kont
  const [cleanupInterval, setCleanupInterval] = useState<number>(30);
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);

  // Ustaw wartość cleanupInterval z pobranych ustawień
  useEffect(() => {
    if (
      databaseSettings &&
      typeof databaseSettings.cleanupInterval === "number"
    ) {
      setCleanupInterval(databaseSettings.cleanupInterval);
    }
  }, [databaseSettings]);

  // Resetuj komunikaty po sukcesie/błędzie
  useEffect(() => {
    if (isDatabaseSettingsUpdateSuccess || databaseSettingsUpdateError) {
      const timer = setTimeout(() => {
        resetDatabaseSettingsUpdate();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [
    isDatabaseSettingsUpdateSuccess,
    databaseSettingsUpdateError,
    resetDatabaseSettingsUpdate,
  ]);

  // Pokażmy nieaktywnych użytkowników po ich pobraniu
  useEffect(() => {
    if (isInactiveUsersSuccess && inactiveUsers) {
      setShowInactiveUsers(true);
    }
  }, [isInactiveUsersSuccess, inactiveUsers]);

  // Przekieruj, jeśli użytkownik nie jest administratorem
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Pobierz użytkowników
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/users");

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania listy użytkowników");
        }

        const responseData = await response.json();

        // Extract users array from the response
        const userData = responseData.users || [];
        setUsers(userData);

        // Oblicz statystyki
        const stats = {
          total: userData.length,
          active: userData.filter((u: UserListItem) => u.active && !u.locked)
            .length,
          locked: userData.filter((u: UserListItem) => u.locked).length,
          byRole: {
            prisoner: userData.filter(
              (u: UserListItem) => u.role === "prisoner"
            ).length,
            partner: userData.filter((u: UserListItem) => u.role === "partner")
              .length,
            admin: userData.filter((u: UserListItem) => u.role === "admin")
              .length,
            moderator: userData.filter(
              (u: UserListItem) => u.role === "moderator"
            ).length,
          },
        };

        setUserStats(stats);
      } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
        setError(
          "Wystąpił błąd podczas pobierania listy użytkowników. Spróbuj odświeżyć stronę."
        );

        // Initialize with empty array to prevent further errors
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  // Pobierz ustawienia rejestracji
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setRegistrationLoading(true);
        // Tworzymy nowy endpoint, który nie wymaga autoryzacji
        const response = await fetch("/api/settings/registration");

        if (response.ok) {
          const data = await response.json();
          setRegistrationEnabled(data.enabled);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania ustawień rejestracji:", error);
      } finally {
        setRegistrationLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Filtrowanie i sortowanie użytkowników
  useEffect(() => {
    // Ensure users is always an array
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    let result = [...users];

    // Filtrowanie po wyszukiwaniu
    if (searchTerm) {
      result = result.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrowanie po roli
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Filtrowanie po statusie
    if (statusFilter === "active") {
      result = result.filter((user) => user.active && !user.locked);
    } else if (statusFilter === "inactive") {
      result = result.filter((user) => !user.active);
    } else if (statusFilter === "locked") {
      result = result.filter((user) => user.locked);
    } else if (statusFilter === "unverified") {
      result = result.filter((user) => !user.verified);
    }

    // Sortowanie
    if (sortBy) {
      const [field, direction] = sortBy.split("-");
      result.sort((a, b) => {
        if (field === "email") {
          return direction === "asc"
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email);
        } else if (field === "role") {
          return direction === "asc"
            ? a.role.localeCompare(b.role)
            : b.role.localeCompare(a.role);
        } else if (field === "createdAt") {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return direction === "asc" ? dateA - dateB : dateB - dateA;
        } else if (field === "lastLogin") {
          const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          return direction === "asc" ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, statusFilter, sortBy]);

  // Paginacja
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Otwórz modal edycji
  const handleEditUser = (user: UserListItem) => {
    setCurrentUser(user);
    setEditForm({
      role: user.role,
      active: user.active,
      locked: user.locked,
    });
    setShowEditModal(true);
  };

  // Zapisz zmiany dla użytkownika
  const handleSaveUser = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setActionInProgress(currentUser.id);

      const response = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas aktualizacji użytkownika");
      }

      const updatedUser = await response.json();

      // Aktualizuj lokalny stan
      setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));

      setShowEditModal(false);
    } catch (error) {
      console.error("Błąd aktualizacji użytkownika:", error);
      alert("Wystąpił błąd podczas aktualizacji użytkownika.");
    } finally {
      setIsLoading(false);
      setActionInProgress(null);
    }
  };

  // Szybka akcja - blokowanie/odblokowanie
  const handleToggleLock = async (userId: string, currentLocked: boolean) => {
    try {
      setActionInProgress(userId);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locked: !currentLocked }),
      });

      if (!response.ok) {
        throw new Error(
          `Błąd podczas ${
            currentLocked ? "odblokowywania" : "blokowania"
          } użytkownika`
        );
      }

      const updatedUser = await response.json();

      // Aktualizuj lokalny stan
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (error) {
      console.error(
        `Błąd ${currentLocked ? "odblokowywania" : "blokowania"} użytkownika:`,
        error
      );
      alert(
        `Wystąpił błąd podczas ${
          currentLocked ? "odblokowywania" : "blokowania"
        } użytkownika.`
      );
    } finally {
      setActionInProgress(null);
    }
  };

  // Szybka akcja - aktywacja/deaktywacja
  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      setActionInProgress(userId);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (!response.ok) {
        throw new Error(
          `Błąd podczas ${
            currentActive ? "dezaktywacji" : "aktywacji"
          } użytkownika`
        );
      }

      const updatedUser = await response.json();

      // Aktualizuj lokalny stan
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (error) {
      console.error(
        `Błąd ${currentActive ? "dezaktywacji" : "aktywacji"} użytkownika:`,
        error
      );
      alert(
        `Wystąpił błąd podczas ${
          currentActive ? "dezaktywacji" : "aktywacji"
        } użytkownika.`
      );
    } finally {
      setActionInProgress(null);
    }
  };

  // Usuń użytkownika
  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Czy na pewno chcesz usunąć tego użytkownika? Ta operacja jest nieodwracalna."
      )
    ) {
      return;
    }

    try {
      setActionInProgress(userId);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania użytkownika");
      }

      // Usuń użytkownika z lokalnego stanu
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Błąd usuwania użytkownika:", error);
      alert("Wystąpił błąd podczas usuwania użytkownika.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Eksport do CSV
  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      alert("Brak danych do eksportu");
      return;
    }

    // Przygotuj nagłówki
    const headers = [
      "ID",
      "Email",
      "Rola",
      "Status",
      "Zweryfikowany",
      "Data rejestracji",
      "Ostatnie logowanie",
      "ID profilu",
    ];

    // Przygotuj wiersze
    const rows = filteredUsers.map((user) => [
      user.id,
      user.email,
      user.role,
      user.locked ? "Zablokowany" : user.active ? "Aktywny" : "Nieaktywny",
      user.verified ? "Tak" : "Nie",
      new Date(user.createdAt).toLocaleDateString(),
      user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nigdy",
      user.profileId || "Brak",
    ]);

    // Połącz wszystko do CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Utwórz link do pobrania
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funkcja do przełączania ustawień rejestracji
  const handleToggleRegistration = async () => {
    try {
      setRegistrationLoading(true);
      setRegistrationError(null);
      setRegistrationSuccess(null);

      // Tworzymy nowy endpoint do aktualizacji ustawień
      const response = await fetch("/api/settings/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !registrationEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas aktualizacji ustawień");
      }

      // Aktualizuj stan
      setRegistrationEnabled(!registrationEnabled);
      setRegistrationSuccess("Ustawienia rejestracji zostały zaktualizowane");
    } catch (error) {
      console.error("Błąd aktualizacji ustawień rejestracji:", error);
      setRegistrationError(
        "Wystąpił błąd podczas aktualizacji ustawień rejestracji"
      );
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Funkcja do aktualizacji ustawień czyszczenia kont - użyj RTK Query zamiast fetch
  const handleUpdateCleanupInterval = async () => {
    if (isNaN(cleanupInterval) || cleanupInterval <= 0) {
      return; // Walidacja
    }

    await updateDatabaseSettings({ cleanupInterval });
  };

  // Funkcja pobierania nieaktywnych użytkowników
  const handleFetchInactiveUsers = () => {
    triggerGetInactiveUsers();
  };

  // Funkcja weryfikacji użytkownika - użyj RTK Query zamiast fetch
  const handleVerifyUser = async (userId: string) => {
    try {
      setActionInProgress(userId);
      await verifyUser(userId).unwrap();
      // Po weryfikacji odśwież listę
      triggerGetInactiveUsers();
    } catch (error) {
      console.error("Błąd weryfikacji konta:", error);
    } finally {
      setActionInProgress(null);
    }
  };

  // Możesz też dodać funkcję do resetowania zapytania, jeśli potrzebujesz
  const resetInactiveUsers = () => {
    setShowInactiveUsers(false);
  };

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Nagłówek z tytułem i przyciskami akcji */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Zarządzanie Użytkownikami
          </h1>
          <p className="text-gray-500 mt-1">
            Panel zarządzania kontami użytkowników systemu
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportToCSV()}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Eksportuj
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Odśwież
          </button>
        </div>
      </div>

      {/* Sekcja ustawień rejestracji */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Ustawienia rejestracji</h2>

        {registrationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {registrationError}
          </div>
        )}

        {registrationSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {registrationSuccess}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700">
              {registrationEnabled
                ? "Rejestracja nowych użytkowników jest aktualnie włączona."
                : "Rejestracja nowych użytkowników jest aktualnie wyłączona."}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              To ustawienie wpływa tylko na możliwość wypełnienia formularza
              rejestracji przez nowych użytkowników.
            </p>
          </div>

          <button
            onClick={handleToggleRegistration}
            disabled={registrationLoading}
            className={`px-4 py-2 rounded-md text-white transition-colors ${
              registrationLoading
                ? "bg-gray-400 cursor-not-allowed"
                : registrationEnabled
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {registrationLoading
              ? "Aktualizowanie..."
              : registrationEnabled
              ? "Wyłącz rejestrację"
              : "Włącz rejestrację"}
          </button>
        </div>
      </div>

      {/* Sekcja czyszczenia nieaktywnych kont */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Czyszczenie nieaktywnych kont
        </h2>

        {databaseSettingsUpdateError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {databaseSettingsUpdateError instanceof Error
              ? databaseSettingsUpdateError.message
              : "Wystąpił błąd podczas aktualizacji ustawień czyszczenia"}
          </div>
        )}

        {isDatabaseSettingsUpdateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Ustawienie czyszczenia kont zostało zaktualizowane do{" "}
            {cleanupInterval} dni.
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="cleanup-interval"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Częstotliwość czyszczenia nieaktywnych kont (dni)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              id="cleanup-interval"
              min="1"
              value={cleanupInterval}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setCleanupInterval(isNaN(value) ? 30 : Math.max(1, value));
              }}
              className="w-24 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={handleUpdateCleanupInterval}
              disabled={isUpdatingDatabaseSettings}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isUpdatingDatabaseSettings
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isUpdatingDatabaseSettings ? "Aktualizowanie..." : "Zapisz"}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Konta, które nie zostały aktywowane w tym czasie, zostaną
            automatycznie usunięte.
          </p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium">
              Nieaktywne konta użytkowników
            </h3>
            <button
              onClick={handleFetchInactiveUsers}
              disabled={isInactiveUsersLoading}
              className={`px-3 py-1 rounded-md text-white text-sm transition-colors ${
                isInactiveUsersLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isInactiveUsersLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Ładowanie...
                </span>
              ) : (
                "Pokaż nieaktywne konta"
              )}
            </button>
          </div>

          {showInactiveUsers && inactiveUsers && (
            <div className="mt-3">
              {inactiveUsers.length === 0 ? (
                <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-md">
                  Brak nieaktywnych kont użytkowników.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rola
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data utworzenia
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Działania
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inactiveUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            {user.role}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            {!user.verified && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-1">
                                Niezweryfikowane
                              </span>
                            )}
                            {user.locked && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-1">
                                Zablokowane
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}(
                            {Math.floor(
                              (Date.now() -
                                new Date(user.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            dni temu)
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            {!user.verified && (
                              <button
                                onClick={() => handleVerifyUser(user.id)}
                                disabled={
                                  actionInProgress === user.id ||
                                  isVerifyingUser
                                }
                                className="text-green-500 hover:text-green-700 mr-2"
                                title="Zweryfikuj konto"
                              >
                                {actionInProgress === user.id
                                  ? "Weryfikowanie..."
                                  : "Zweryfikuj"}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={actionInProgress === user.id}
                              className="text-red-500 hover:text-red-700"
                              title="Usuń konto"
                            >
                              {actionInProgress === user.id
                                ? "Usuwanie..."
                                : "Usuń"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-sm text-gray-500">
                    Znaleziono {inactiveUsers.length} nieaktywnych kont.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Karty statystyk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-blue-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">
                Wszyscy użytkownicy
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {userStats.total}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-green-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Aktywni</div>
              <div className="text-2xl font-bold text-green-600">
                {userStats.active}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">
                Zablokowani
              </div>
              <div className="text-2xl font-bold text-red-600">
                {userStats.locked}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-3">
              Role użytkowników
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-blue-50">
                <span className="text-xs text-blue-800">Admin</span>
                <span className="font-bold text-blue-800">
                  {userStats.byRole.admin}
                </span>
              </div>
              <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-indigo-50">
                <span className="text-xs text-indigo-800">Moderator</span>
                <span className="font-bold text-indigo-800">
                  {userStats.byRole.moderator}
                </span>
              </div>
              <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-green-50">
                <span className="text-xs text-green-800">Więzień</span>
                <span className="font-bold text-green-800">
                  {userStats.byRole.prisoner}
                </span>
              </div>
              <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-yellow-50">
                <span className="text-xs text-yellow-800">Partner</span>
                <span className="font-bold text-yellow-800">
                  {userStats.byRole.partner}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formularz filtrowania i wyszukiwania */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-800">
            Filtrowanie i wyszukiwanie
          </h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Szukaj użytkownika
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email użytkownika..."
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filtruj po roli
              </label>
              <select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Wszystkie role</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="prisoner">Więzień</option>
                <option value="partner">Partner</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filtruj po statusie
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Wszystkie statusy</option>
                <option value="active">Aktywni</option>
                <option value="inactive">Nieaktywni</option>
                <option value="locked">Zablokowani</option>
                <option value="unverified">Niezweryfikowani</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sortuj według
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="email-asc">Email (A-Z)</option>
                <option value="email-desc">Email (Z-A)</option>
                <option value="role-asc">Rola (A-Z)</option>
                <option value="role-desc">Rola (Z-A)</option>
                <option value="createdAt-desc">Najnowsi</option>
                <option value="createdAt-asc">Najstarsi</option>
                <option value="lastLogin-desc">Ostatnio aktywni</option>
                <option value="lastLogin-asc">Dawno nieaktywni</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista użytkowników */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500">
            Nie znaleziono użytkowników pasujących do kryteriów.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">
                Lista użytkowników
              </h2>
              <div className="text-sm text-gray-500">
                Znaleziono: {filteredUsers.length} użytkowników
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email / ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rola
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rejestracja
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500">{user.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : ""
                          }
                          ${
                            user.role === "moderator"
                              ? "bg-blue-100 text-blue-800"
                              : ""
                          }
                          ${
                            user.role === "prisoner"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                          ${
                            user.role === "partner"
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                          }
                        `}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {user.locked ? (
                            <span className="px-2.5 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Zablokowany
                            </span>
                          ) : user.active ? (
                            <span className="px-2.5 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Aktywny
                            </span>
                          ) : (
                            <span className="px-2.5 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Nieaktywny
                            </span>
                          )}
                          {!user.verified && (
                            <span className="px-2.5 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Niezweryfikowany
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        {user.lastLogin && (
                          <div className="flex items-center mt-1.5 text-xs text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 mr-1 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Ost. logowanie:{" "}
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            disabled={actionInProgress === user.id}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edytuj
                          </button>
                          <button
                            onClick={() =>
                              handleToggleLock(user.id, user.locked)
                            }
                            className={`flex items-center ${
                              user.locked
                                ? "text-green-600 hover:text-green-900"
                                : "text-red-600 hover:text-red-900"
                            }`}
                            disabled={actionInProgress === user.id}
                          >
                            {user.locked ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                Odblokuj
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                Zablokuj
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            disabled={actionInProgress === user.id}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginacja */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Pokazuję {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredUsers.length)} z{" "}
              {filteredUsers.length} użytkowników
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                &laquo;
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                &lsaquo;
              </button>
              {/* Numery stron */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                &rsaquo;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                &raquo;
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal edycji użytkownika */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Edytuj użytkownika
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <p className="text-gray-700 font-medium">{currentUser.email}</p>
              </div>
              <div className="text-xs text-gray-500">ID: {currentUser.id}</div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rola użytkownika
              </label>
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="prisoner">Więzień</option>
                <option value="partner">Partner</option>
              </select>
            </div>

            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.active}
                  onChange={(e) =>
                    setEditForm({ ...editForm, active: e.target.checked })
                  }
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Aktywny</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.locked}
                  onChange={(e) =>
                    setEditForm({ ...editForm, locked: e.target.checked })
                  }
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Zablokowany</span>
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveUser}
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
