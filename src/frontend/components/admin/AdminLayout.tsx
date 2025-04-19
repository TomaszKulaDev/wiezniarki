"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Zamknij menu po zmianie ścieżki
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Zapobiegaj przewijaniu strony, gdy menu mobilne jest otwarte
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Użytkownicy", href: "/admin/users", icon: "👥" },
    { name: "Profile", href: "/admin/profiles", icon: "👤" },
    { name: "Tokeny", href: "/admin/tokens", icon: "🔑" },
    { name: "Logi", href: "/admin/logs", icon: "📝" },
    { name: "Metryki DB", href: "/admin/metrics", icon: "📈" },
    { name: "Ustawienia", href: "/admin/settings", icon: "⚙️" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Górne menu - przyklejone na stałe */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-blue-600 text-2xl font-bold mr-2">
                  Admin
                </span>
                <span className="text-gray-700 text-lg hidden sm:inline">
                  Panel Administratora
                </span>
              </div>
            </div>

            {/* Nawigacja na większych ekranach */}
            <nav className="hidden md:flex items-center">
              <div className="flex flex-wrap justify-end gap-1 max-w-2xl">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-150 flex items-center ${
                      pathname.startsWith(item.href)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="inline-block mr-1">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="h-6 mx-2 border-l border-gray-300"></div>

              <div className="text-sm text-gray-600 flex items-center">
                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-2">
                  {user.email.charAt(0).toUpperCase()}
                </span>
                <span className="hidden lg:inline font-medium truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>

              <Link
                href="/dashboard"
                className="ml-3 px-3 py-1.5 border border-gray-300 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors duration-150"
              >
                Powrót
              </Link>
            </nav>

            {/* Przycisk menu mobilnego */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Otwórz menu</span>
                {isMenuOpen ? (
                  <svg
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
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobilne - nakładka na cały ekran */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="pt-16 pb-8 h-full overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="px-2 space-y-1 flex-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
                      pathname.startsWith(item.href)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 p-4 mt-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-gray-500">Administrator</div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Powrót do aplikacji
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Główna zawartość */}
      <main className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
