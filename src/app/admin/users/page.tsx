"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/frontend/components/admin/AdminLayout";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

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
  profileId?: string;
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

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
        setError(
          "Wystąpił błąd podczas pobierania listy użytkowników. Spróbuj odświeżyć stronę."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  // Filtrowanie użytkowników
  useEffect(() => {
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
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

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

      // Aktualizuj lokalny stan
      setUsers(
        users.map((u) => (u.id === currentUser.id ? { ...u, ...editForm } : u))
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Błąd aktualizacji użytkownika:", error);
      alert("Wystąpił błąd podczas aktualizacji użytkownika.");
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);

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
      setIsLoading(false);
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zarządzanie Użytkownikami</h1>
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

        {/* Filtry */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wyszukiwanie
              </label>
              <input
                type="text"
                id="search"
                placeholder="Szukaj po email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        {user.profileId && (
                          <div className="text-xs text-gray-500">
                            <a
                              href={`/admin/profiles/${user.profileId}`}
                              className="text-blue-600 hover:underline"
                            >
                              Zobacz profil
                            </a>
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
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
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
                            <span className="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Niezweryfikowany
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
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edytuj
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                Brak użytkowników spełniających kryteria wyszukiwania
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal edycji użytkownika */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Edycja użytkownika
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium">{currentUser.email}</span>
              </p>
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
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#1e50a0" }}
                disabled={isLoading}
              >
                {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
