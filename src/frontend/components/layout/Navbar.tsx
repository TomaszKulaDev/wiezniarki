"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Funkcja do pobierania nazwy strony na podstawie ścieżki
  const getPageNameFromPath = (path: string) => {
    if (path === "/") return "";

    const pathSegments = {
      "/regulamin": "Regulamin",
      "/privacy": "Polityka Prywatności",
      "/faq": "Najczęściej zadawane pytania",
      "/about": "O projekcie",
      "/contact": "Kontakt",
      "/profiles": "Profile",
      "/dashboard": "Mój panel",
      "/login": "Logowanie",
      "/register": "Rejestracja",
    };

    return pathSegments[path as keyof typeof pathSegments] || "";
  };

  const pageName = getPageNameFromPath(pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Błąd podczas sprawdzania stanu logowania:", error);
        setIsLoggedIn(false);
      }
    }
  }, [pathname, isMounted]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }

    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <header className="border-t border-border">
      {/* Top bar */}
      <div style={{ backgroundColor: "#1e50a0" }} className="py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-sm font-semibold">
            <span
              className="mr-4"
              style={{
                color: "white",
                fontWeight: "bold",
                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              Serwis Resocjalizacji Społecznej
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {isMounted && isLoggedIn ? (
              <button
                onClick={handleLogout}
                style={{ color: "white" }}
                className="hover:underline"
              >
                Wyloguj
              </button>
            ) : (
              <Link
                href="/login"
                style={{ color: "white" }}
                className="hover:underline"
              >
                Logowanie
              </Link>
            )}
            <span style={{ color: "white" }}>|</span>
            <a href="#" style={{ color: "white" }} className="hover:underline">
              BIP
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              {/* Placeholder for Polish Eagle logo - w rzeczywistym projekcie użyj właściwego godła */}
              <div className="w-14 h-14 bg-white flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 2L3 9V23L16 30L29 23V9L16 2Z" fill="#D1213D" />
                  <path d="M16 5L7 10V21L16 26L25 21V10L16 5Z" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
            <div>
              <Link href="/" className="text-2xl font-bold text-primary">
                Więźniarki
              </Link>
              <div className="text-sm text-gray-600">
                Projekt integracji społecznej
              </div>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-8">
              <li>
                <Link
                  href="/"
                  className={`text-sm font-medium hover:text-primary transition ${
                    pathname === "/"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Strona główna
                </Link>
              </li>
              <li>
                <Link
                  href="/profiles"
                  className={`text-sm font-medium hover:text-primary transition ${
                    pathname === "/profiles"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`text-sm font-medium hover:text-primary transition ${
                    pathname === "/about"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                >
                  O projekcie
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-sm font-medium hover:text-primary transition ${
                    pathname === "/contact"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Kontakt
                </Link>
              </li>
              {isMounted && isLoggedIn && (
                <li>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium hover:text-primary transition ${
                      pathname === "/dashboard"
                        ? "text-primary font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    Mój panel
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-white py-4 md:hidden border-t border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className={`block text-sm font-medium hover:text-primary transition ${
                    pathname === "/"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Strona główna
                </Link>
              </li>
              <li>
                <Link
                  href="/profiles"
                  className={`block text-sm font-medium hover:text-primary transition ${
                    pathname === "/profiles"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`block text-sm font-medium hover:text-primary transition ${
                    pathname === "/about"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  O projekcie
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`block text-sm font-medium hover:text-primary transition ${
                    pathname === "/contact"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Kontakt
                </Link>
              </li>
              {isMounted && isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className={`block text-sm font-medium hover:text-primary transition ${
                        pathname === "/dashboard"
                          ? "text-primary font-bold"
                          : "text-gray-700"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Mój panel
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="block text-sm font-medium text-gray-700 hover:text-primary transition"
                    >
                      Wyloguj
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/register"
                    className="block text-sm text-primary hover:text-primary-dark transition font-bold"
                    onClick={() => setMenuOpen(false)}
                  >
                    Rejestracja
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Secondary navigation */}
      <div
        style={{
          backgroundColor: "#f6f9fc",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
        }}
        className="py-2"
      >
        <div className="container mx-auto px-4">
          <nav>
            <ul className="flex flex-wrap gap-4 md:gap-8 text-xs">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-700 hover:text-primary transition font-medium"
                >
                  Najczęściej zadawane pytania
                </Link>
              </li>
              <li>
                <Link
                  href="/regulamin"
                  className="text-gray-700 hover:text-primary transition font-medium"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-700 hover:text-primary transition font-medium"
                >
                  Polityka prywatności
                </Link>
              </li>
              {!isMounted || !isLoggedIn ? (
                <li className="ml-auto">
                  <Link
                    href="/register"
                    className="text-primary font-bold hover:text-primary-dark transition"
                  >
                    Zarejestruj się
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>

      {/* Breadcrumbs - tylko na podstronach */}
      {pathname !== "/" && pageName && <Breadcrumbs pageName={pageName} />}
    </header>
  );
}
