"use client";

import MainLayout from "../MainLayout";
import Link from "next/link";
import { useState } from "react";

export default function FAQ() {
  // Stan dla rozwijanych sekcji FAQ
  const [openSection, setOpenSection] = useState<number | null>(null);

  // Funkcja do przełączania sekcji
  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  // Dane FAQ
  const faqData = [
    {
      category: "O programie",
      questions: [
        {
          question: "Czym jest program 'Więźniarki'?",
          answer:
            "Program 'Więźniarki' to oficjalna inicjatywa mająca na celu wsparcie procesu resocjalizacji kobiet osadzonych w zakładach karnych poprzez budowanie zdrowych relacji społecznych. Program umożliwia kobietom przebywającym w zakładach karnych nawiązanie kontaktu z osobami z zewnątrz, co wspomaga ich reintegrację ze społeczeństwem.",
        },
        {
          question: "Jakie są cele programu?",
          answer:
            "Główne cele programu to: wspieranie resocjalizacji poprzez budowanie pozytywnych relacji społecznych, zmniejszenie poczucia izolacji osób osadzonych, pomoc w przygotowaniu do życia po odbyciu kary, budowanie mostów między społeczeństwem a osobami osadzonymi oraz zwiększanie świadomości społecznej na temat potrzeb i wyzwań stojących przed kobietami opuszczającymi zakłady karne.",
        },
        {
          question: "Kto może uczestniczyć w programie?",
          answer:
            "W programie mogą uczestniczyć kobiety przebywające w zakładach karnych, które zostały pozytywnie zweryfikowane przez pracowników zakładu, oraz pełnoletnie osoby z zewnątrz, które przejdą proces rejestracji i weryfikacji. Wszystkie osoby uczestniczące w programie muszą zaakceptować regulamin i przestrzegać zasad bezpieczeństwa.",
        },
      ],
    },
    {
      category: "Dla osadzonych kobiet",
      questions: [
        {
          question: "Jak mogę wziąć udział w programie jako osadzona?",
          answer:
            "Aby wziąć udział w programie jako osoba osadzona, należy zgłosić się do wychowawcy lub psychologa w zakładzie karnym, który przekaże szczegółowe informacje i pomoże w procesie rejestracji. Po wstępnej weryfikacji, będziesz mogła stworzyć swój profil, który zostanie opublikowany na platformie.",
        },
        {
          question: "Jakie informacje będą widoczne w moim profilu?",
          answer:
            "W profilu będą widoczne podstawowe informacje, które zdecydujesz się udostępnić, takie jak imię (lub pseudonim), wiek, zainteresowania, hobby oraz plany na przyszłość. Ważne jest, aby informacje były prawdziwe, ale nie musisz podawać szczegółów, które uznasz za zbyt osobiste. Nie publikujemy informacji o powodach odbywania kary.",
        },
        {
          question: "Jak będzie wyglądał kontakt z osobami z zewnątrz?",
          answer:
            "Kontakt rozpoczyna się od wymiany wiadomości przez platformę. Wszystkie pierwsze wiadomości są moderowane w celu zapewnienia bezpieczeństwa. Z czasem, jeśli relacja będzie się rozwijać pozytywnie, możliwe będzie rozszerzenie form kontaktu, zgodnie z regulaminem zakładu karnego.",
        },
      ],
    },
    {
      category: "Dla partnerów",
      questions: [
        {
          question: "Jak mogę zostać partnerem programu?",
          answer:
            "Aby zostać partnerem programu, należy zarejestrować się na platformie, podając wymagane dane osobowe do weryfikacji. Po pozytywnej weryfikacji, będziesz mógł/mogła przeglądać profile osadzonych kobiet i inicjować kontakt. Proces weryfikacji służy zapewnieniu bezpieczeństwa wszystkim uczestnikom programu.",
        },
        {
          question: "Czy moja tożsamość będzie chroniona?",
          answer:
            "Tak, Twoja tożsamość będzie chroniona. W profilu możesz używać pseudonimu, a dane osobowe używane są wyłącznie do celów weryfikacyjnych i nie są udostępniane osobom osadzonym bez Twojej zgody. Pamiętaj jednak, że budowanie autentycznej relacji wymaga pewnego poziomu otwartości i szczerości.",
        },
        {
          question: "Czy mogę wybrać konkretną osobę do kontaktu?",
          answer:
            "Tak, możesz przeglądać profile osadzonych kobiet i wybrać osobę, z którą chciałbyś/chciałabyś nawiązać kontakt, bazując na wspólnych zainteresowaniach lub innych czynnikach. Inicjowanie kontaktu zawsze wymaga obustronnej zgody.",
        },
      ],
    },
    {
      category: "Bezpieczeństwo",
      questions: [
        {
          question: "Jak zapewniane jest bezpieczeństwo w programie?",
          answer:
            "Bezpieczeństwo jest naszym priorytetem. Wszystkie profile i komunikacja są monitorowane przez zespół specjalistów. Pierwsza korespondencja podlega moderacji. Przeprowadzamy weryfikację tożsamości uczestników, a w przypadku naruszenia regulaminu, możemy zablokować konto użytkownika. Program działa w ścisłej współpracy z administracją zakładów karnych.",
        },
        {
          question: "Czy moje dane osobowe są bezpieczne?",
          answer:
            "Tak, wszystkie dane osobowe są przetwarzane zgodnie z przepisami RODO. Stosujemy zaawansowane metody szyfrowania i ograniczamy dostęp do danych osobowych wyłącznie do upoważnionych pracowników. Nie udostępniamy danych osobowych stronom trzecim bez wyraźnej zgody użytkownika.",
        },
        {
          question: "Co się stanie, jeśli zauważę niepokojące zachowanie?",
          answer:
            "Jeśli zauważysz jakiekolwiek niepokojące zachowanie lub naruszenie regulaminu, prosimy o natychmiastowe zgłoszenie tego do administratorów programu. Możesz to zrobić korzystając z funkcji 'Zgłoś problem' dostępnej na platformie lub kontaktując się bezpośrednio z Biurem Projektu. Każde zgłoszenie jest traktowane poważnie i analizowane.",
        },
      ],
    },
    {
      category: "Techniczne",
      questions: [
        {
          question: "Czy korzystanie z platformy jest płatne?",
          answer:
            "Nie, korzystanie z platformy jest całkowicie bezpłatne zarówno dla osób osadzonych, jak i partnerów z zewnątrz. Program jest finansowany ze środków publicznych i dotacji, co pozwala nam oferować wszystkie funkcje bez opłat.",
        },
        {
          question: "Jak mogę zmienić informacje w swoim profilu?",
          answer:
            "Aby zmienić informacje w swoim profilu, zaloguj się na swoje konto i wybierz opcję 'Edytuj profil'. Wprowadź żądane zmiany i zapisz je. Pamiętaj, że niektóre zmiany mogą wymagać ponownej weryfikacji przez administratorów programu.",
        },
        {
          question: "Co zrobić, jeśli zapomniałem/am hasła?",
          answer:
            "Jeśli zapomniałeś/aś hasła, na stronie logowania wybierz opcję 'Zapomniałem/am hasła'. Postępuj zgodnie z instrukcjami, aby zresetować hasło. Link do resetowania hasła zostanie wysłany na Twój adres e-mail. Jeśli nadal masz problemy, skontaktuj się z Biurem Projektu.",
        },
      ],
    },
  ];

  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Najczęściej zadawane pytania
          </h1>
          <p className="text-white/80">
            Odpowiedzi na najczęstsze pytania dotyczące programu
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
              Masz pytania? Jesteśmy tu, by pomóc!
            </h2>
            <p className="text-gray-700 mb-4">
              Zebraliśmy odpowiedzi na najczęściej zadawane pytania dotyczące
              programu &quot;Więźniarki&quot;. Jeśli nie znajdziesz tu
              odpowiedzi na swoje pytanie, zachęcamy do
              <Link
                href="/contact"
                className="text-primary font-medium hover:underline"
              >
                {" "}
                kontaktu z nami
              </Link>
              .
            </p>
          </div>

          {/* Kategorie FAQ */}
          <div className="space-y-6">
            {faqData.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <h3 className="text-lg font-bold bg-accent p-4">
                  {category.category}
                </h3>
                <div className="p-4">
                  {category.questions.map((item, questionIndex) => {
                    const index = categoryIndex * 100 + questionIndex;
                    return (
                      <div
                        key={questionIndex}
                        className={`border-b border-gray-200 last:border-0 ${
                          questionIndex > 0 ? "mt-4" : ""
                        }`}
                      >
                        <button
                          className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
                          onClick={() => toggleSection(index)}
                        >
                          <span className="font-medium text-gray-800">
                            {item.question}
                          </span>
                          <span className="ml-6 flex-shrink-0">
                            <svg
                              className={`w-5 h-5 text-primary transition-transform ${
                                openSection === index
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            openSection === index ? "max-h-96 pb-4" : "max-h-0"
                          }`}
                        >
                          <p className="text-gray-600 pt-2">{item.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA na dole strony */}
          <div className="mt-12 mb-16 bg-accent rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Nie znalazłeś/aś odpowiedzi na swoje pytanie?
            </h3>
            <p className="text-gray-600 mb-4">
              Skontaktuj się z nami, a nasz zespół udzieli Ci szczegółowych
              informacji.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-accent text-gray-600 font-semibold py-2 px-6 rounded hover:bg-accent-dark transition shadow-sm"
            >
              Skontaktuj się z nami
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
