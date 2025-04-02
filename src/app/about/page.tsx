"use client";

import MainLayout from "../MainLayout";
import Link from "next/link";

export default function About() {
  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            O projekcie Więźniarki
          </h1>
          <p className="text-white/80">
            Program wsparcia resocjalizacji i reintegracji społecznej
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-accent py-2 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-xs text-gray-600">
            <Link href="/" className="hover:text-primary transition">
              Strona główna
            </Link>{" "}
            &gt; <span className="text-gray-800">O projekcie</span>
          </div>
        </div>
      </div>

      {/* Główna treść */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8">
              <h2 className="text-xl font-bold text-primary mb-4">
                O programie Więźniarki
              </h2>
              <p className="mb-4">
                Program "Więźniarki" to oficjalna inicjatywa mająca na celu
                wsparcie procesu resocjalizacji kobiet odbywających karę
                pozbawienia wolności poprzez umożliwienie im nawiązania
                wartościowych relacji z osobami spoza zakładów karnych.
              </p>
              <p className="mb-4">
                Projekt powstał w odpowiedzi na badania naukowe, które
                jednoznacznie wskazują, że osoby osadzone utrzymujące pozytywne
                relacje społeczne mają znacznie większe szanse na udaną
                reintegrację ze społeczeństwem po odbyciu kary.
              </p>
              <p className="mb-4">
                Celem programu jest stworzenie bezpiecznej i kontrolowanej
                platformy, która umożliwi kobietom przebywającym w zakładach
                karnych zaprezentowanie siebie, swoich zainteresowań i talentów,
                a także nawiązanie relacji z osobami, które mogą stanowić dla
                nich pozytywne wsparcie.
              </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8">
              <h2 className="text-xl font-bold text-primary mb-4">
                Założenia programu
              </h2>
              <ul className="list-disc pl-6 space-y-3 mb-4">
                <li>
                  <span className="font-medium">Bezpieczeństwo</span> -
                  wszystkie profile i komunikacja są weryfikowane przez
                  wyspecjalizowany zespół moderatorów, co zapewnia ochronę
                  zarówno osadzonym, jak i osobom z zewnątrz.
                </li>
                <li>
                  <span className="font-medium">Transparentność</span> - zasady
                  uczestnictwa w programie są jasno określone i dostępne dla
                  wszystkich stron, a cały proces jest nadzorowany przez Służbę
                  Więzienną.
                </li>
                <li>
                  <span className="font-medium">Wsparcie resocjalizacji</span> -
                  program jest elementem szerszego procesu resocjalizacji,
                  mającego na celu przygotowanie osadzonych do powrotu do
                  społeczeństwa.
                </li>
                <li>
                  <span className="font-medium">Rozwój osobisty</span> -
                  uczestnictwo w programie motywuje osadzone do pracy nad sobą,
                  rozwijania zainteresowań i umiejętności społecznych.
                </li>
                <li>
                  <span className="font-medium">
                    Przeciwdziałanie wykluczeniu
                  </span>{" "}
                  - program pomaga przełamywać stereotypy i uprzedzenia wobec
                  osób odbywających karę pozbawienia wolności.
                </li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-xl font-bold text-primary mb-4">
                Struktura i organizacja
              </h2>
              <p className="mb-4">
                Program "Więźniarki" jest koordynowany przez zespół
                specjalistów, w skład którego wchodzą:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Funkcjonariusze Służby Więziennej</li>
                <li>Psycholodzy penitencjarni</li>
                <li>Specjaliści ds. resocjalizacji</li>
                <li>Pracownicy socjalni</li>
                <li>Eksperci ds. bezpieczeństwa cyfrowego</li>
              </ul>
              <p className="mb-4">
                Funkcjonowanie platformy opiera się na ścisłej współpracy z
                administracją zakładów karnych, co zapewnia zgodność z
                obowiązującymi przepisami oraz bezpieczeństwo wszystkich
                uczestników programu.
              </p>
              <p>
                Program jest finansowany ze środków publicznych oraz dotacji
                organizacji zajmujących się wspieraniem osób wykluczonych
                społecznie.
              </p>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border mb-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                Dane kontaktowe
              </h3>
              <address className="not-italic text-sm">
                <p className="mb-2">Biuro Projektu "Więźniarki"</p>
                <p className="mb-2">ul. Przykładowa 123</p>
                <p className="mb-4">00-001 Warszawa</p>
                <p className="mb-2">
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
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-border mb-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                Dokumenty i informacje
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/regulations" className="flex items-center group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-700 group-hover:text-primary transition">
                      Regulamin programu
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="flex items-center group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2"
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
                    <span className="text-gray-700 group-hover:text-primary transition">
                      Polityka prywatności
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="flex items-center group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-700 group-hover:text-primary transition">
                      Najczęstsze pytania
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="flex items-center group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-gray-700 group-hover:text-primary transition">
                      Raporty i analizy
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-primary text-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">Jesteś zainteresowany?</h3>
              <p className="text-sm mb-4">
                Chcesz dołączyć do programu lub masz pytania? Zachęcamy do
                skontaktowania się z nami.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-primary font-semibold py-2 px-4 rounded hover:bg-gray-100 transition w-full text-center"
              >
                Skontaktuj się z nami
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
