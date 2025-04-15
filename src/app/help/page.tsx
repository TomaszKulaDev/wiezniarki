"use client";

import React, { useState } from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";

export default function Help() {
  // Stan do kontrolowania otwartych/zamkniętych sekcji
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (sectionId: number) => {
    if (openSection === sectionId) {
      setOpenSection(null);
    } else {
      setOpenSection(sectionId);
    }
  };

  // Kategorie pomocy
  const helpCategories = [
    {
      id: 1,
      title: "Pierwsze kroki",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ),
      questions: [
        {
          question: "Jak zarejestrować się w programie?",
          answer:
            "Aby zarejestrować się w programie 'Więźniarki', odwiedź stronę 'Rejestracja' i wypełnij formularz z danymi osobowymi. Po wypełnieniu formularza, otrzymasz email z linkiem aktywacyjnym. Kliknij w link, aby potwierdzić swój adres email. Po aktywacji konta, przejdziesz proces weryfikacji tożsamości, który może potrwać do 48 godzin roboczych.",
        },
        {
          question: "Jakie dokumenty są potrzebne do weryfikacji?",
          answer:
            "Do weryfikacji tożsamości potrzebujesz aktualnego dokumentu tożsamości (dowód osobisty lub paszport) oraz dodatkowego dokumentu potwierdzającego adres zamieszkania (np. rachunek za media z ostatnich 3 miesięcy). Dokumenty należy zeskanować lub sfotografować w dobrej jakości i załączyć podczas procesu rejestracji.",
        },
        {
          question: "Jak długo trwa weryfikacja konta?",
          answer:
            "Weryfikacja konta trwa zazwyczaj od 24 do 48 godzin roboczych. W przypadku wątpliwości lub potrzeby dostarczenia dodatkowych dokumentów, nasz zespół skontaktuje się z Tobą mailowo.",
        },
      ],
    },
    {
      id: 2,
      title: "Korzystanie z platformy",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      questions: [
        {
          question: "Jak przeglądać profile osadzonych kobiet?",
          answer:
            "Po zalogowaniu, przejdź do sekcji 'Profile' z menu głównego. Możesz filtrować profile według zainteresowań, wieku, lokalizacji jednostki penitencjarnej oraz znajomości języków. Kliknij na wybrany profil, aby zobaczyć szczegółowe informacje i opcję nawiązania kontaktu.",
        },
        {
          question: "Jak wysłać pierwszą wiadomość?",
          answer:
            "Na stronie profilu osoby, z którą chcesz nawiązać kontakt, kliknij przycisk 'Nawiąż kontakt'. Napisz wiadomość wprowadzającą, w której przedstawisz się i wyjaśnisz, dlaczego chcesz nawiązać kontakt. Pamiętaj, że pierwsza wiadomość powinna być uprzejma i zawierać informacje o Twoich zainteresowaniach oraz motywacji.",
        },
        {
          question: "Ile wiadomości mogę wysłać?",
          answer:
            "Nie ma ograniczeń co do liczby wiadomości, które możesz wysłać po nawiązaniu korespondencji. Jednak ze względów bezpieczeństwa i moderacji, możesz nawiązać kontakt jednocześnie z maksymalnie 5 osobami.",
        },
      ],
    },
    {
      id: 3,
      title: "Bezpieczeństwo i prywatność",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      questions: [
        {
          question: "Czy moje dane są bezpieczne?",
          answer:
            "Tak, bezpieczeństwo danych jest naszym priorytetem. Stosujemy szyfrowanie end-to-end dla wszystkich przesyłanych informacji, a dane osobowe przechowujemy zgodnie z najwyższymi standardami bezpieczeństwa i wymogami RODO. Dostęp do danych osobowych mają wyłącznie uprawnieni pracownicy programu.",
        },
        {
          question: "Czy osadzone kobiety widzą moje dane kontaktowe?",
          answer:
            "Nie, Twoje dane kontaktowe (adres, telefon, email) nie są widoczne dla osadzonych kobiet. Komunikacja odbywa się wyłącznie przez platformę. Dopiero po ustaleniu obustronnej zgody i spełnieniu wymogów bezpieczeństwa, istnieje możliwość przekazania niektórych danych kontaktowych.",
        },
        {
          question: "Jak zgłosić niewłaściwe zachowanie?",
          answer:
            "W każdej wiadomości znajdziesz przycisk 'Zgłoś problem', który umożliwia natychmiastowe powiadomienie moderatorów o niewłaściwym zachowaniu. Możesz również skontaktować się z nami bezpośrednio przez formularz na stronie 'Kontakt' lub pod adresem bezpieczenstwo@wiezniarki.gov.pl.",
        },
      ],
    },
    {
      id: 4,
      title: "Problemy techniczne",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      questions: [
        {
          question: "Nie mogę się zalogować, co robić?",
          answer:
            "Jeśli masz problemy z logowaniem, upewnij się, że używasz prawidłowego adresu email i hasła. Możesz skorzystać z opcji 'Zapomniałem/am hasła' na stronie logowania. Jeśli nadal masz problemy, sprawdź połączenie z internetem i wyczyść pamięć podręczną przeglądarki. Jeśli problem persist, skontaktuj się z naszym zespołem pomocy technicznej pod adresem pomoc@wiezniarki.gov.pl.",
        },
        {
          question: "Wiadomości nie wysyłają się lub docierają z opóźnieniem",
          answer:
            "Wszystkie wiadomości przechodzą przez proces moderacji, co może powodować opóźnienie w dostarczeniu (zazwyczaj 1-3 dni robocze). Jeśli wiadomość nie została dostarczona po 3 dniach roboczych, sprawdź sekcję 'Wysłane' w swoim profilu, aby sprawdzić jej status. Jeśli status wskazuje na błąd, spróbuj wysłać wiadomość ponownie lub skontaktuj się z nami.",
        },
        {
          question: "Strona nie wyświetla się poprawnie, co mogę zrobić?",
          answer:
            "Upewnij się, że korzystasz z aktualnej wersji przeglądarki (Chrome, Firefox, Safari lub Edge). Wyczyść cache i pliki cookie przeglądarki. Jeśli problem wystepuje na urządzeniu mobilnym, spróbuj otworzyć stronę na komputerze. Jeśli problemy persist, wyślij nam zrzut ekranu błędu na adres pomoc@wiezniarki.gov.pl wraz z informacją o używanej przeglądarce i systemie operacyjnym.",
        },
      ],
    },
    {
      id: 5,
      title: "Informacje dla rodzin osadzonych",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
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
      ),
      questions: [
        {
          question:
            "Jak rodzina może wspierać osadzoną uczestniczącą w programie?",
          answer:
            "Rodziny osadzonych odgrywają kluczową rolę w procesie resocjalizacji. Najważniejsze formy wsparcia to: utrzymywanie regularnego kontaktu przez tradycyjne kanały (widzenia, listy, rozmowy telefoniczne), okazywanie zrozumienia dla udziału w programie, wspieranie w planowaniu przyszłości po odbyciu kary. W razie wątpliwości, rodzina może skontaktować się z koordynatorem programu w jednostce penitencjarnej.",
        },
        {
          question: "Czy program 'Więźniarki' zastępuje kontakty z rodziną?",
          answer:
            "Nie, program 'Więźniarki' nie zastępuje, lecz uzupełnia kontakty rodzinne. Jego celem jest poszerzenie sieci wsparcia społecznego osadzonych kobiet o nowe relacje, które mogą pomóc w resocjalizacji i reintegracji. Kontakty rodzinne nadal pozostają priorytetowe i są zachęcane przez program.",
        },
        {
          question: "Czy rodzina może uczestniczyć w programie?",
          answer:
            "Tak, członkowie rodziny mogą również rejestrować się jako użytkownicy programu 'Więźniarki'. Może to być szczególnie pomocne w przypadku rodzin, które mieszkają daleko od jednostki penitencjarnej i mają ograniczone możliwości regularnych widzeń. Należy zaznaczyć, że w takim przypadku również obowiązuje standardowy proces weryfikacji.",
        },
      ],
    },
  ];

  return (
    <MainLayout>
      <Breadcrumbs pageName="Pomoc" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Centrum pomocy
          </h1>
          <p className="text-gray-600">
            Odpowiedzi na najczęściej zadawane pytania i wsparcie użytkowników
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
                Jak możemy pomóc?
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-2/3">
                  <p className="text-gray-700 mb-4">
                    Witamy w centrum pomocy programu &quot;Więźniarki&quot;.
                    Znajdziesz tu odpowiedzi na najczęściej zadawane pytania
                    dotyczące korzystania z platformy, bezpieczeństwa,
                    rejestracji i innych aspektów programu.
                  </p>
                  <p className="text-gray-700">
                    Jeśli nie znajdziesz odpowiedzi na swoje pytanie, skorzystaj
                    z formularza kontaktowego lub skontaktuj się bezpośrednio z
                    naszym zespołem wsparcia. Jesteśmy tu, aby pomóc Ci w
                    efektywnym korzystaniu z programu.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?q=80&w=1970&auto=format&fit=crop"
                      alt="Centrum pomocy i wsparcia"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Formularz wyszukiwania - poprawiony przycisk */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-grow w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Wyszukaj pytanie lub temat..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <button
                    className="w-full md:w-auto bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition shadow-sm"
                    style={{
                      backgroundColor: "#1e50a0",
                      color: "white",
                    }}
                  >
                    Szukaj
                  </button>
                </div>
              </div>
            </div>

            {/* Kategorie pomocy */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {helpCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => toggleSection(category.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-primary/10 rounded-full">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pytania i odpowiedzi */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {helpCategories.map((category) => (
                <div
                  key={category.id}
                  className={`mb-6 last:mb-0 ${
                    openSection === category.id ? "block" : "hidden"
                  }`}
                >
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                    {category.icon}
                    <span className="ml-2">{category.title}</span>
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-800">
                          {item.question}
                        </div>
                        <div className="px-4 py-3 text-gray-700">
                          {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Gdy żadna sekcja nie jest wybrana */}
              {openSection === null && (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Wybierz kategorię pomocy
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Kliknij w jedną z powyższych kategorii, aby zobaczyć
                    odpowiedzi na pytania z tego obszaru.
                  </p>
                </div>
              )}
            </div>

            {/* Dodatkowe wsparcie - poprawione ikony */}
            <div className="bg-accent rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Potrzebujesz dodatkowej pomocy?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-gray-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Kontakt email
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Wyślij wiadomość do naszego zespołu wsparcia.
                      </p>
                      <a
                        href="mailto:pomoc@wiezniarki.gov.pl"
                        className="text-primary font-medium hover:underline"
                      >
                        pomoc@wiezniarki.gov.pl
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-gray-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
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
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Baza wiedzy
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Przejrzyj naszą bazę wiedzy z materiałami pomocniczymi.
                      </p>
                      <Link
                        href="/faq"
                        className="text-primary font-medium hover:underline"
                      >
                        Przejdź do bazy wiedzy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl font-bold mb-4">Skontaktuj się z nami</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Jeśli nie znalazłeś/aś odpowiedzi na swoje pytanie, skorzystaj z
                formularza kontaktowego. Nasz zespół odpowie najszybciej jak to
                możliwe.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded hover:bg-primary-dark transition shadow-md"
                style={{
                  color: "white",
                  backgroundColor: "#1e50a0",
                  border: "2px solid #1e50a0",
                }}
              >
                Formularz kontaktowy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
