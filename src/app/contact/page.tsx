"use client";

import MainLayout from "../MainLayout";
import Link from "next/link";
import { useState } from "react";
import FormInput from "@/frontend/components/common/FormInput";
import TextareaInput from "@/frontend/components/common/TextareaInput";
import SelectInput from "@/frontend/components/common/SelectInput";
import CheckboxInput from "@/frontend/components/common/CheckboxInput";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    agreeTerms: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja formularza
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setFormError("Proszę wypełnić wszystkie wymagane pola.");
      return;
    }

    if (!formData.agreeTerms) {
      setFormError("Proszę zaakceptować regulamin i politykę prywatności.");
      return;
    }

    // Symulacja wysłania formularza
    setTimeout(() => {
      setFormSubmitted(true);
      setFormError("");
    }, 1000);
  };

  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Kontakt
          </h1>
          <p className="text-gray-600">
            Skontaktuj się z Biurem Projektu &quot;Więźniarki&quot;
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formularz kontaktowy */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Formularz kontaktowy
                </h2>

                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">
                          Dziękujemy za wysłanie wiadomości!
                        </p>
                        <p className="text-sm mt-1">
                          Odpowiemy na Twoje zapytanie najszybciej jak to
                          możliwe.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {formError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <p className="font-medium">{formError}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          id="name"
                          name="name"
                          label="Imię i nazwisko"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <FormInput
                          id="email"
                          name="email"
                          label="Adres e-mail"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput
                          id="phone"
                          name="phone"
                          label="Numer telefonu"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <SelectInput
                          id="subject"
                          name="subject"
                          label="Temat"
                          value={formData.subject}
                          onChange={handleChange}
                          options={[
                            { value: "info", label: "Informacja o programie" },
                            { value: "join", label: "Dołączenie do programu" },
                            {
                              value: "cooperation",
                              label: "Propozycja współpracy",
                            },
                            {
                              value: "technical",
                              label: "Problemy techniczne",
                            },
                            { value: "other", label: "Inne" },
                          ]}
                          placeholder="Wybierz temat"
                          required
                        />
                      </div>

                      <TextareaInput
                        id="message"
                        name="message"
                        label="Wiadomość"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mb-4"
                      />

                      <CheckboxInput
                        id="agreeTerms"
                        name="agreeTerms"
                        label={
                          <>
                            Akceptuję{" "}
                            <Link
                              href="/regulamin"
                              className="text-primary hover:underline"
                            >
                              regulamin
                            </Link>{" "}
                            oraz{" "}
                            <Link
                              href="/privacy"
                              className="text-primary hover:underline"
                            >
                              politykę prywatności
                            </Link>
                          </>
                        }
                        checked={formData.agreeTerms}
                        onChange={handleCheckboxChange}
                        required
                        className="mb-6"
                      />

                      <div>
                        <button
                          type="submit"
                          className="bg-primary text-white font-semibold py-3 px-6 rounded hover:bg-primary-dark transition shadow-md"
                          style={{
                            color: "white",
                            backgroundColor: "#1e50a0",
                            border: "2px solid #1e50a0",
                          }}
                        >
                          Wyślij wiadomość
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Dane kontaktowe */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Biuro Projektu
                </h3>
                <address className="not-italic space-y-4">
                  <div className="flex">
                    <div className="mr-3 mt-0.5">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Adres:</p>
                      <p>Biuro Projektu &quot;Więźniarki&quot;</p>
                      <p>ul. Przykładowa 123</p>
                      <p>00-001 Warszawa</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-3 mt-0.5">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">E-mail:</p>
                      <a
                        href="mailto:kontakt@wiezniarki.gov.pl"
                        className="text-primary hover:underline"
                      >
                        kontakt@wiezniarki.gov.pl
                      </a>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-3 mt-0.5">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Telefon:</p>
                      <a
                        href="tel:+48123456789"
                        className="text-primary hover:underline"
                      >
                        +48 123 456 789
                      </a>
                    </div>
                  </div>
                </address>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Godziny pracy
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="font-medium">Poniedziałek - Piątek:</span>
                    <span>8:00 - 16:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Sobota:</span>
                    <span>Nieczynne</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Niedziela:</span>
                    <span>Nieczynne</span>
                  </li>
                </ul>
              </div>

              <div className="bg-accent rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-primary mb-4">
                  Przydatne linki
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/faq" className="flex items-center group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
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
                      <span className="text-gray-700 group-hover:text-primary transition">
                        Najczęściej zadawane pytania
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="flex items-center group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
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
                      <span className="text-gray-700 group-hover:text-primary transition">
                        O projekcie
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-it-works"
                      className="flex items-center group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
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
                      <span className="text-gray-700 group-hover:text-primary transition">
                        Jak działa platforma
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="flex items-center group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-gray-700 group-hover:text-primary transition">
                        Bezpieczeństwo
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
