"use client";

import React from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";

export default function Security() {
  // Sekcje bezpieczeństwa z ikonami
  const securityFeatures = [
    {
      id: "identity-verification",
      title: "Weryfikacja tożsamości",
      description:
        "Wszystkie osoby uczestniczące w programie przechodzą szczegółową weryfikację tożsamości, co eliminuje ryzyko podszywania się pod kogoś innego.",
      details:
        "Proces weryfikacji obejmuje sprawdzenie dokumentów tożsamości, potwierdzenie adresu zamieszkania oraz wywiad wstępny. Dodatkowo, dla uczestników z zewnątrz przeprowadzamy sprawdzenie przeszłości w zakresie dozwolonym prawem.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "message-moderation",
      title: "Moderacja korespondencji",
      description:
        "Wszystkie wiadomości wymieniane między uczestnikami programu są monitorowane przez zespół moderatorów w celu zapewnienia bezpieczeństwa.",
      details:
        "Moderacja ma na celu wychwycenie niepokojących treści, takich jak próby manipulacji, groźby czy wymiana wrażliwych danych. Moderatorzy są zobowiązani do zachowania poufności i intymności korespondencji przy jednoczesnym dbaniu o bezpieczeństwo wszystkich stron.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "data-protection",
      title: "Ochrona danych osobowych",
      description:
        "System zabezpieczeń gwarantuje poufność i integralność danych wszystkich uczestników programu zgodnie z obowiązującymi przepisami RODO.",
      details:
        "Dane przechowywane są w zabezpieczonych bazach danych z pełnym szyfrowaniem. Dostęp do danych osobowych mają wyłącznie uprawnieni pracownicy, posiadający odpowiednie certyfikaty bezpieczeństwa. Każdy uczestnik ma prawo wglądu w swoje dane oraz ich modyfikacji lub usunięcia.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      id: "prison-cooperation",
      title: "Współpraca z jednostkami penitencjarnymi",
      description:
        "Program działa w ścisłej współpracy z administracją zakładów karnych, co zapewnia zgodność z procedurami bezpieczeństwa.",
      details:
        "Każda jednostka penitencjarna wyznacza koordynatora programu, który odpowiada za przestrzeganie wewnętrznych procedur bezpieczeństwa. Koordynatorzy uczestniczą w regularnych szkoleniach i spotkaniach ewaluacyjnych, które pozwalają na ciągłe doskonalenie systemu bezpieczeństwa.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: "psych-support",
      title: "Wsparcie psychologiczne",
      description:
        "Uczestnicy programu mają dostęp do wsparcia psychologicznego, które pomaga w bezpiecznym budowaniu relacji społecznych.",
      details:
        "Zespół psychologów jest dostępny zarówno dla osadzonych kobiet, jak i dla osób z zewnątrz. Wsparcie obejmuje konsultacje indywidualne, materiały edukacyjne oraz interwencje kryzysowe. Psychologowie pomagają w zrozumieniu dynamiki relacji i radzeniu sobie z trudnymi emocjami.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "professional-team",
      title: "Profesjonalny zespół",
      description:
        "Nad bezpieczeństwem programu czuwa zespół specjalistów z różnych dziedzin, w tym eksperci ds. bezpieczeństwa, psychologowie i pracownicy socjalni.",
      details:
        "Wszyscy członkowie zespołu przechodzą rygorystyczny proces selekcji oraz regularne szkolenia z zakresu bezpieczeństwa i ochrony danych. Zespół podlega również zewnętrznym audytom i superwizjom, co gwarantuje najwyższe standardy pracy.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <MainLayout>
      <Breadcrumbs pageName="Bezpieczeństwo" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Bezpieczeństwo
          </h1>
          <p className="text-gray-600">
            Kompleksowy system bezpieczeństwa programu Więźniarki
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
                Bezpieczeństwo jako priorytet
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-2/3">
                  <p className="text-gray-700 mb-4">
                    Program &quot;Więźniarki&quot;, który ruszy w 2025 roku,
                    został zaprojektowany z myślą o maksymalnym bezpieczeństwie
                    wszystkich uczestników. Priorytetem jest ochrona zarówno
                    osadzonych kobiet, jak i osób z zewnątrz nawiązujących z
                    nimi kontakt.
                  </p>
                  <p className="text-gray-700">
                    Wielowarstwowy system bezpieczeństwa łączy w sobie
                    nowoczesne rozwiązania technologiczne, procedury
                    weryfikacyjne oraz stały nadzór wykwalifikowanego personelu.
                    Każdy aspekt programu został dokładnie przemyślany, aby
                    zminimalizować potencjalne ryzyka i zapewnić pozytywne
                    doświadczenia dla wszystkich stron.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1453873623425-04e3584e9f72?q=80&w=2070&auto=format&fit=crop"
                      alt="Symbol bezpieczeństwa i zaufania"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Główne aspekty bezpieczeństwa */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Elementy systemu bezpieczeństwa
              </h2>

              <div className="space-y-8">
                {securityFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/6 flex justify-center items-center">
                        {feature.icon}
                      </div>
                      <div className="md:w-5/6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 font-medium mb-3">
                          {feature.description}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {feature.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certyfikaty i standardy */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-4">
                Certyfikaty i zgodność ze standardami
              </h2>
              <p className="text-gray-700 mb-4">
                Program &quot;Więźniarki&quot; działa w zgodzie z najwyższymi
                standardami bezpieczeństwa i ochrony danych osobowych, co
                potwierdzają odpowiednie certyfikaty:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>
                  Zgodność z Rozporządzeniem o Ochronie Danych Osobowych (RODO)
                </li>
                <li>
                  Certyfikat ISO 27001 w zakresie bezpieczeństwa informacji
                </li>
                <li>
                  Akredytacja Ministerstwa Sprawiedliwości dla programów
                  resocjalizacyjnych
                </li>
                <li>
                  Zgodność z wytycznymi Służby Więziennej dotyczącymi kontaktu
                  osadzonych z osobami z zewnątrz
                </li>
              </ul>
            </div>

            {/* FAQ o bezpieczeństwie */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-5">
                Najczęściej zadawane pytania o bezpieczeństwo
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Czy moje dane będą widoczne dla wszystkich uczestników?
                  </h3>
                  <p className="text-gray-700">
                    Nie, Twoje dane osobowe są chronione. Inni uczestnicy widzą
                    tylko informacje, które zdecydujesz się udostępnić w swoim
                    profilu. Dane kontaktowe, takie jak adres zamieszkania czy
                    numer telefonu, nigdy nie są udostępniane bez Twojej
                    wyraźnej zgody.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Czy korespondencja jest czytana przez osoby trzecie?
                  </h3>
                  <p className="text-gray-700">
                    Korespondencja podlega moderacji pod kątem bezpieczeństwa,
                    ale moderatorzy są zobowiązani do zachowania poufności. Ich
                    zadaniem jest wyłącznie wykrywanie potencjalnie
                    niebezpiecznych treści, a nie ingerowanie w prywatne
                    rozmowy.
                  </p>
                </div>

                <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Co się stanie, jeśli poczuję się niekomfortowo w trakcie
                    korespondencji?
                  </h3>
                  <p className="text-gray-700">
                    W każdej chwili możesz zgłosić problem do moderatora lub
                    przerwać korespondencję bez podawania przyczyny. Zespół
                    wsparcia jest dostępny, aby pomóc w trudnych sytuacjach i
                    zapewnić komfort wszystkim uczestnikom programu.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-accent rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Pytania o bezpieczeństwo?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Jeśli masz dodatkowe pytania dotyczące bezpieczeństwa programu
                &quot;Więźniarki&quot;, skontaktuj się z naszym zespołem lub
                zapoznaj się z pełnym regulaminem.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-white text-primary font-semibold py-3 px-6 rounded hover:bg-gray-50 transition shadow-md border-2 border-primary"
                  style={{ color: "#1e50a0", backgroundColor: "white" }}
                >
                  Skontaktuj się z nami
                </Link>
                <Link
                  href="/regulamin"
                  className="bg-primary text-white font-semibold py-3 px-6 rounded hover:bg-primary-dark transition shadow-md"
                  style={{
                    color: "white",
                    backgroundColor: "#1e50a0",
                    border: "2px solid #1e50a0",
                  }}
                >
                  Zapoznaj się z regulaminem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
