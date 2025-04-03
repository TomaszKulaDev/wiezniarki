"use client";

import MainLayout from "../MainLayout";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// Dane o jednostkach penitencjarnych - w produkcyjnej aplikacji te dane mogłyby pochodzić z API
const penitentiaryUnits = [
  {
    region: "Województwo dolnośląskie",
    units: [
      {
        name: "ZK Wrocław",
        inmates: 157,
        address: "ul. Kleczkowska 35, 50-211 Wrocław",
        type: "zamknięty",
        hasWomensSection: true,
      },
      {
        name: "AŚ Świdnica",
        inmates: 83,
        address: "ul. Wałbrzyska 15, 58-100 Świdnica",
        type: "areszt śledczy",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo kujawsko-pomorskie",
    units: [
      {
        name: "ZK Grudziądz",
        inmates: 265,
        address: "ul. Wybickiego 10/22, 86-300 Grudziądz",
        type: "zamknięty",
        hasWomensSection: true,
      },
      {
        name: "ZK Czersk",
        inmates: 98,
        address: "ul. Łubińska 4, 89-650 Czersk",
        type: "półotwarty",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo lubelskie",
    units: [
      {
        name: "AŚ Lublin",
        inmates: 122,
        address: "ul. Południowa 5, 20-482 Lublin",
        type: "areszt śledczy",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo lubuskie",
    units: [
      {
        name: "ZK Krzywaniec",
        inmates: 178,
        address: "Krzywaniec 1, 66-010 Nowogród Bobrzański",
        type: "zamknięty",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo łódzkie",
    units: [
      {
        name: "AŚ Łódź",
        inmates: 110,
        address: "ul. Smutna 21, 91-729 Łódź",
        type: "areszt śledczy",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo małopolskie",
    units: [
      {
        name: "AŚ Kraków-Podgórze",
        inmates: 136,
        address: "ul. Marii Konopnickiej 71, 30-302 Kraków",
        type: "areszt śledczy",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo mazowieckie",
    units: [
      {
        name: "AŚ Warszawa-Grochów",
        inmates: 189,
        address: "ul. Chłopickiego 71A, 04-275 Warszawa",
        type: "areszt śledczy",
        hasWomensSection: true,
      },
      {
        name: "ZK Siedlce",
        inmates: 76,
        address: "ul. Piłsudskiego 47, 08-110 Siedlce",
        type: "półotwarty",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo opolskie",
    units: [
      {
        name: "ZK Opole",
        inmates: 94,
        address: "ul. Sandomierska 4, 45-326 Opole",
        type: "półotwarty",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo podlaskie",
    units: [
      {
        name: "AŚ Białystok",
        inmates: 112,
        address: "ul. Kopernika 21, 15-396 Białystok",
        type: "areszt śledczy",
        hasWomensSection: true,
      },
    ],
  },
  {
    region: "Województwo śląskie",
    units: [
      {
        name: "ZK Lubliniec",
        inmates: 142,
        address: "ul. Sobieskiego 6, 42-700 Lubliniec",
        type: "zamknięty",
        hasWomensSection: true,
      },
      {
        name: "ZK Bytom",
        inmates: 105,
        address: "ul. Wrocławska 7, 41-902 Bytom",
        type: "półotwarty",
        hasWomensSection: true,
      },
    ],
  },
];

// Podsumowanie liczby jednostek i osadzonych
const totalUnits = penitentiaryUnits.reduce(
  (sum, region) => sum + region.units.length,
  0
);
const totalInmates = penitentiaryUnits.reduce(
  (sum, region) =>
    sum + region.units.reduce((regionSum, unit) => regionSum + unit.inmates, 0),
  0
);

export default function Units() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrowanie jednostek na podstawie wyszukiwania
  const filteredUnits = searchQuery
    ? penitentiaryUnits
        .map((region) => ({
          ...region,
          units: region.units.filter(
            (unit) =>
              unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              unit.address.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((region) => region.units.length > 0)
    : penitentiaryUnits;

  // Obsługa kliknięcia w region
  const handleRegionClick = (region: string) => {
    setActiveRegion(activeRegion === region ? null : region);
  };

  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Jednostki penitencjarne dla kobiet
          </h1>
          <p className="text-white/80">
            Zakłady karne i areszty śledcze uczestniczące w programie Więźniarki
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
            &gt; <span className="text-gray-800">Jednostki penitencjarne</span>
          </div>
        </div>
      </div>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Lewy panel */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Wyszukaj jednostkę
                </h3>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nazwa lub miejscowość..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="absolute right-2 top-2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                    </button>
                  </div>
                </div>

                <h4 className="font-medium text-gray-700 mb-2">Statystyki</h4>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Liczba jednostek:</span>
                    <span className="font-medium">{totalUnits}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">
                      Łączna liczba osadzonych:
                    </span>
                    <span className="font-medium">{totalInmates}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Zakłady karne:</span>
                    <span className="font-medium">
                      {penitentiaryUnits.reduce(
                        (sum, region) =>
                          sum +
                          region.units.filter(
                            (unit) => unit.type !== "areszt śledczy"
                          ).length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Areszty śledcze:</span>
                    <span className="font-medium">
                      {penitentiaryUnits.reduce(
                        (sum, region) =>
                          sum +
                          region.units.filter(
                            (unit) => unit.type === "areszt śledczy"
                          ).length,
                        0
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">Legenda</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">
                        Zakład karny zamknięty
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">
                        Zakład karny półotwarty
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">
                        Areszt śledczy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Informacje dodatkowe
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Wszystkie wymienione jednostki uczestniczą w programie
                  Więźniarki, zapewniając kobietom możliwość udziału w programie
                  reintegracji społecznej. Każda jednostka posiada odpowiednio
                  przeszkolony personel, który wspiera uczestniczki programu w
                  budowaniu pozytywnych relacji społecznych.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <span>Kontakt w sprawie jednostek</span>
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

            {/* Prawa część - lista jednostek */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Pełna lista jednostek penitencjarnych dla kobiet
                </h2>

                <div className="mb-6 relative overflow-hidden rounded-lg">
                  <Image
                    src="/POL_location_map.svg"
                    alt="Mapa Polski z zaznaczonymi zakładami karnymi"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 flex items-end justify-center pb-4">
                    <span className="text-sm text-gray-500 italic">
                      Mapa przedstawia przybliżone położenie jednostek
                      penitencjarnych dla kobiet
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredUnits.map((region) => (
                    <div key={region.region} className="overflow-hidden">
                      <button
                        className={`w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded-md ${
                          activeRegion === region.region
                            ? "bg-primary text-white"
                            : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                        }`}
                        onClick={() => handleRegionClick(region.region)}
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 mr-2 transform transition-transform ${
                              activeRegion === region.region ? "rotate-90" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          {region.region}
                        </div>
                        <span className="text-sm">
                          {region.units.length}{" "}
                          {region.units.length === 1
                            ? "jednostka"
                            : region.units.length < 5
                            ? "jednostki"
                            : "jednostek"}
                        </span>
                      </button>

                      {activeRegion === region.region && (
                        <div className="p-4 bg-gray-50 rounded-b-md">
                          <div className="grid md:grid-cols-2 gap-4">
                            {region.units.map((unit) => (
                              <div
                                key={unit.name}
                                className="bg-white p-4 rounded-md shadow-sm hover:shadow transition-shadow"
                              >
                                <div className="flex items-start">
                                  <span
                                    className={`inline-block w-3 h-3 rounded-full mt-1.5 mr-3 ${
                                      unit.type === "areszt śledczy"
                                        ? "bg-red-500"
                                        : unit.type === "zamknięty"
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                    }`}
                                  ></span>
                                  <div>
                                    <h3 className="font-bold text-gray-800">
                                      {unit.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                      {unit.address}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
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
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                      </svg>
                                      Osadzonych kobiet: {unit.inmates}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
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
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      Typ:{" "}
                                      {unit.type.charAt(0).toUpperCase() +
                                        unit.type.slice(1)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredUnits.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-600">
                        Nie znaleziono jednostek odpowiadających kryteriom
                        wyszukiwania.
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-primary hover:underline"
                      >
                        Wyczyść wyszukiwanie
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">
                      Informacja o kontakcie z osadzonymi
                    </h3>
                    <p className="text-sm text-gray-700">
                      Kontakt z osadzonymi w ramach programu Więźniarki odbywa
                      się za pośrednictwem platformy internetowej. Jeśli jesteś
                      zainteresowany/a nawiązaniem relacji, przeglądaj profile
                      uczestniczek i nawiąż kontakt zgodnie z zasadami programu.
                      Fizyczne odwiedziny w zakładach karnych podlegają
                      standardowym procedurom Służby Więziennej i możliwe są
                      dopiero po ustanowieniu stałej relacji.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/profiles"
                        className="inline-flex items-center text-sm bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                      >
                        <span>Zobacz profile uczestniczek</span>
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
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
