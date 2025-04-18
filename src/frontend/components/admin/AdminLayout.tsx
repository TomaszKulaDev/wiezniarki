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
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Użytkownicy", href: "/admin/users" },
    { name: "Profile", href: "/admin/profiles" },
    { name: "Tokeny", href: "/admin/tokens" },
    { name: "Logi", href: "/admin/logs" },
    { name: "Ustawienia", href: "/admin/settings" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="bg-white w-64 border-r border-gray-200 fixed h-full left-0 top-0 z-30 overflow-y-auto shadow-sm">
        {/* Nagłówek sidebar */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Panel Administratora
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Zalogowany jako {user.email}
          </p>
        </div>

        {/* Menu nawigacyjne */}
        <nav className="mt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                block px-6 py-3 text-sm transition-colors border-l-4
                ${
                  pathname.startsWith(item.href)
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Stopka */}
        <div className="px-6 py-4 border-t border-gray-200 absolute bottom-0 w-full bg-white">
          <Link
            href="/dashboard"
            className="block text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Wróć do aplikacji
          </Link>
        </div>
      </div>

      {/* Menu mobilne */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm py-4 px-4 flex justify-between items-center z-40">
        <h1 className="text-lg font-semibold text-gray-900">
          Panel Administratora
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobilny sidebar */}
      <div
        className={`
          lg:hidden fixed inset-0 z-50 bg-white transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out
        `}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              Panel Administratora
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  block px-6 py-3 text-sm transition-colors border-l-4
                  ${
                    pathname.startsWith(item.href)
                      ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="px-6 py-4 border-t">
            <Link
              href="/dashboard"
              className="block text-sm text-gray-600 hover:text-gray-900 font-medium"
              onClick={() => setIsSidebarOpen(false)}
            >
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
      <main className="flex-1 ml-64 py-6 px-8">{children}</main>
    </div>
  );
}
