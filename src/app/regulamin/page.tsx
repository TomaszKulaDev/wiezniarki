"use client";

import MainLayout from "../MainLayout";
import Link from "next/link";

export default function Regulamin() {
  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-1">
            Regulamin
          </h1>
          <p className="text-gray-600">
            Zasady korzystania z programu &quot;Więźniarki&quot;
          </p>
        </div>
      </section>

      {/* Grafika ilustracyjna */}
      <div className="w-full overflow-hidden bg-gray-50 border-b border-gray-200 py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center rounded-lg bg-white shadow-sm overflow-hidden p-6 md:p-8 mb-8 mt-8">
            <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="rounded-full bg-blue-50 p-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left md:pl-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                Regulamin Programu
              </h2>
              <p className="text-gray-600 mb-4">
                Poniżej znajdziesz pełen zbiór zasad uczestnictwa w programie
                &quot;Więźniarki&quot;. Prosimy o dokładne zapoznanie się z
                regulaminem przed przystąpieniem do programu.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-blue-100 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Oficjalny dokument
                </span>
                <span className="bg-blue-100 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Zasady
                </span>
                <span className="bg-blue-100 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Obowiązki
                </span>
                <span className="bg-blue-100 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  Prawa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Główna treść */}
      <div className="container mx-auto px-4 py-5">
        <div className="max-w-4xl mx-auto">
          {/* Treść regulaminu */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  §1. Postanowienia ogólne
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    1.1. Program &quot;Więźniarki&quot; (zwany dalej
                    &quot;Programem&quot;) jest oficjalną inicjatywą mającą na
                    celu wsparcie procesu resocjalizacji kobiet osadzonych w
                    zakładach karnych poprzez budowanie zdrowych relacji
                    społecznych.
                  </p>
                  <p>
                    1.2. Organizatorem Programu jest Ministerstwo
                    Sprawiedliwości we współpracy z Centralnym Zarządem Służby
                    Więziennej (zwani dalej &quot;Organizatorem&quot;).
                  </p>
                  <p>
                    1.3. Niniejszy Regulamin określa zasady uczestnictwa w
                    Programie, prawa i obowiązki uczestników oraz zasady
                    korzystania z platformy internetowej.
                  </p>
                  <p>
                    1.4. Przystąpienie do Programu jest dobrowolne i oznacza
                    akceptację niniejszego Regulaminu.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  §2. Definicje
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    2.1. <strong>Program</strong> - oficjalna inicjatywa
                    &quot;Więźniarki&quot; mająca na celu wsparcie procesu
                    resocjalizacji kobiet osadzonych w zakładach karnych.
                  </p>
                  <p>
                    2.2. <strong>Platforma</strong> - serwis internetowy
                    dostępny pod adresem www.wiezniarki.gov.pl, umożliwiający
                    komunikację między uczestnikami Programu.
                  </p>
                  <p>
                    2.3. <strong>Uczestnik</strong> - osoba zarejestrowana w
                    Programie, która zaakceptowała Regulamin i przeszła proces
                    weryfikacji.
                  </p>
                  <p>
                    2.4. <strong>Osoba osadzona</strong> - kobieta odbywająca
                    karę pozbawienia wolności w zakładzie karnym, uczestnicząca
                    w Programie.
                  </p>
                  <p>
                    2.5. <strong>Partner</strong> - osoba z zewnątrz,
                    uczestnicząca w Programie w celu nawiązania relacji z osobą
                    osadzoną.
                  </p>
                  <p>
                    2.6. <strong>Moderator</strong> - osoba wyznaczona przez
                    Organizatora do nadzorowania komunikacji i przestrzegania
                    Regulaminu na Platformie.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  §3. Warunki uczestnictwa
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>3.1. Uczestnikami Programu mogą być:</p>
                  <p className="pl-5">
                    a) Kobiety przebywające w zakładach karnych, które:
                  </p>
                  <p className="pl-10">
                    - zostały pozytywnie zweryfikowane przez pracowników zakładu
                    karnego,
                    <br />
                    - wyraziły dobrowolną chęć uczestnictwa w Programie,
                    <br />- zaakceptowały Regulamin.
                  </p>
                  <p className="pl-5">
                    b) Osoby z zewnątrz (Partnerzy), które:
                  </p>
                  <p className="pl-10">
                    - ukończyły 18 lat,
                    <br />
                    - pomyślnie przeszły proces weryfikacji,
                    <br />
                    - zaakceptowały Regulamin,
                    <br />- nie były karane za przestępstwa umyślne.
                  </p>
                  <p>
                    3.2. Rejestracja na Platformie wymaga podania prawdziwych
                    danych osobowych, które podlegają weryfikacji przez
                    Organizatora.
                  </p>
                  <p>
                    3.3. Organizator zastrzega sobie prawo do odmowy rejestracji
                    lub usunięcia Uczestnika z Programu bez podania przyczyny.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  §4. Zasady korzystania z Platformy
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>4.1. Uczestnik zobowiązuje się do:</p>
                  <p className="pl-5">
                    a) przestrzegania niniejszego Regulaminu,
                    <br />
                    b) przekazywania prawdziwych informacji,
                    <br />
                    c) zachowania kultury wypowiedzi i szacunku wobec innych
                    Uczestników,
                    <br />
                    d) nieudostępniania swojego konta osobom trzecim,
                    <br />
                    e) niezwłocznego informowania Organizatora o naruszeniach
                    Regulaminu.
                  </p>
                  <p>4.2. Zabrania się publikowania treści:</p>
                  <p className="pl-5">
                    a) naruszających prawo,
                    <br />
                    b) nawołujących do nienawiści lub dyskryminacji,
                    <br />
                    c) obscenicznych lub wulgarnych,
                    <br />
                    d) reklamowych lub promocyjnych,
                    <br />
                    e) zawierających dane kontaktowe poza systemem Platformy.
                  </p>
                  <p>
                    4.3. Wszystkie pierwsze wiadomości między Uczestnikami
                    podlegają moderacji w celu zapewnienia bezpieczeństwa
                    komunikacji.
                  </p>
                  <p>
                    4.4. Organizator zastrzega sobie prawo do monitorowania
                    komunikacji w celu zapewnienia przestrzegania Regulaminu.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  §5. Prawa i obowiązki Organizatora
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>5.1. Organizator zobowiązuje się do:</p>
                  <p className="pl-5">
                    a) zapewnienia funkcjonowania Platformy,
                    <br />
                    b) weryfikacji Uczestników w celu zapewnienia
                    bezpieczeństwa,
                    <br />
                    c) moderowania treści zgodnie z Regulaminem,
                    <br />
                    d) ochrony danych osobowych zgodnie z obowiązującymi
                    przepisami.
                  </p>
                  <p>5.2. Organizator zastrzega sobie prawo do:</p>
                  <p className="pl-5">
                    a) modyfikacji Regulaminu (o zmianach Uczestnicy będą
                    informowani),
                    <br />
                    b) czasowego zawieszenia działania Platformy w celach
                    konserwacyjnych,
                    <br />
                    c) usunięcia treści naruszających Regulamin,
                    <br />
                    d) zawieszenia lub usunięcia konta Uczestnika w przypadku
                    naruszenia Regulaminu.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  §6. Ochrona danych osobowych
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    6.1. Administratorem danych osobowych jest Organizator
                    Programu.
                  </p>
                  <p>
                    6.2. Dane osobowe przetwarzane są zgodnie z Rozporządzeniem
                    Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) oraz
                    krajowymi przepisami o ochronie danych osobowych.
                  </p>
                  <p>
                    6.3. Szczegółowe informacje dotyczące przetwarzania danych
                    osobowych znajdują się w{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Polityce Prywatności
                    </Link>{" "}
                    dostępnej na Platformie.
                  </p>
                  <p>
                    6.4. Podanie danych osobowych jest dobrowolne, ale niezbędne
                    do uczestnictwa w Programie.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  §7. Postanowienia końcowe
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>7.1. Regulamin wchodzi w życie z dniem 01.01.2023 r.</p>
                  <p>
                    7.2. W sprawach nieuregulowanych niniejszym Regulaminem mają
                    zastosowanie przepisy prawa polskiego.
                  </p>
                  <p>
                    7.3. Wszelkie spory wynikające z uczestnictwa w Programie
                    rozstrzygane będą przez sąd właściwy dla siedziby
                    Organizatora.
                  </p>
                  <p>
                    7.4. Organizator zastrzega sobie prawo do zakończenia
                    Programu w dowolnym momencie, o czym Uczestnicy zostaną
                    poinformowani z odpowiednim wyprzedzeniem.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* CTA na dole strony */}
          <div className="mt-12 mb-16 bg-accent rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Masz pytania dotyczące regulaminu?
            </h3>
            <p className="text-gray-600 mb-4">
              Skontaktuj się z nami, a nasz zespół udzieli Ci szczegółowych
              informacji.
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
