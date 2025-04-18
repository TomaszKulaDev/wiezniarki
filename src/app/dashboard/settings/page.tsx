"use client";

import { useState, useEffect } from "react";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import DashboardSidebar from "@/frontend/components/dashboard/DashboardSidebar";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { PasswordInput } from "@/frontend/components/common";
import { useRouter } from "next/navigation";
import { logout } from "@/frontend/store/slices/authSlice";
import { useAppDispatch } from "@/frontend/store/hooks";

export default function SettingsPage() {
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Dane formularza ustawień
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      emailNotifications: true,
      activitySummary: true,
      newMessages: true,
    },
    privacy: {
      showEmail: false,
      showActivity: true,
    },
  });

  // Dodaj stan do obsługi modalu potwierdzającego
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Inicjalizacja formularza danymi użytkownika
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]);

  // Obsługa zmian w formularzu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Obsługa checkboxów
    if (type === "checkbox") {
      if (name.startsWith("notifications.")) {
        const notificationKey = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [notificationKey]: checked,
          },
        }));
      } else if (name.startsWith("privacy.")) {
        const privacyKey = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          privacy: {
            ...prev.privacy,
            [privacyKey]: checked,
          },
        }));
      }
    } else {
      // Obsługa zwykłych pól
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Obsługa formularza zmiany hasła
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Walidacja
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Nowe hasło i jego potwierdzenie nie są zgodne");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      setError("Nowe hasło musi mieć co najmniej 8 znaków");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Wystąpił błąd podczas zmiany hasła");
      }

      setSuccess("Hasło zostało zmienione pomyślnie");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Błąd zmiany hasła:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas zmiany hasła"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obsługa formularza ustawień powiadomień
  const handleNotificationsChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Zaimplementuj API do aktualizacji ustawień powiadomień
      // np. await updateNotificationSettingsMutation({
      //   userId: user.id,
      //   settings: formData.notifications
      // });

      console.log("Aktualizacja ustawień powiadomień:", {
        userId: user.id,
        settings: formData.notifications,
      });

      // Symulacja sukcesu (usuń to po implementacji API)
      setTimeout(() => {
        setSuccess("Ustawienia powiadomień zostały zaktualizowane");
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Błąd aktualizacji ustawień:", error);
      setError("Wystąpił błąd podczas aktualizacji ustawień powiadomień");
      setIsSubmitting(false);
    }
  };

  // Dodaj funkcję do obsługi usuwania konta
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Wprowadź hasło, aby potwierdzić usunięcie konta");
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Wystąpił błąd podczas usuwania konta");
      }

      // Wyślij akcję wylogowania do Redux
      dispatch(logout());

      // Przekieruj do strony głównej po usunięciu konta
      router.push("/");
    } catch (error) {
      console.error("Błąd usuwania konta:", error);
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas usuwania konta"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            {user ? (
              <DashboardSidebar user={user} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Placeholder */}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-6">Ustawienia konta</h1>

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

              {/* Informacje o koncie */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  Informacje o koncie
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Adres email
                    </p>
                    <p className="mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rola</p>
                    <p className="mt-1 capitalize">
                      {user?.role || "Użytkownik"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Status konta
                    </p>
                    <p className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktywne
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Formularz zmiany hasła */}
              <section className="mb-8 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Zmiana hasła</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <PasswordInput
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    label="Aktualne hasło"
                    required
                    autoComplete="current-password"
                  />

                  <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    label="Nowe hasło"
                    required
                    minLength={8}
                    helpText="Hasło musi mieć co najmniej 8 znaków"
                    autoComplete="new-password"
                  />

                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    label="Potwierdź nowe hasło"
                    required
                    autoComplete="new-password"
                  />

                  <div>
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "#1e50a0" }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Zapisywanie..." : "Zmień hasło"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Ustawienia powiadomień */}
              <section className="mb-8 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Ustawienia powiadomień
                </h2>
                <form
                  onSubmit={handleNotificationsChange}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="notifications.emailNotifications"
                        checked={formData.notifications.emailNotifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Otrzymuj powiadomienia email
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="notifications.activitySummary"
                        checked={formData.notifications.activitySummary}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Tygodniowe podsumowanie aktywności
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="notifications.newMessages"
                        checked={formData.notifications.newMessages}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Powiadomienia o nowych wiadomościach
                      </span>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "#1e50a0" }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Zapisywanie..." : "Zapisz ustawienia"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Ustawienia prywatności */}
              <section className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Ustawienia prywatności
                </h2>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="privacy.showEmail"
                        checked={formData.privacy.showEmail}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Pokazuj mój adres email innym użytkownikom
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="privacy.showActivity"
                        checked={formData.privacy.showActivity}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Pokazuj moją aktywność
                      </span>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "#1e50a0" }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Zapisywanie..."
                        : "Zapisz ustawienia prywatności"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Usuń konto */}
              <section className="mt-12 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4 text-red-600">
                  Strefa niebezpieczna
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane
                  zostaną trwale usunięte.
                </p>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Usuń konto
                </button>

                {/* Modal potwierdzający usunięcie konta */}
                {showDeleteConfirmation && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Potwierdzenie usunięcia konta
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Czy na pewno chcesz usunąć swoje konto? Ta operacja jest
                        nieodwracalna i spowoduje trwałe usunięcie wszystkich
                        Twoich danych.
                      </p>

                      <div className="mb-4">
                        <label
                          htmlFor="delete-password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Wprowadź hasło, aby potwierdzić
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            id="delete-password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                          />
                        </div>
                        {deleteError && (
                          <p className="mt-1 text-sm text-red-600">
                            {deleteError}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setShowDeleteConfirmation(false);
                            setDeletePassword("");
                            setDeleteError("");
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          disabled={isDeleting}
                        >
                          Anuluj
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Usuwanie..." : "Usuń konto"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
