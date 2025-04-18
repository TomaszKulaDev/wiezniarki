"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/frontend/components/admin/AdminLayout";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
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
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Zarządzanie Użytkownikami</h1>
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              disabled={filteredUsers.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              Eksport CSV
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              Odśwież dane
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Karty statystyk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">
                  Wszyscy użytkownicy
                </p>
                <p className="text-2xl font-bold">{userStats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">
                  Aktywni użytkownicy
                </p>
                <p className="text-2xl font-bold">{userStats.active}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">Administratorzy</p>
                <p className="text-2xl font-bold">{userStats.byRole.admin}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">Zablokowani</p>
                <p className="text-2xl font-bold">{userStats.locked}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
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
            </div>
          </div>
        </div>

        {/* Filtry */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wyszukiwanie
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Szukaj po adresie email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rola
              </label>
              <select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Wszystkie role</option>
                <option value="prisoner">Więźniarki</option>
                <option value="partner">Partnerzy</option>
                <option value="admin">Administratorzy</option>
                <option value="moderator">Moderatorzy</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sortowanie
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="email-asc">Email (A-Z)</option>
                <option value="email-desc">Email (Z-A)</option>
                <option value="role-asc">Rola (A-Z)</option>
                <option value="role-desc">Rola (Z-A)</option>
                <option value="createdAt-desc">Najnowsi</option>
                <option value="createdAt-asc">Najstarsi</option>
                <option value="lastLogin-desc">Ostatnio aktywni</option>
              </select>
            </div>
          </div>

          {/* Etykieta z liczbą wyników */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div>
              Znaleziono{" "}
              <span className="font-semibold">{filteredUsers.length}</span>{" "}
              użytkowników
            </div>
            <div className="flex items-center">
              <span className="mr-2">Pokaż na stronie:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista użytkowników */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rola
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Data rejestracji
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ostatnie logowanie
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
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
                        {user.profileId && (
                          <div className="text-xs text-gray-500">
                            <Link
                              href={`/admin/profiles/${user.profileId}`}
                              className="text-blue-600 hover:underline"
                            >
                              Zobacz profil
                            </Link>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "moderator"
                              ? "bg-yellow-100 text-yellow-800"
                              : user.role === "prisoner"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Administrator"
                            : user.role === "moderator"
                            ? "Moderator"
                            : user.role === "prisoner"
                            ? "Więźniarka"
                            : "Partner"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {user.locked ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Zablokowany
                            </span>
                          ) : user.active ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Aktywny
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Nieaktywny
                            </span>
                          )}
                          {!user.verified && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Niezweryfikowany
                            </span>
                          )}
                          {user.locked && user.lockedUntil && (
                            <span className="text-xs text-gray-500">
                              Do{" "}
                              {new Date(user.lockedUntil).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Nigdy"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* Szybkie akcje */}
                          {!user.locked ? (
                            <button
                              onClick={() =>
                                handleToggleLock(user.id, user.locked)
                              }
                              className="text-red-600 hover:text-red-900"
                              disabled={actionInProgress === user.id}
                              title="Zablokuj konto"
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
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleToggleLock(user.id, user.locked)
                              }
                              className="text-green-600 hover:text-green-900"
                              disabled={actionInProgress === user.id}
                              title="Odblokuj konto"
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
                                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          )}

                          {user.active ? (
                            <button
                              onClick={() =>
                                handleToggleActive(user.id, user.active)
                              }
                              className="text-yellow-600 hover:text-yellow-900"
                              disabled={actionInProgress === user.id}
                              title="Dezaktywuj konto"
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
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleToggleActive(user.id, user.active)
                              }
                              className="text-green-600 hover:text-green-900"
                              disabled={actionInProgress === user.id}
                              title="Aktywuj konto"
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
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            disabled={actionInProgress === user.id}
                            title="Edytuj użytkownika"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={actionInProgress === user.id}
                            title="Usuń użytkownika"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          {actionInProgress === user.id && (
                            <span className="inline-flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
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
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                Brak użytkowników spełniających kryteria wyszukiwania
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Wyczyść filtry
              </button>
            </div>
          )}
        </div>

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center bg-white rounded-lg shadow-sm px-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Pokaż tylko kilka stron dookoła bieżącej strony
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 mx-1 rounded-md ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-4 py-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal edycji użytkownika */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Edycja użytkownika
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium">{currentUser.email}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">ID: {currentUser.id}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rola
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="prisoner">Więźniarka</option>
                  <option value="partner">Partner</option>
                  <option value="admin">Administrator</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={editForm.active}
                  onChange={(e) =>
                    setEditForm({ ...editForm, active: e.target.checked })
                  }
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="active"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Aktywny
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="locked"
                  checked={editForm.locked}
                  onChange={(e) =>
                    setEditForm({ ...editForm, locked: e.target.checked })
                  }
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="locked"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Zablokowany
                </label>
              </div>

              {editForm.locked && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-xs text-yellow-700">
                    <strong>Uwaga:</strong> Blokowanie konta spowoduje, że
                    użytkownik nie będzie mógł się zalogować przez 7 dni.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                disabled={isLoading}
              >
                {isLoading && (
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
                )}
                {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
