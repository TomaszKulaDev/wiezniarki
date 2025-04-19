"use client";

import Link from "next/link";
import MainLayout from "./MainLayout";
import Image from "next/image";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section - bardziej oficjalny styl */}
      <section className="bg-gray-800 py-16">
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

      {/* Poznaj uczestniczki programu - interaktywne karty */}
      <section className="py-8 bg-gradient-to-b from-accent to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-3">
            <div className="mb-2">
              <Image
                src="/godlo.jpg"
                alt="Godło Polski"
                width={50}
                height={60}
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Poznaj uczestniczki programu
            </h2>
          </div>
          <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">
            Kobiety, które dzięki programowi mogą nawiązać wartościowe relacje
            społeczne i przygotować się do powrotu do społeczeństwa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Karta 1 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop"
                    alt="Anna K."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Anna K.</h3>
                      <p className="text-sm">32 lata • ZK w Warszawie</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      malarstwo
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      literatura
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      joga
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Pasjonatka sztuki i literatury. Uczy się malarstwa i
                    projektowania graficznego.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/1"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>

            {/* Karta 2 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
                    alt="Martyna W."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Martyna W.</h3>
                      <p className="text-sm">28 lat • ZK w Krakowie</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      muzyka
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      taniec
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      pisanie
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Samouk gry na gitarze i pianinie. Pisze opowiadania i teksty
                    piosenek.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/2"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>

            {/* Karta 3 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
                    alt="Karolina M."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Karolina M.</h3>
                      <p className="text-sm">35 lat • ZK w Poznaniu</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      psychologia
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      rozwój osobisty
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      gotowanie
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Interesuje się psychologią i rozwojem osobistym. Wierzy w
                    drugą szansę dla każdego.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/3"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>

            {/* Karta 4 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
                    alt="Joanna T."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Joanna T.</h3>
                      <p className="text-sm">29 lat • ZK w Łodzi</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      fotografia
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      sport
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      języki obce
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Pasjonatka fotografii i aktywności fizycznej. Uczy się
                    języka angielskiego i hiszpańskiego.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/4"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Karta 5 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                    alt="Magdalena S."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Magdalena S.</h3>
                      <p className="text-sm">27 lat • ZK w Opolu</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      informatyka
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      programowanie
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      sztuka
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Pasjonatka nowych technologii. Uczy się kodowania i
                    projektowania stron internetowych.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/5"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>

            {/* Karta 6 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop"
                    alt="Natalia R."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Natalia R.</h3>
                      <p className="text-sm">31 lat • ZK w Grudziądzu</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      ogrodnictwo
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      ekologia
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      zdrowie
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Zaangażowana w ochronę środowiska. Marzy o prowadzeniu
                    własnego gospodarstwa ekologicznego.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/6"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>

            {/* Karta 7 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1554727242-741c14fa561c?q=80&w=1974&auto=format&fit=crop"
                    alt="Katarzyna D."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Katarzyna D.</h3>
                      <p className="text-sm">36 lat • ZK w Lublińcu</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      rękodzieło
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      historia
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      kulinaria
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Miłośniczka tradycyjnego rękodzieła. Tworzy biżuterię i
                    dekoracje z naturalnych materiałów.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/7"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>

            {/* Karta 8 */}
            <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1974&auto=format&fit=crop"
                    alt="Monika P."
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">Monika P.</h3>
                      <p className="text-sm">24 lata • ZK w Krzywańcu</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      edukacja
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      pedagogika
                    </span>
                    <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                      dzieci
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Studiowała pedagogikę przed osadzeniem. Chce pracować z
                    dziećmi w przyszłości.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/profiles/8"
                    className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: "white",
                      color: "#1e50a0",
                      borderColor: "#1e50a0",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e50a0";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#1e50a0";
                      e.currentTarget.style.borderColor = "#1e50a0";
                    }}
                  >
                    Zobacz profil
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-end">
            <Link
              href="/profiles"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg hover:bg-blue-700"
              style={{ backgroundColor: "#1e50a0" }}
            >
              <span>Zobacz wszystkie profile</span>
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
      </section>

      {/* Jak działa program - proces */}
      <section className="py-2 mb-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
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

      {/* Skuteczność programu - statystyki */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="md:max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-300">
              Skuteczna resocjalizacja poprzez relacje społeczne
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Program Więźniarki jest oficjalną inicjatywą wspierającą proces
                resocjalizacji kobiet poprzez budowanie wartościowych relacji
                społecznych.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Wnioski z przeprowadzonych analiz potwierdzają, że osoby
                osadzone utrzymujące regularny, pozytywny kontakt ze światem
                zewnętrznym zwiększają swoje szanse na skuteczną reintegrację
                społeczną po odbyciu kary o 40%.
              </p>
              <div className="mt-6 mb-6 bg-gray-750 rounded-lg p-5 border border-gray-600 shadow-inner">
                <h4 className="text-lg font-semibold mb-4 text-gray-200 flex items-center border-b border-gray-600 pb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Jednostki penitencjarne dla kobiet uczestniczące w programie
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    10 z 24
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded p-3">
                    <h5 className="text-sm font-medium mb-2 text-gray-300 border-b border-gray-600 pb-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Polska Północna
                    </h5>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">ZK Grudziądz</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          265 osadzonych
                        </span>
                      </li>
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">AŚ Białystok</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          112 osadzonych
                        </span>
                      </li>
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">ZK Czersk</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          98 osadzonych
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <h5 className="text-sm font-medium mb-2 text-gray-300 border-b border-gray-600 pb-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Polska Centralna
                    </h5>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">ZK Lubliniec</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          142 osadzonych
                        </span>
                      </li>
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">AŚ Warszawa-Grochów</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          189 osadzonych
                        </span>
                      </li>
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">AŚ Lublin</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          122 osadzonych
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <h5 className="text-sm font-medium mb-2 text-gray-300 border-b border-gray-600 pb-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Polska Południowa
                    </h5>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">ZK Krzywaniec</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          178 osadzonych
                        </span>
                      </li>
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">AŚ Kraków-Podgórze</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          136 osadzonych
                        </span>
                      </li>
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">ZK Wrocław</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          157 osadzonych
                        </span>
                      </li>
                      <li className="flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200">
                        <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="font-medium">ZK Opole</span>
                        <span className="text-xs ml-auto bg-gray-600 px-1.5 rounded">
                          94 osadzonych
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-500 italic flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
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
                    Dane aktualizowane codziennie
                  </p>
                  <Link
                    href="/units"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
                  >
                    Pełna lista jednostek
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="mt-12">
                <Link
                  href="/about"
                  className="inline-flex items-center bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded hover:bg-gray-300 transition"
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
        </div>
      </section>

      {/* Wsparcie i kontakt */}
      <section className="py-20 bg-accent border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Masz pytania?</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
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
