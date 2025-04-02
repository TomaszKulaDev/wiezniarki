"use client";

import MainLayout from "../MainLayout";
import Link from "next/link";

export default function Privacy() {
  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Polityka Prywatności
          </h1>
          <p className="text-white/80">
            Zasady przetwarzania danych osobowych w programie
            &quot;Więźniarki&quot;
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="container mx-auto px-4 py-5">
        <div className="max-w-4xl mx-auto">
          {/* Krótkie wprowadzenie */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-3">
              Polityka Prywatności programu &quot;Więźniarki&quot;
            </h2>
            <p className="text-gray-700 mb-4">
              Ochrona Twoich danych osobowych jest dla nas priorytetem. Poniżej
              znajdziesz informacje o tym, jakie dane zbieramy, w jakim celu
              oraz jakie przysługują Ci prawa w związku z przetwarzaniem danych
              osobowych.
            </p>
            <p className="text-gray-700">
              Niniejsza Polityka Prywatności obowiązuje od dnia 01.01.2023 r.
            </p>
          </div>

          {/* Treść polityki prywatności */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  1. Administrator danych osobowych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    1.1. Administratorem danych osobowych przetwarzanych w
                    ramach programu &quot;Więźniarki&quot; jest Ministerstwo
                    Sprawiedliwości we współpracy z Centralnym Zarządem Służby
                    Więziennej (zwani dalej &quot;Administratorem&quot;).
                  </p>
                  <p>
                    1.2. Kontakt w sprawach związanych z przetwarzaniem danych
                    osobowych:
                  </p>
                  <p className="pl-5">
                    Adres: ul. Example 123, 00-000 Warszawa
                    <br />
                    E-mail: dane.osobowe@wiezniarki.gov.pl
                    <br />
                    Telefon: +48 22 123 45 67
                  </p>
                  <p>
                    1.3. Administrator wyznaczył Inspektora Ochrony Danych
                    (IOD), z którym można kontaktować się w sprawach dotyczących
                    przetwarzania danych osobowych oraz korzystania z praw
                    związanych z przetwarzaniem danych.
                  </p>
                  <p className="pl-5">E-mail: iod@wiezniarki.gov.pl</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  2. Zakres zbieranych danych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    2.1. W ramach programu &quot;Więźniarki&quot; przetwarzamy
                    następujące kategorie danych osobowych:
                  </p>
                  <p className="font-medium mt-2">A. Dane osób osadzonych:</p>
                  <p className="pl-5">
                    a) Dane identyfikacyjne: imię, nazwisko, data urodzenia,
                    numer PESEL
                    <br />
                    b) Dane kontaktowe: adres zakładu karnego
                    <br />
                    c) Dane profilowe: wiek, zainteresowania, hobby, plany na
                    przyszłość
                    <br />
                    d) Informacje o statusie w programie
                  </p>
                  <p className="font-medium mt-2">B. Dane partnerów:</p>
                  <p className="pl-5">
                    a) Dane identyfikacyjne: imię, nazwisko, data urodzenia,
                    numer PESEL
                    <br />
                    b) Dane kontaktowe: adres e-mail, numer telefonu, adres
                    korespondencyjny
                    <br />
                    c) Dane profilowe: wiek, zainteresowania, motywacja do
                    udziału w programie
                    <br />
                    d) Informacje o statusie w programie
                  </p>
                  <p>
                    2.2. Dodatkowo możemy przetwarzać dane zawarte w
                    korespondencji między uczestnikami programu oraz informacje
                    techniczne związane z korzystaniem z platformy (np. adres
                    IP, informacje o urządzeniu).
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  3. Cele i podstawy prawne przetwarzania danych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    3.1. Dane osobowe uczestników programu
                    &quot;Więźniarki&quot; przetwarzamy w następujących celach:
                  </p>
                  <p className="pl-5">
                    a) Umożliwienie udziału w programie reintegracji społecznej
                    i realizacja jego celów – podstawa prawna: art. 6 ust. 1
                    lit. e) RODO (wykonanie zadania realizowanego w interesie
                    publicznym) oraz art. 6 ust. 1 lit. a) RODO (zgoda osoby,
                    której dane dotyczą)
                    <br />
                    b) Weryfikacja uczestników programu – podstawa prawna: art.
                    6 ust. 1 lit. e) RODO oraz art. 6 ust. 1 lit. f) RODO
                    (prawnie uzasadniony interes Administratora polegający na
                    zapewnieniu bezpieczeństwa uczestników)
                    <br />
                    c) Komunikacja między uczestnikami – podstawa prawna: art. 6
                    ust. 1 lit. a) RODO
                    <br />
                    d) Zapewnienie bezpieczeństwa i przeciwdziałanie nadużyciom
                    – podstawa prawna: art. 6 ust. 1 lit. f) RODO
                    <br />
                    e) Rozpatrywanie reklamacji i wniosków – podstawa prawna:
                    art. 6 ust. 1 lit. c) RODO (wypełnienie obowiązku prawnego)
                    oraz art. 6 ust. 1 lit. f) RODO
                    <br />
                    f) Cele archiwalne i statystyczne – podstawa prawna: art. 6
                    ust. 1 lit. f) RODO
                  </p>
                  <p>
                    3.2. W przypadku przetwarzania szczególnych kategorii danych
                    osobowych, podstawą prawną jest art. 9 ust. 2 lit. a) RODO
                    (wyraźna zgoda) lub art. 9 ust. 2 lit. g) RODO (ważny
                    interes publiczny).
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  4. Okres przechowywania danych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    4.1. Dane osobowe uczestników programu będą przechowywane
                    przez następujące okresy:
                  </p>
                  <p className="pl-5">
                    a) Dane związane z aktywnym udziałem w programie – przez
                    czas uczestnictwa w programie
                    <br />
                    b) Dane zawarte w korespondencji – przez okres niezbędny do
                    realizacji celów programu, nie dłużej niż 2 lata od
                    zakończenia komunikacji
                    <br />
                    c) Dane przetwarzane na podstawie zgody – do czasu wycofania
                    zgody
                    <br />
                    d) Dane przetwarzane w celu rozpatrywania reklamacji i
                    wniosków – przez okres 5 lat od złożenia reklamacji/wniosku
                    <br />
                    e) Dane przetwarzane w celach statystycznych i archiwalnych
                    – przez okres 10 lat od zakończenia uczestnictwa w programie
                    (w formie zanonimizowanej)
                  </p>
                  <p>
                    4.2. Po upływie okresów przechowywania, dane zostaną trwale
                    usunięte lub zanonimizowane.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  5. Odbiorcy danych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    5.1. Dostęp do danych osobowych uczestników programu mogą
                    mieć:
                  </p>
                  <p className="pl-5">
                    a) Upoważnieni pracownicy i współpracownicy Administratora
                    <br />
                    b) Pracownicy zakładów karnych zaangażowani w realizację
                    programu
                    <br />
                    c) Dostawcy usług technicznych i organizacyjnych dla
                    Administratora (np. dostawcy usług IT, hostingowych, firmy
                    zapewniające wsparcie techniczne platformy)
                    <br />
                    d) Podmioty uprawnione do otrzymania danych na podstawie
                    przepisów prawa (np. sądy, organy ścigania)
                  </p>
                  <p>
                    5.2. Administrator nie przekazuje danych osobowych
                    uczestników programu do państw trzecich (poza Europejski
                    Obszar Gospodarczy) ani organizacji międzynarodowych.
                  </p>
                  <p>
                    5.3. Administrator nie udostępnia danych osobowych
                    uczestników programu podmiotom komercyjnym w celach
                    marketingowych.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  6. Prawa związane z przetwarzaniem danych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    6.1. Każdemu uczestnikowi programu przysługują następujące
                    prawa związane z przetwarzaniem danych osobowych:
                  </p>
                  <p className="pl-5">
                    a) Prawo dostępu do swoich danych oraz otrzymania ich kopii
                    <br />
                    b) Prawo do sprostowania (poprawiania) swoich danych
                    <br />
                    c) Prawo do usunięcia danych (w określonych sytuacjach)
                    <br />
                    d) Prawo do ograniczenia przetwarzania danych
                    <br />
                    e) Prawo do przenoszenia danych (w określonych sytuacjach)
                    <br />
                    f) Prawo wniesienia sprzeciwu wobec przetwarzania danych
                    <br />
                    g) Prawo do cofnięcia zgody na przetwarzanie danych w
                    dowolnym momencie (bez wpływu na zgodność z prawem
                    przetwarzania dokonanego przed cofnięciem zgody)
                    <br />
                    h) Prawo wniesienia skargi do organu nadzorczego
                  </p>
                  <p>
                    6.2. W celu skorzystania z powyższych praw, należy
                    skontaktować się z Administratorem lub Inspektorem Ochrony
                    Danych, korzystając z danych kontaktowych wskazanych w pkt
                    1.
                  </p>
                  <p>
                    6.3. Uczestnik ma prawo wniesienia skargi do Prezesa Urzędu
                    Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa),
                    gdy uzna, że przetwarzanie jego danych osobowych narusza
                    przepisy RODO.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  7. Bezpieczeństwo danych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    7.1. Administrator stosuje odpowiednie środki techniczne i
                    organizacyjne w celu zapewnienia bezpieczeństwa
                    przetwarzanych danych osobowych, w tym:
                  </p>
                  <p className="pl-5">
                    a) Szyfrowanie danych
                    <br />
                    b) Regularną ocenę i uaktualnianie środków bezpieczeństwa
                    <br />
                    c) Ograniczenie dostępu do danych osobowych
                    <br />
                    d) Szkolenia personelu w zakresie ochrony danych
                    <br />
                    e) Tworzenie kopii zapasowych
                    <br />
                    f) Procedury reagowania na incydenty związane z
                    bezpieczeństwem danych
                  </p>
                  <p>
                    7.2. Administrator regularnie przeprowadza ocenę skutków dla
                    ochrony danych (DPIA) w odniesieniu do operacji
                    przetwarzania, które mogą powodować wysokie ryzyko
                    naruszenia praw i wolności osób fizycznych.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  8. Informacja o profilowaniu
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    8.1. Administrator nie podejmuje wobec uczestników programu
                    zautomatyzowanych decyzji, w tym decyzji będących wynikiem
                    profilowania.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  9. Pliki cookies i podobne technologie
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    9.1. Platforma programu &quot;Więźniarki&quot; wykorzystuje
                    pliki cookies i podobne technologie w celu zapewnienia
                    prawidłowego działania, poprawy funkcjonalności oraz w
                    celach analitycznych.
                  </p>
                  <p>
                    9.2. Szczegółowe informacje dotyczące wykorzystania plików
                    cookies zawarte są w Polityce cookies dostępnej na
                    platformie.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  10. Zmiany Polityki Prywatności
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    10.1. Administrator zastrzega sobie prawo do wprowadzania
                    zmian w niniejszej Polityce Prywatności. Zmiany będą
                    publikowane na platformie z odpowiednim wyprzedzeniem.
                  </p>
                  <p>
                    10.2. Data ostatniej aktualizacji Polityki Prywatności:
                    01.01.2023 r.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  11. Kontakt
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    11.1. W przypadku jakichkolwiek pytań, uwag lub wątpliwości
                    związanych z przetwarzaniem danych osobowych lub niniejszą
                    Polityką Prywatności, prosimy o kontakt:
                  </p>
                  <p className="pl-5">
                    E-mail: dane.osobowe@wiezniarki.gov.pl
                    <br />
                    Telefon: +48 22 123 45 67
                    <br />
                    Adres: ul. Example 123, 00-000 Warszawa
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* CTA na dole strony */}
          <div className="mt-12 mb-16 bg-accent rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-bold text-gray-600 mb-2">
              Masz pytania dotyczące ochrony Twoich danych?
            </h3>
            <p className="text-gray-600 mb-4">
              Skontaktuj się z naszym Inspektorem Ochrony Danych lub zespołem
              wsparcia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-primary-dark transition shadow-sm"
                style={{
                  backgroundColor: "#1e50a0",
                  color: "white",
                }}
              >
                Skontaktuj się z nami
              </Link>
              <Link
                href="/faq"
                className="inline-block bg-white text-primary font-semibold py-2 px-6 rounded hover:bg-gray-50 transition shadow-sm"
                style={{
                  backgroundColor: "white",
                  color: "#1e50a0",
                  border: "1px solid #1e50a0",
                }}
              >
                Najczęściej zadawane pytania
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
