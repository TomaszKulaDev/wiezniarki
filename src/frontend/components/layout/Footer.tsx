"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Więźniarki</h3>
            <p className="text-sm text-gray-600 mb-4">
              Projekt integracji społecznej mający na celu wsparcie kobiet
              osadzonych w zakładach karnych w procesie budowania relacji z
              osobami z zewnątrz.
            </p>
            <div className="flex items-center mt-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path d="M16 2L3 9V23L16 30L29 23V9L16 2Z" fill="#D1213D" />
                <path d="M16 5L7 10V21L16 26L25 21V10L16 5Z" fill="#FFFFFF" />
              </svg>
              <span className="text-xs text-gray-500">
                Projekt pod patronatem Ministerstwa Sprawiedliwości
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Informacje</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary transition"
                >
                  O projekcie
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Najczęściej zadawane pytania
                </Link>
              </li>
              <li>
                <Link
                  href="/regulations"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Mapa strony
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Dla użytkowników</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/profiles"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Profile kobiet osadzonych
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Jak działa platforma
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Historie sukcesu
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Bezpieczeństwo
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Pomoc
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Kontakt</h3>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>Biuro Projektu &quot;Więźniarki&quot;</p>
              <p>ul. Przykładowa 123</p>
              <p>00-001 Warszawa</p>
              <p className="mt-3">
                <a
                  href="mailto:kontakt@wiezniarki.gov.pl"
                  className="text-primary hover:underline"
                >
                  kontakt@wiezniarki.gov.pl
                </a>
              </p>
              <p>
                <a
                  href="tel:+48123456789"
                  className="text-primary hover:underline"
                >
                  +48 123 456 789
                </a>
              </p>
            </address>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-block bg-primary text-white font-medium py-2 px-4 rounded hover:bg-primary-dark transition"
              >
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary footer with links */}
      <div className="bg-accent py-6 border-t border-border mt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
            <ul className="flex flex-wrap gap-6 text-xs">
              <li>
                <Link
                  href="/declaration"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Deklaracja dostępności
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Polityka cookies
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition"
                >
                  BIP
                </a>
              </li>
            </ul>
            <div className="text-xs text-gray-500">
              <p>
                © {new Date().getFullYear()} Więźniarki. Wszelkie prawa
                zastrzeżone.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Więźniarki to oficjalny projekt wspierający resocjalizację i
              reintegrację społeczną
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
