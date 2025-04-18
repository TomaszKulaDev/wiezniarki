"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Użytkownicy", href: "/admin/users", icon: "👥" },
    { name: "Profile", href: "/admin/profiles", icon: "👤" },
    { name: "Logi", href: "/admin/logs", icon: "📃" },
    { name: "Ustawienia", href: "/admin/settings", icon: "⚙️" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
        <p className="text-gray-600 mb-6">
          Nie masz uprawnień do wyświetlenia tego panelu.
        </p>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Wróć do panelu użytkownika
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Menu mobilne */}
      <div className="lg:hidden bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">
          Panel Administratora
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 fixed lg:static lg:w-64 top-0 z-50 h-screen bg-white shadow-md 
            transition-transform duration-300 ease-in-out
          `}
        >
          <div className="h-full flex flex-col">
            {/* Nagłówek sidebar */}
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-gray-900">
                Panel Administratora
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Zalogowany jako {user.email}
              </p>
            </div>

            {/* Menu nawigacyjne */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-md text-sm transition-colors
                    ${
                      pathname.startsWith(item.href)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Stopka */}
            <div className="p-4 border-t">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <span className="mr-3">🏠</span>
                Wróć do aplikacji
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay dla mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Główna zawartość */}
        <main className="flex-1 p-6 lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
