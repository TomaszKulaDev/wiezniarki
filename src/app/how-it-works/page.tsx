"use client";

import React from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <MainLayout>
      <Breadcrumbs pageName="Jak działa platforma" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Jak działa platforma Więźniarki
          </h1>
          <p className="text-gray-600">
            Przewodnik dla nowych użytkowników programu
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Wprowadzenie */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-4">
                Witamy w programie Więźniarki
              </h2>
              <p className="text-gray-700 mb-4">
                Program &quot;Więźniarki&quot;, który rozpocznie działalność w
                2025 roku, to inicjatywa mająca na celu wsparcie procesu
                resocjalizacji kobiet odbywających karę pozbawienia wolności
                poprzez umożliwienie im nawiązania wartościowych relacji z
                osobami spoza zakładów karnych.
              </p>
              <p className="text-gray-700">
                Na tej stronie przedstawiamy, jak krok po kroku korzystać z
                platformy, zarówno dla osób z zewnątrz zainteresowanych
                nawiązaniem kontaktu, jak i dla osadzonych kobiet biorących
                udział w programie.
              </p>
            </div>

            {/* Proces dla użytkowników zewnętrznych */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Dla osób z zewnątrz – jak nawiązać kontakt
              </h2>

              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Rejestracja i weryfikacja
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Pierwszym krokiem jest utworzenie konta na naszej
                      platformie. Wymaga to podania podstawowych danych
                      osobowych, które będą podlegały weryfikacji. Proces ten
                      jest niezbędny, aby zapewnić bezpieczeństwo wszystkim
                      uczestnikom programu.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Ważne:</strong> Weryfikacja tożsamości jest
                        obowiązkowa i może potrwać do 48 godzin roboczych.
                        Wymagane dokumenty to skan dowodu osobistego oraz
                        aktualne zdjęcie.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Przeglądanie profili
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Po pozytywnej weryfikacji uzyskasz dostęp do przeglądania
                      profili kobiet uczestniczących w programie. Profile
                      zawierają informacje o zainteresowaniach, umiejętnościach
                      i aspiracjach osadzonych kobiet, nie zawierają natomiast
                      szczegółów dotyczących popełnionych przestępstw.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Możesz filtrować profile według zainteresowań, wieku,
                        lokalizacji jednostki penitencjarnej oraz znajomości
                        języków obcych.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Wysłanie pierwszej wiadomości
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Gdy znajdziesz profil osoby, z którą chciałbyś/chciałabyś
                      nawiązać kontakt, możesz wysłać pierwszą wiadomość.
                      Wszystkie wiadomości są moderowane, zanim zostaną
                      dostarczone. Moderacja ma na celu zapewnienie
                      bezpieczeństwa komunikacji.
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Pamiętaj:</strong> Pierwsza wiadomość powinna
                        zawierać krótkie przedstawienie siebie, swoich
                        zainteresowań i motywacji do nawiązania kontaktu. Unikaj
                        zbyt osobistych pytań na początkowym etapie komunikacji.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">4</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Regularna korespondencja
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Po nawiązaniu pierwszego kontaktu, możesz kontynuować
                      regularną korespondencję. Czas dostarczenia wiadomości
                      może wynosić od 1 do 3 dni roboczych ze względu na proces
                      moderacji i procedury obowiązujące w zakładach karnych.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Z czasem, po nawiązaniu stałej korespondencji, będziesz
                        mógł/mogła zawnioskować o widzenie, które odbędzie się
                        zgodnie z regulaminem jednostki penitencjarnej.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proces dla osadzonych */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Dla osadzonych kobiet – jak dołączyć do programu
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Zgłoszenie uczestnictwa
                    </h3>
                    <p className="text-gray-700">
                      Jeśli jesteś zainteresowana udziałem w programie, zgłoś to
                      wychowawcy lub psychologowi w swojej jednostce
                      penitencjarnej. Po wstępnej kwalifikacji otrzymasz
                      formularz zgłoszeniowy oraz informacje o zasadach
                      uczestnictwa w programie.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Utworzenie profilu
                    </h3>
                    <p className="text-gray-700">
                      Przy wsparciu personelu penitencjarnego utworzysz swój
                      profil, który będzie widoczny na platformie. Będziesz
                      mogła opisać swoje zainteresowania, umiejętności, edukację
                      oraz cele i aspiracje. Dla wielu osadzonych jest to także
                      okazja do refleksji nad własnymi mocnymi stronami i
                      zasobami.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Otrzymywanie i odpisywanie na wiadomości
                    </h3>
                    <p className="text-gray-700">
                      Gdy ktoś zdecyduje się nawiązać z Tobą kontakt, otrzymasz
                      jego wiadomość za pośrednictwem wyznaczonego pracownika
                      jednostki. Twoje odpowiedzi również będą przekazywane w
                      ten sposób, a następnie wprowadzane do systemu. Cała
                      korespondencja jest monitorowana pod kątem bezpieczeństwa.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">4</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Możliwość spotkań
                    </h3>
                    <p className="text-gray-700">
                      Po nawiązaniu regularnej korespondencji i spełnieniu
                      określonych warunków, możliwe będzie zorganizowanie
                      spotkań osobistych, które odbędą się zgodnie z regulaminem
                      jednostki penitencjarnej.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Zasady bezpieczeństwa */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-5">
                Zasady bezpieczeństwa
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Ochrona danych osobowych
                  </h3>
                  <p className="text-gray-700">
                    Wszystkie dane osobowe są chronione zgodnie z obowiązującymi
                    przepisami. Nie udostępniamy adresów, numerów telefonów ani
                    innych wrażliwych informacji bez zgody obu stron.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Moderacja komunikacji
                  </h3>
                  <p className="text-gray-700">
                    Cała komunikacja przechodzi przez proces moderacji, aby
                    zapewnić bezpieczeństwo wszystkim uczestnikom programu.
                    Treści zawierające groźby, obraźliwy język lub próby
                    manipulacji nie będą przekazywane dalej.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Zasada dobrowolności
                  </h3>
                  <p className="text-gray-700">
                    Uczestnictwo w programie jest całkowicie dobrowolne. Każda
                    ze stron może w dowolnym momencie przerwać komunikację bez
                    podawania przyczyny.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-accent rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Gotowy do dołączenia?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Program &quot;Więźniarki&quot; rozpocznie się w 2025 roku. Już
                teraz możesz zapisać się na listę osób zainteresowanych, aby
                otrzymać powiadomienie o starcie platformy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="bg-primary text-white font-semibold py-3 px-6 rounded hover:bg-primary-dark transition shadow-md"
                  style={{
                    color: "white",
                    backgroundColor: "#1e50a0",
                    border: "2px solid #1e50a0",
                  }}
                >
                  Zapisz się na listę oczekujących
                </Link>
                <Link
                  href="/contact"
                  className="bg-white text-primary font-semibold py-3 px-6 rounded hover:bg-gray-50 transition shadow-md border-2 border-primary"
                  style={{ color: "#1e50a0", backgroundColor: "white" }}
                >
                  Masz pytania? Skontaktuj się z nami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
