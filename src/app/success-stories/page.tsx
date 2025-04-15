"use client";

import React from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";

export default function SuccessStories() {
  // Przykładowe historie sukcesu - dane te będą w przyszłości pobierane z API
  const stories = [
    {
      id: "maria-j",
      name: "Maria J.",
      age: 38,
      location: "Warszawa",
      year: 2025,
      title: "Od izolacji do nowego życia zawodowego",
      shortDesc:
        "Historia Marii pokazuje, jak wartościowe relacje społeczne mogą pomóc w znalezieniu pracy po odbyciu kary.",
      story:
        "Po 4 latach odbywania kary, nawiązałam kontakt z Anną przez program Więźniarki. Anna, która prowadzi firmę księgową, zainteresowała się moimi umiejętnościami matematycznymi i doświadczeniem biurowym sprzed okresu osadzenia. Przez ponad rok korespondowałyśmy regularnie, dzięki czemu rozwinęłam swoje umiejętności interpersonalne i przypomniałam sobie wiedzę z zakresu księgowości. Po opuszczeniu zakładu karnego, dzięki rekomendacji Anny, udało mi się znaleźć pracę jako asystentka księgowej. Dziś, po roku od wyjścia, awansowałam na samodzielne stanowisko i planuję zdobycie certyfikacji zawodowej.",
      achievements: [
        "Stała praca w zawodzie",
        "Samodzielne mieszkanie",
        "Odbudowane relacje rodzinne",
        "Plany zawodowego rozwoju",
      ],
      quote:
        "Program Więźniarki dał mi nie tylko przyjaźń, ale też motywację i konkretne wsparcie w powrocie do normalnego życia.",
      imgSrc: "/stories/story1.jpg",
    },
    {
      id: "aleksandra-t",
      name: "Aleksandra T.",
      age: 29,
      location: "Kraków",
      year: 2026,
      title: "Przyjaźń, która otworzyła drzwi do społeczeństwa",
      shortDesc:
        "Aleksandra nawiązała relację, która pomogła jej odbudować zerwane więzi społeczne i rodzinne.",
      story:
        "Program Więźniarki dał mi szansę na nawiązanie kontaktu z Marzeną, nauczycielką i wolontariuszką. Nasze rozmowy początkowo krążyły wokół literatury i sztuki, ale z czasem stały się głębsze i bardziej osobiste. Marzena pomagała mi zrozumieć, jak naprawić relacje z rodziną, szczególnie z moją matką, z którą nie rozmawiałam od lat. Dzięki jej wsparciu, jeszcze przed zakończeniem odbywania kary, odważyłam się napisać list do mamy. Dziś, pół roku po wyjściu, mieszkam z mamą, pracuję w lokalnej bibliotece (co było moim marzeniem) i uczestniczę w terapii rodzinnej. Z Marzeną nadal utrzymujemy kontakt, a nasza przyjaźń stała się ważną częścią mojego nowego życia.",
      achievements: [
        "Odbudowane relacje rodzinne",
        "Praca zgodna z zainteresowaniami",
        "Kontynuacja edukacji",
        "Stabilna sytuacja mieszkaniowa",
      ],
      quote:
        "Odkryłam, że nigdy nie jest za późno, by naprawić błędy i zacząć od nowa, szczególnie gdy ma się wsparcie życzliwych ludzi.",
      imgSrc: "/stories/story2.jpg",
    },
    {
      id: "joanna-w",
      name: "Joanna W.",
      age: 42,
      location: "Poznań",
      year: 2026,
      title: "Z pasją przez trudności",
      shortDesc:
        "Historia Joanny pokazuje, jak rozwijanie pasji może stać się drogą do nowego życia.",
      story:
        "W trakcie odbywania kary odkryłam talent do rękodzieła, szczególnie do szydełkowania. Dzięki programowi Więźniarki poznałam Barbarę, właścicielkę sklepu z rękodziełem. Barbara zainteresowała się moimi pracami i zaczęła przesyłać mi materiały oraz inspiracje. Nasza korespondencja szybko przerodziła się w przyjaźń i współpracę. Po wyjściu na wolność, Barbara zaoferowała mi sprzedaż moich wyrobów w swoim sklepie. Dziś, rok później, prowadzę warsztaty szydełkowania dla początkujących i sprzedaję swoje prace przez internet. Zarabiam na życie robiąc to, co kocham, i jestem wdzięczna za szansę, którą dostałam dzięki programowi.",
      achievements: [
        "Własna działalność rękodzielnicza",
        "Prowadzenie warsztatów",
        "Stabilny dochód",
        "Rozwój umiejętności biznesowych",
      ],
      quote:
        "Nigdy bym nie pomyślała, że hobby, które odkryłam w najtrudniejszym okresie życia, stanie się moim sposobem na samorealizację i utrzymanie.",
      imgSrc: "/stories/story3.jpg",
    },
  ];

  return (
    <MainLayout>
      <Breadcrumbs pageName="Historie sukcesu" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Historie sukcesu
          </h1>
          <p className="text-gray-600">
            Prawdziwe historie kobiet, których życie zmieniło się dzięki
            programowi Więźniarki
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
                Moc relacji międzyludzkich
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-2/3">
                  <p className="text-gray-700 mb-4">
                    Program &quot;Więźniarki&quot;, który ruszy w 2025 roku, ma
                    na celu wspieranie procesu resocjalizacji kobiet odbywających
                    karę pozbawienia wolności poprzez umożliwienie im nawiązania
                    wartościowych relacji z osobami spoza zakładów karnych.
                  </p>
                  <p className="text-gray-700">
                    Poniżej prezentujemy historie kobiet, które dzięki
                    programowi pilotażowemu i nawiązanym relacjom zdołały z
                    sukcesem powrócić do społeczeństwa, znaleźć pracę, odbudować
                    więzi rodzinne i rozpocząć nowe życie. Te historie są
                    dowodem na to, że odpowiednie wsparcie i wartościowe relacje
                    mogą całkowicie odmienić ludzkie życie.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src="/connection.jpg"
                      alt="Symboliczne połączenie"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Historie sukcesu */}
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="bg-white rounded-lg shadow-sm p-6 mb-6"
              >
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-primary mb-2">
                    {story.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>
                      {story.name}, {story.age} lat
                    </span>
                    <span className="mx-2">•</span>
                    <span>{story.location}</span>
                    <span className="mx-2">•</span>
                    <span>Program {story.year}</span>
                  </div>
                  <p className="text-gray-700 font-medium">{story.shortDesc}</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Historia
                      </h3>
                      <p className="text-gray-700">{story.story}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Osiągnięcia
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {story.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <blockquote className="italic text-gray-700">
                        &quot;{story.quote}&quot;
                      </blockquote>
                      <p className="text-right text-sm mt-2 font-medium">
                        — {story.name}
                      </p>
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="rounded-lg overflow-hidden shadow-sm mb-4 bg-gray-200">
                      <div className="relative h-64 w-full">
                        <Image
                          src={story.imgSrc}
                          alt={`Zdjęcie przedstawiające historię ${story.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {index < stories.length - 1 && (
                      <div className="mt-4 text-center">
                        <a
                          href={`#${stories[index + 1].id}`}
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <span>Przeczytaj następną historię</span>
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="bg-accent rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Chcesz dołączyć do programu?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Program &quot;Więźniarki&quot; rozpocznie się w 2025 roku. Już
                teraz możesz dowiedzieć się więcej o zasadach uczestnictwa lub
                zapisać się na listę osób zainteresowanych.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/how-it-works"
                  className="bg-white text-primary font-semibold py-3 px-6 rounded hover:bg-gray-50 transition shadow-md border-2 border-primary"
                  style={{ color: "#1e50a0", backgroundColor: "white" }}
                >
                  Jak działa program?
                </Link>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
