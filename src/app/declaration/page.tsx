import React from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";

export default function AccessibilityDeclaration() {
  return (
    <MainLayout>
      <Breadcrumbs pageName="Deklaracja dostępności" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Deklaracja dostępności
          </h1>
          <p className="text-gray-600">
            Informacje o dostępności cyfrowej platformy &quot;Więźniarki&quot;
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Treść deklaracji dostępności */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4">
                    Wstęp i informacje ogólne
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      Ministerstwo Sprawiedliwości zobowiązuje się zapewnić
                      dostępność swojej strony internetowej zgodnie z przepisami
                      ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej
                      stron internetowych i aplikacji mobilnych podmiotów
                      publicznych. Oświadczenie w sprawie dostępności ma
                      zastosowanie do platformy &quot;Więźniarki&quot; dostępnej
                      pod adresem wiezniarki.gov.pl.
                    </p>
                    <p>Data publikacji strony internetowej: 01.01.2023</p>
                    <p>Data ostatniej dużej aktualizacji: 01.06.2023</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Status pod względem zgodności z ustawą
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      Platforma &quot;Więźniarki&quot; jest{" "}
                      <strong>częściowo zgodna</strong> z ustawą z dnia 4
                      kwietnia 2019 r. o dostępności cyfrowej stron
                      internetowych i aplikacji mobilnych podmiotów publicznych
                      z powodu niezgodności lub wyłączeń wymienionych poniżej.
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Niektóre grafiki nie posiadają odpowiednich opisów
                        alternatywnych
                      </li>
                      <li>
                        Część dokumentów PDF nie jest w pełni dostępna cyfrowo
                      </li>
                      <li>
                        Niektóre treści multimedialne nie posiadają napisów dla
                        osób niesłyszących
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Przygotowanie deklaracji w sprawie dostępności
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>Niniejsze oświadczenie sporządzono dnia: 01.01.2023</p>
                    <p>
                      Deklarację sporządzono na podstawie samooceny
                      przeprowadzonej przez Ministerstwo Sprawiedliwości oraz
                      audytu przeprowadzonego przez zewnętrznego audytora
                      specjalizującego się w dostępności cyfrowej.
                    </p>
                    <p>
                      Deklaracja została ostatnio poddana przeglądowi dnia:
                      01.06.2023
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Informacje zwrotne i dane kontaktowe
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      W przypadku problemów z dostępnością strony internetowej
                      prosimy o kontakt z Koordynatorem Dostępności Cyfrowej.
                      Osobą odpowiedzialną jest Jan Kowalski, adres email:
                      dostepnosc@wiezniarki.gov.pl, numer telefonu: +48 22 123
                      45 67. Tą samą drogą można składać wnioski o udostępnienie
                      informacji niedostępnej oraz składać skargi na brak
                      zapewnienia dostępności.
                    </p>
                    <p>
                      Każdy ma prawo do wystąpienia z żądaniem zapewnienia
                      dostępności cyfrowej strony internetowej, aplikacji
                      mobilnej lub jakiegoś ich elementu. Można także zażądać
                      udostępnienia informacji za pomocą alternatywnego sposobu
                      dostępu, na przykład przez odczytanie niedostępnego
                      cyfrowo dokumentu, opisanie zawartości filmu bez
                      audiodeskrypcji itp. Żądanie powinno zawierać dane osoby
                      zgłaszającej żądanie, wskazanie, o którą stronę
                      internetową lub aplikację mobilną chodzi oraz sposób
                      kontaktu. Jeżeli osoba żądająca zgłasza potrzebę
                      otrzymania informacji za pomocą alternatywnego sposobu
                      dostępu, powinna także określić dogodny dla niej sposób
                      przedstawienia tej informacji.
                    </p>
                    <p>
                      Ministerstwo Sprawiedliwości powinno zrealizować żądanie
                      niezwłocznie, nie później niż w ciągu 7 dni od dnia
                      wystąpienia z żądaniem. Jeżeli dotrzymanie tego terminu
                      nie jest możliwe, podmiot publiczny niezwłocznie informuje
                      o tym wnoszącego żądanie, kiedy realizacja żądania będzie
                      możliwa, przy czym termin ten nie może być dłuższy niż 2
                      miesiące od dnia wystąpienia z żądaniem. Jeżeli
                      zapewnienie dostępności cyfrowej nie jest możliwe, podmiot
                      publiczny może zaproponować alternatywny sposób dostępu do
                      informacji.
                    </p>
                    <p>
                      W przypadku, gdy podmiot publiczny odmówi realizacji
                      żądania zapewnienia dostępności lub alternatywnego sposobu
                      dostępu do informacji, wnoszący żądanie możne złożyć
                      skargę w sprawie zapewniana dostępności cyfrowej strony
                      internetowej, aplikacji mobilnej lub elementu strony
                      internetowej, lub aplikacji mobilnej.
                    </p>
                    <p>
                      Po wyczerpaniu wskazanej wyżej procedury można także
                      złożyć wniosek do
                      <a
                        href="https://www.rpo.gov.pl/"
                        className="text-primary hover:underline ml-1"
                      >
                        Rzecznika Praw Obywatelskich
                      </a>
                      .
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Dostępność architektoniczna
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      Siedziba Biura Programu &quot;Więźniarki&quot;, ul.
                      Przykładowa 123, 00-001 Warszawa
                    </p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>
                        Do budynku prowadzi główne wejście znajdujące się od ul.
                        Przykładowej. Wejście jest dostępne dla osób na wózkach
                        (podjazd). Dodatkowo w budynku znajduje się winda
                        przystosowana dla osób z niepełnosprawnościami.
                      </li>
                      <li>
                        Dla osób na wózkach dostępne są korytarze, toalety oraz
                        wszystkie pomieszczenia biurowe na parterze.
                      </li>
                      <li>
                        Przed budynkiem wyznaczono 2 miejsca parkingowe dla osób
                        niepełnosprawnych.
                      </li>
                      <li>
                        Do budynku i wszystkich jego pomieszczeń można wejść z
                        psem asystującym i psem przewodnikiem.
                      </li>
                      <li>
                        W budynku nie ma pętli indukcyjnych. Dostępny jest
                        tłumacz polskiego języka migowego (PJM) po uprzednim
                        umówieniu spotkania.
                      </li>
                      <li>
                        W budynku nie ma oznaczeń w alfabecie Braille&apos;a ani
                        oznaczeń kontrastowych lub w druku powiększonym dla osób
                        niewidomych i słabowidzących.
                      </li>
                    </ol>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Aplikacje mobilne
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      Program &quot;Więźniarki&quot; nie posiada obecnie
                      dedykowanej aplikacji mobilnej.
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Dodatkowe informacje */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                Wsparcie w zakresie dostępności
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Jeśli napotkasz jakiekolwiek problemy z dostępnością naszej
                platformy lub potrzebujesz informacji w alternatywnej formie,
                skontaktuj się z naszym Koordynatorem Dostępności Cyfrowej.
                Dokładamy wszelkich starań, aby nasza platforma była dostępna
                dla wszystkich użytkowników.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-primary hover:underline"
              >
                <span>Skontaktuj się w sprawie dostępności</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
