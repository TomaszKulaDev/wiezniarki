// src/app/cookies/page.tsx
import React from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";

export default function CookiesPolicy() {
  return (
    <MainLayout>
      <Breadcrumbs pageName="Polityka cookies" />

      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Polityka cookies
          </h1>
          <p className="text-gray-600">
            Informacje dotyczące wykorzystania plików cookies na platformie
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Treść polityki cookies */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    1. Informacje ogólne
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      1.1. Niniejsza Polityka cookies określa zasady
                      przechowywania i dostępu do informacji na urządzeniach
                      Użytkownika za pomocą plików cookies, służących realizacji
                      usług świadczonych drogą elektroniczną żądanych przez
                      Użytkownika, przez Administratora platformy
                      &quot;Więźniarki&quot;.
                    </p>
                    <p>
                      1.2. Administratorem platformy &quot;Więźniarki&quot; jest
                      Ministerstwo Sprawiedliwości z siedzibą w Warszawie, Al.
                      Ujazdowskie 11, 00-950 Warszawa.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    2. Definicje
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      2.1. <strong>Administrator</strong> - oznacza Ministerstwo
                      Sprawiedliwości, które świadczy usługi drogą elektroniczną
                      oraz przechowuje i uzyskuje dostęp do informacji w
                      urządzeniach Użytkownika.
                    </p>
                    <p>
                      2.2. <strong>Cookies</strong> - oznacza dane
                      informatyczne, w szczególności niewielkie pliki tekstowe,
                      zapisywane i przechowywane na urządzeniach za
                      pośrednictwem których Użytkownik korzysta ze stron
                      internetowych platformy &quot;Więźniarki&quot;.
                    </p>
                    <p>
                      2.3. <strong>Cookies Administratora</strong> - oznacza
                      cookies zamieszczane przez Administratora, związane ze
                      świadczeniem usług drogą elektroniczną przez
                      Administratora.
                    </p>
                    <p>
                      2.4. <strong>Cookies Zewnętrzne</strong> - oznacza cookies
                      zamieszczane przez partnerów Administratora, za
                      pośrednictwem strony internetowej Platformy.
                    </p>
                    <p>
                      2.5. <strong>Platforma</strong> - oznacza stronę
                      internetową lub aplikację, pod którą Administrator
                      prowadzi platformę &quot;Więźniarki&quot;, działającą w
                      domenie wiezniarki.gov.pl.
                    </p>
                    <p>
                      2.6. <strong>Urządzenie</strong> - oznacza elektroniczne
                      urządzenie za pośrednictwem którego Użytkownik uzyskuje
                      dostęp do stron internetowych Platformy.
                    </p>
                    <p>
                      2.7. <strong>Użytkownik</strong> - oznacza podmiot, na
                      rzecz którego zgodnie z Regulaminem i przepisami prawa
                      mogą być świadczone usługi drogą elektroniczną lub z
                      którym zawarta może być Umowa o świadczenie usług drogą
                      elektroniczną.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    3. Rodzaje wykorzystywanych cookies
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      3.1. Stosowane przez Administratora cookies są bezpieczne
                      dla Urządzenia Użytkownika. W szczególności tą drogą nie
                      jest możliwe przedostanie się do Urządzeń Użytkowników
                      wirusów lub innego niechcianego oprogramowania lub
                      oprogramowania złośliwego. Pliki te pozwalają
                      zidentyfikować oprogramowanie wykorzystywane przez
                      Użytkownika i dostosować Platformę indywidualnie każdemu
                      Użytkownikowi.
                    </p>
                    <p>
                      3.2. Na Platformie wykorzystywane są następujące rodzaje
                      plików cookies:
                    </p>
                    <p className="pl-5">
                      <strong>a) Cookies sesyjne:</strong> są przechowywane na
                      Urządzeniu Użytkownika i pozostają tam do momentu
                      zakończenia sesji danej przeglądarki. Zapisane informacje
                      są wówczas trwale usuwane z pamięci Urządzenia. Mechanizm
                      cookies sesyjnych nie pozwala na pobieranie jakichkolwiek
                      danych osobowych ani żadnych informacji poufnych z
                      Urządzenia Użytkownika.
                    </p>
                    <p className="pl-5">
                      <strong>b) Cookies trwałe:</strong> są przechowywane na
                      Urządzeniu Użytkownika i pozostają tam do momentu ich
                      skasowania. Zakończenie sesji danej przeglądarki lub
                      wyłączenie Urządzenia nie powoduje ich usunięcia z
                      Urządzenia. Mechanizm cookies trwałych nie pozwala na
                      pobieranie jakichkolwiek danych osobowych ani żadnych
                      informacji poufnych z Urządzenia Użytkownika.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    4. Cele wykorzystywania plików cookies
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      4.1. Administrator wykorzystuje cookies własne w
                      następujących celach:
                    </p>
                    <p className="pl-5">
                      <strong>a) Konfiguracji platformy</strong> - dostosowanie
                      zawartości stron internetowych do preferencji Użytkownika
                      oraz optymalizacja korzystania ze stron internetowych.
                    </p>
                    <p className="pl-5">
                      <strong>b) Uwierzytelniania Użytkownika</strong> -
                      rozpoznawania Użytkowników zalogowanych na platformie oraz
                      przechowywania ich sesji.
                    </p>
                    <p className="pl-5">
                      <strong>c) Analiz i badań</strong> - tworzenia anonimowych
                      statystyk, które pomagają zrozumieć, w jaki sposób
                      Użytkownicy korzystają z platformy, co umożliwia
                      ulepszanie jej struktury i zawartości.
                    </p>
                    <p className="pl-5">
                      <strong>d) Świadczenia usług reklamowych</strong> -
                      dostosowania prezentowanych na platformie treści
                      reklamowych do preferencji Użytkownika.
                    </p>
                    <p className="pl-5">
                      <strong>e) Zapewnienia bezpieczeństwa</strong> -
                      wykrywania nadużyć w zakresie uwierzytelniania na
                      platformie.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    5. Możliwości określenia warunków przechowywania lub
                    uzyskiwania dostępu przez cookies
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      5.1. Użytkownik może samodzielnie i w każdym czasie
                      zmienić ustawienia dotyczące plików cookies, określając
                      warunki ich przechowywania i uzyskiwania dostępu przez
                      pliki cookies do Urządzenia Użytkownika. Zmiany ustawień,
                      o których mowa powyżej, Użytkownik może dokonać za pomocą
                      ustawień przeglądarki internetowej lub za pomocą
                      konfiguracji usługi. Ustawienia te mogą zostać zmienione w
                      szczególności w taki sposób, aby blokować automatyczną
                      obsługę plików cookies w ustawieniach przeglądarki
                      internetowej bądź informować o ich każdorazowym
                      zamieszczeniu na Urządzeniu Użytkownika.
                    </p>
                    <p>
                      5.2. Szczegółowe informacje o możliwości i sposobach
                      obsługi plików cookies dostępne są w ustawieniach
                      oprogramowania (przeglądarki internetowej).
                    </p>
                    <p>
                      5.3. Użytkownik może w każdej chwili usunąć pliki cookies
                      korzystając z dostępnych funkcji w przeglądarce
                      internetowej, której używa.
                    </p>
                    <p>
                      5.4. Ograniczenie stosowania plików cookies może wpłynąć
                      na niektóre funkcjonalności dostępne na stronie
                      internetowej Platformy.
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* CTA na dole strony */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                Masz pytania dotyczące plików cookies?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Jeśli masz jakiekolwiek pytania dotyczące naszej Polityki
                cookies lub sposobu, w jaki wykorzystujemy pliki cookies na
                naszej platformie, skontaktuj się z nami.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-primary hover:underline"
              >
                <span>Skontaktuj się z nami</span>
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
