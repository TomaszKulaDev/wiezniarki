"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";
import Image from "next/image";

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
      "/units": "Jednostki penitencjarne",
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
              className="mr-4 tracking-wide"
              style={{
                color: "white",
                fontFamily: "'Montserrat', 'Roboto', sans-serif",
                fontWeight: "600",
                letterSpacing: "0.03em",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                textShadow: "0 1px 1px rgba(0,0,0,0.1)",
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
            <a
              href="#"
              style={{ color: "white" }}
              className="hover:opacity-80 flex items-center"
              aria-label="Biuletyn Informacji Publicznej"
            >
              <div className="bg-white rounded px-1 py-0.5 flex items-center justify-center">
                <Image
                  src="/bip_simple.svg"
                  alt="BIP"
                  width={24}
                  height={10}
                  className="h-4"
                />
              </div>
            </a>
            <span style={{ color: "white" }}>|</span>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 transition"
                aria-label="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 transition"
                aria-label="Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.162 5.65593C21.3986 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4804 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75098 3.198 4.45893C2.82629 5.09738 2.63095 5.82315 2.632 6.56193C2.632 8.01193 3.37 9.29293 4.492 10.0429C3.82801 10.022 3.17863 9.84271 2.598 9.51993V9.57193C2.5985 10.5376 2.93267 11.4735 3.54414 12.221C4.15562 12.9684 5.00678 13.4814 5.953 13.6729C5.33661 13.84 4.69031 13.8646 4.063 13.7449C4.32987 14.5762 4.85001 15.3031 5.55059 15.824C6.25118 16.345 7.09712 16.6337 7.97 16.6499C7.10248 17.3313 6.10918 17.8349 5.04689 18.1321C3.98459 18.4293 2.87412 18.5142 1.779 18.3819C3.6907 19.6114 5.91609 20.264 8.189 20.2619C15.882 20.2619 20.089 13.8889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.2301 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 transition"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 transition"
                aria-label="YouTube"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
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
                  href="/units"
                  className={`text-sm font-medium hover:text-primary transition ${
                    pathname === "/units"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Jednostki
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
                  href="/units"
                  className={`block text-sm font-medium hover:text-primary transition ${
                    pathname === "/units"
                      ? "text-primary font-bold"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Jednostki penitencjarne
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
                    className="inline-flex items-center gap-2 bg-primary text-white font-medium py-1.5 px-4 border border-primary hover:bg-primary-dark transition-colors duration-200 rounded mt-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    <span>Rejestracja</span>
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
        className="py-3"
      >
        <div className="container mx-auto px-4">
          <nav>
            <ul className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-10 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-700 hover:text-primary transition font-medium py-2 block"
                >
                  Jak działa platforma
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-700 hover:text-primary transition font-medium py-2 block"
                >
                  Najczęściej zadawane pytania
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-700 hover:text-primary transition font-medium py-2 block"
                >
                  Bezpieczeństwo
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-gray-700 hover:text-primary transition font-medium py-2 block"
                >
                  Historie sukcesu
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="text-gray-700 hover:text-primary transition font-medium py-2 block"
                >
                  Mapa strony
                </Link>
              </li>
              {!isMounted || !isLoggedIn ? (
                <li className="ml-auto">
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition shadow-sm transform hover:scale-105 group"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e50a0 0%, #0e3a7e 100%)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:rotate-12"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Zarejestruj się</span>
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
