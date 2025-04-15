import React from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";

export default function Reports() {
  const reports = [
    {
      id: "methodology",
      title: "Metodologia programu Więźniarki",
      date: "15 stycznia 2025",
      description:
        "Opis metod i praktyk planowanych do zastosowania w programie resocjalizacji.",
      type: "pdf",
      size: "2.5 MB",
    },
    {
      id: "projected-impact",
      title: "Prognozowany wpływ programu na resocjalizację",
      date: "10 lutego 2025",
      description:
        "Analiza przewidywanych efektów programu na podstawie badań porównawczych.",
      type: "pdf",
      size: "3.1 MB",
    },
    {
      id: "implementation-plan",
      title: "Plan wdrożenia programu (2025-2026)",
      date: "5 marca 2025",
      description:
        "Szczegółowy harmonogram wdrażania poszczególnych elementów programu.",
      type: "pdf",
      size: "1.8 MB",
    },
    {
      id: "quarterly-q22025",
      title: "Raport kwartalny (Q2 2025)",
      date: "15 lipca 2025",
      description: "Podsumowanie pierwszych miesięcy funkcjonowania programu.",
      type: "pdf",
      size: "1.5 MB",
    },
    {
      id: "stats2025",
      title: "Wstępne statystyki programu (2025)",
      date: "20 sierpnia 2025",
      description:
        "Zestawienie początkowych danych statystycznych dotyczących uczestnictwa.",
      type: "xlsx",
      size: "780 KB",
    },
    {
      id: "pilot-results",
      title: "Wyniki programu pilotażowego",
      date: "30 września 2025",
      description:
        "Analiza rezultatów pilotażowego wdrożenia programu w wybranych jednostkach.",
      type: "pdf",
      size: "2.7 MB",
    },
  ];

  const studies = [
    {
      title:
        "Wpływ kontaktów społecznych na resocjalizację osadzonych kobiet - badanie prospektywne",
      author: "dr hab. Anna Kowalska, Uniwersytet Warszawski",
      year: "2024",
      journal: "Journal of Prison Studies",
      link: "#",
    },
    {
      title:
        "Efektywność programów resocjalizacyjnych opartych na budowaniu relacji społecznych",
      author: "prof. Jan Nowak, Uniwersytet Jagielloński",
      year: "2023",
      journal: "Przegląd Penitencjarny",
      link: "#",
    },
    {
      title:
        "Analiza porównawcza programów reintegracji społecznej w krajach UE",
      author: "dr Marta Wiśniewska, Instytut Wymiaru Sprawiedliwości",
      year: "2024",
      journal: "European Journal of Criminology",
      link: "#",
    },
  ];

  return (
    <MainLayout>
      <Breadcrumbs pageName="Raporty i analizy" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Raporty i analizy
          </h1>
          <p className="text-gray-600">
            Dokumentacja planowanych wyników i skuteczności programu
            &quot;Więźniarki&quot;
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-4">
                Transparentność i ewaluacja programu
              </h2>
              <p className="text-gray-700 mb-4">
                Program &quot;Więźniarki&quot;, który rozpocznie działalność w
                2025 roku, będzie regularnie monitorowany i poddawany ocenie
                przez niezależne instytucje badawcze oraz Ministerstwo
                Sprawiedliwości. Na tej stronie udostępniać będziemy raporty,
                analizy i badania związane z planowaniem, a następnie
                funkcjonowaniem programu, jego skutecznością oraz wpływem na
                proces resocjalizacji i reintegracji społecznej uczestniczek.
              </p>
              <p className="text-gray-700">
                Wszystkie dokumenty są udostępniane w ramach polityki
                transparentności i mogą być wykorzystywane do celów
                informacyjnych, edukacyjnych i badawczych z zachowaniem praw
                autorskich i odpowiednim cytowaniem źródeł.
              </p>
            </div>

            {/* Raporty i dokumenty */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Raporty i dokumenty programu
              </h2>

              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {report.type === "pdf" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                            <text
                              x="12"
                              y="16"
                              textAnchor="middle"
                              fontSize="7"
                              fill="currentColor"
                              className="font-bold"
                            >
                              PDF
                            </text>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                            <text
                              x="12"
                              y="16"
                              textAnchor="middle"
                              fontSize="7"
                              fill="currentColor"
                              className="font-bold"
                            >
                              XLS
                            </text>
                          </svg>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Opublikowano: {report.date}
                        </p>
                        <p className="text-gray-700 mb-3">
                          {report.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Rozmiar pliku: {report.size}
                          </span>
                          <a
                            href={`#${report.id}`}
                            className="inline-flex items-center px-3 py-1 border border-primary text-primary rounded text-sm hover:bg-primary hover:text-white transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Pobierz
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badania naukowe */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Publikacje naukowe i badania
              </h2>

              <div className="space-y-5">
                {studies.map((study, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {study.title}
                    </h3>
                    <p className="text-gray-700 mb-2">{study.author}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {study.journal}, {study.year}
                    </p>
                    <a
                      href={study.link}
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      <span>Przeczytaj streszczenie</span>
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
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary mb-2">
                    Potrzebujesz dodatkowych informacji o planowanym programie?
                  </h3>
                  <p className="text-gray-600 mb-4 md:mb-0">
                    Skontaktuj się z naszym biurem, aby uzyskać dostęp do
                    dodatkowych materiałów dotyczących przygotowań do
                    uruchomienia programu &quot;Więźniarki&quot; w 2025 roku.
                  </p>
                </div>
                <div>
                  <Link
                    href="/contact"
                    className="inline-block bg-primary text-white py-2 px-6 rounded hover:bg-primary/90 transition"
                  >
                    Kontakt
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
