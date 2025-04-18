"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import DashboardSidebar from "@/frontend/components/dashboard/DashboardSidebar";
import DashboardStats from "@/frontend/components/dashboard/DashboardStats";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import { useAppDispatch } from "@/frontend/store/hooks";
import { loginSuccess, logout } from "@/frontend/store/slices/authSlice";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Użycie RTK Query do pobierania danych użytkownika
  const { data: user, isLoading, error, isError } = useGetCurrentUserQuery();

  // Zaktualizuj globalny stan auth po pobraniu danych
  useEffect(() => {
    if (user) {
      dispatch(
        loginSuccess({
          id: user.id,
          email: user.email,
          role: user.role,
        })
      );
    } else if (isError) {
      dispatch(logout());

      // Przekieruj na stronę logowania
      router.push("/login");
    }
  }, [user, isError, dispatch, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>
              {error
                ? "Wystąpił błąd podczas ładowania panelu użytkownika"
                : "Nie znaleziono danych użytkownika"}
            </p>
          </div>
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
            <DashboardSidebar user={user} />
          </div>

          {/* Main content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">Witaj, {user.email}!</h1>
              <p className="text-gray-600 mb-6">
                Twój panel zarządzania kontem. Tutaj możesz zarządzać swoim
                profilem, sprawdzać powiadomienia i śledzić aktywność.
              </p>

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h2 className="text-lg font-semibold text-primary mb-2">
                  Status konta
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${
                        user.verified ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {user.verified ? "✓" : "✗"}
                    </span>
                    <span>
                      {user.verified
                        ? "Konto zweryfikowane"
                        : "Konto niezweryfikowane - sprawdź swoją skrzynkę email"}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className={`mr-2 text-gray-500`}>➤</span>
                    <span>
                      Rola:{" "}
                      <span className="font-medium capitalize">
                        {user.role}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className={`mr-2 text-gray-500`}>➤</span>
                    <span>
                      Ostatnie logowanie:{" "}
                      <span className="font-medium">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString(
                              "pl-PL",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Brak danych"}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Statystyki */}
            <DashboardStats userId={user.id} role={user.role} />

            {/* Ostatnie aktywności */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Ostatnie aktywności</h2>
              <div className="text-gray-500 text-center py-8">
                <p>Brak ostatnich aktywności</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
