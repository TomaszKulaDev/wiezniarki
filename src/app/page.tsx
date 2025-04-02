"use client";

import Link from "next/link";
import MainLayout from "./MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section - bardziej oficjalny styl */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Więźniarki - Program Reintegracji Społecznej
              </h1>
              <p className="text-lg mb-6 text-white">
                Oficjalny program umożliwiający kobietom przebywającym w
                zakładach karnych nawiązanie relacji z osobami z zewnątrz w celu
                lepszej reintegracji ze społeczeństwem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/profiles"
                  className="bg-white text-primary font-semibold py-2 px-6 rounded hover:bg-gray-100 transition"
                >
                  Przeglądaj profile
                </Link>
                <Link
                  href="/about"
                  className="bg-transparent text-white border border-white font-semibold py-2 px-6 rounded hover:bg-white/10 transition"
                >
                  Dowiedz się więcej
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-8">
                <div className="aspect-video bg-white/20 rounded flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    Grafika informacyjna
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informacje o projekcie - w stylu podobnym do gov.pl */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            Informacje o projekcie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
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
              <h3 className="text-lg font-bold mb-2">Dla osadzonych kobiet</h3>
              <p className="text-gray-600">
                Możliwość stworzenia profilu, przedstawienia siebie i swoich
                zainteresowań, nawiązania relacji z osobami z zewnątrz.
              </p>
              <Link
                href="/for-inmates"
                className="mt-4 inline-block text-primary font-medium hover:underline"
              >
                Szczegółowe informacje →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Dla partnerów</h3>
              <p className="text-gray-600">
                Możliwość poznania kobiet, które chcą dzielić się swoimi
                doświadczeniami i budować relacje mimo trudnej sytuacji
                życiowej.
              </p>
              <Link
                href="/for-partners"
                className="mt-4 inline-block text-primary font-medium hover:underline"
              >
                Zasady udziału →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
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
              <h3 className="text-lg font-bold mb-2">Bezpieczeństwo</h3>
              <p className="text-gray-600">
                Program jest monitorowany przez specjalistów. Wszystkie profile
                i korespondencja są weryfikowane pod kątem bezpieczeństwa.
              </p>
              <Link
                href="/security"
                className="mt-4 inline-block text-primary font-medium hover:underline"
              >
                Zasady bezpieczeństwa →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jak to działa - sekcja procesowa */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Jak działa program Więźniarki?
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 h-full w-1 bg-primary rounded"></div>

              <div className="relative mb-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-primary text-white shadow">
                      <span className="text-xl font-bold">1</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-bold mb-2">
                      Rejestracja i weryfikacja
                    </h3>
                    <p className="text-gray-600">
                      Kobiety przebywające w zakładach karnych, które chcą
                      uczestniczyć w programie, są weryfikowane przez
                      pracowników zakładu karnego i tworzą swój profil.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mb-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-primary text-white shadow">
                      <span className="text-xl font-bold">2</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-bold mb-2">
                      Tworzenie profilu
                    </h3>
                    <p className="text-gray-600">
                      Uczestniczki uzupełniają informacje o sobie, swoich
                      zainteresowaniach, planach na przyszłość. Wszystkie
                      informacje są weryfikowane przed publikacją.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mb-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-primary text-white shadow">
                      <span className="text-xl font-bold">3</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-bold mb-2">
                      Nawiązywanie kontaktu
                    </h3>
                    <p className="text-gray-600">
                      Osoby zainteresowane mogą przeglądać profile i inicjować
                      kontakt. Pierwsza korespondencja jest moderowana w celu
                      zapewnienia bezpieczeństwa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-primary text-white shadow">
                      <span className="text-xl font-bold">4</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-bold mb-2">
                      Budowanie relacji
                    </h3>
                    <p className="text-gray-600">
                      Po nawiązaniu kontaktu, uczestnicy programu mogą wymieniać
                      wiadomości, poznawać się lepiej i budować relacje, które
                      wspierają proces resocjalizacji.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wyróżnione profile */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Wyróżnione profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((profile) => (
              <div
                key={profile}
                className="bg-white rounded-lg shadow-sm border border-border overflow-hidden"
              >
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500">Zdjęcie profilowe</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">Anna K.</h3>
                    <span className="text-xs text-gray-500">
                      ID: AK-{profile}24
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                      Malarstwo
                    </span>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                      Literatura
                    </span>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Pszczoły
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Interesuje się sztuką, literaturą i przyrodą. Szuka osób, z
                    którymi mogłaby dzielić się swoimi pasjami i pomysłami na
                    przyszłość.
                  </p>
                  <div className="pt-3 border-t border-border">
                    <Link
                      href={`/profiles/${profile}`}
                      className="text-primary font-medium hover:underline text-sm"
                    >
                      Zobacz profil →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/profiles"
              className="bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-primary-dark transition"
            >
              Zobacz wszystkie profile
            </Link>
          </div>
        </div>
      </section>

      {/* Komunikaty i statystyki */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Resocjalizacja poprzez relacje
              </h2>
              <p className="mb-6 text-white">
                Program Więźniarki to oficjalna inicjatywa mająca na celu
                wsparcie procesu resocjalizacji poprzez budowanie zdrowych
                relacji społecznych.
              </p>
              <p className="mb-6 text-white">
                Badania pokazują, że osoby osadzone, które utrzymują pozytywne
                relacje ze światem zewnętrznym, mają większe szanse na udaną
                reintegrację społeczną po odbyciu kary.
              </p>
              <Link
                href="/about"
                className="inline-block bg-white text-primary font-semibold py-2 px-6 rounded hover:bg-gray-100 transition"
              >
                Pełna informacja o projekcie
              </Link>
            </div>
            <div className="bg-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-6 text-center text-white">
                Statystyki projektu
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-white">247</div>
                  <p className="text-sm text-white">Aktywnych profili</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-white">1452</div>
                  <p className="text-sm text-white">Nawiązanych kontaktów</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-white">83%</div>
                  <p className="text-sm text-white">Pozytywnych opinii</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-white">124</div>
                  <p className="text-sm text-white">Zakładów karnych</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-accent border-t border-border mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Masz pytania?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Jeśli chcesz dowiedzieć się więcej o programie Więźniarki lub
            potrzebujesz pomocy, skontaktuj się z naszym biurem obsługi.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/contact"
              className="bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-primary-dark transition"
            >
              Kontakt
            </Link>
            <Link
              href="/faq"
              className="bg-white text-primary border border-primary font-semibold py-2 px-6 rounded hover:bg-gray-50 transition"
            >
              Najczęstsze pytania
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
