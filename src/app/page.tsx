"use client";

import Link from "next/link";
import MainLayout from "./MainLayout";
import Image from "next/image";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section - bardziej oficjalny styl */}
      <section className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-gray-300">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-300">
                Więźniarki - Program Reintegracji Społecznej
              </h1>
              <p className="text-lg mb-6 text-gray-300">
                Oficjalny program umożliwiający kobietom przebywającym w
                zakładach karnych nawiązanie relacji z osobami z zewnątrz w celu
                lepszej reintegracji ze społeczeństwem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/profiles"
                  className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-300 transition"
                >
                  Przeglądaj profile
                </Link>
                <Link
                  href="/about"
                  className="bg-transparent text-gray-300 border border-gray-300 font-semibold py-2 px-6 rounded hover:bg-gray-700 transition"
                >
                  Dowiedz się więcej
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gray-700 rounded-lg p-8">
                <div className="aspect-video bg-gray-600 rounded flex items-center justify-center overflow-hidden">
                  <Image
                    src="/prison-integration.svg"
                    alt="Program reintegracji społecznej dla kobiet w zakładach karnych"
                    width={600}
                    height={400}
                    priority
                  />
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
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-gray-500 text-white shadow">
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
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-gray-500 text-white shadow">
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
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-gray-500 text-white shadow">
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
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-gray-500 text-white shadow">
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

      {/* Komunikaty i statystyki */}
      <section className="py-14 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-300">
                Skuteczna resocjalizacja poprzez relacje społeczne
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Program Więźniarki jest oficjalną inicjatywą wspierającą
                  proces resocjalizacji kobiet poprzez budowanie wartościowych
                  relacji społecznych.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Wnioski z przeprowadzonych analiz potwierdzają, że osoby
                  osadzone utrzymujące regularny, pozytywny kontakt ze światem
                  zewnętrznym zwiększają swoje szanse na skuteczną reintegrację
                  społeczną po odbyciu kary o 40%.
                </p>
                <div className="mt-8">
                  <Link
                    href="/about"
                    className="inline-flex items-center bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-300 transition"
                  >
                    <span>Szczegółowe informacje o programie</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-8">
              <h3 className="text-xl font-semibold mb-8 text-center text-gray-300 border-b border-gray-600 pb-4">
                Bieżące statystyki programu
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold mb-1 text-gray-300">
                      247
                    </div>
                    <div className="w-12 h-1 bg-gray-600 rounded mb-2"></div>
                    <p className="text-sm text-gray-400">
                      Aktywnych uczestniczek
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold mb-1 text-gray-300">
                      1452
                    </div>
                    <div className="w-12 h-1 bg-gray-600 rounded mb-2"></div>
                    <p className="text-sm text-gray-400">
                      Nawiązanych kontaktów
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold mb-1 text-gray-300">
                      83%
                    </div>
                    <div className="w-12 h-1 bg-gray-600 rounded mb-2"></div>
                    <p className="text-sm text-gray-400">Pozytywnych opinii</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold mb-1 text-gray-300">
                      124
                    </div>
                    <div className="w-12 h-1 bg-gray-600 rounded mb-2"></div>
                    <p className="text-sm text-gray-400">
                      Jednostek penitencjarnych
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                Stan na dzień: 3.04.2025
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
              className="bg-primary text-white font-extrabold py-3 px-6 rounded hover:bg-primary-dark transition shadow-md text-base"
              style={{
                color: "white",
                backgroundColor: "#1e50a0",
                border: "2px solid #1e50a0",
              }}
            >
              Kontakt
            </Link>
            <Link
              href="/faq"
              className="bg-white text-primary font-extrabold py-3 px-6 rounded hover:bg-gray-50 transition shadow-md border-2 border-primary text-base"
              style={{ color: "#1e50a0", backgroundColor: "white" }}
            >
              Najczęstsze pytania
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
