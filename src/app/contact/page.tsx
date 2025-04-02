"use client";

import MainLayout from "../MainLayout";
import Link from "next/link";
import { useState } from "react";

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
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Kontakt
          </h1>
          <p className="text-white/80">
            Skontaktuj się z Biurem Projektu &quot;Więźniarki&quot;
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
            &gt; <span className="text-gray-800">Kontakt</span>
          </div>
        </div>
      </div>

      {/* Główna treść */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formularz kontaktowy */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
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
                        Odpowiemy na Twoje zapytanie najszybciej jak to możliwe.
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
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Imię i nazwisko{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Adres e-mail <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Numer telefonu
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Temat <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        >
                          <option value="">Wybierz temat</option>
                          <option value="info">Informacja o programie</option>
                          <option value="join">Dołączenie do programu</option>
                          <option value="cooperation">
                            Propozycja współpracy
                          </option>
                          <option value="technical">Problemy techniczne</option>
                          <option value="other">Inne</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Wiadomość <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="agreeTerms"
                            className="font-medium text-gray-700"
                          >
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
                            </Link>{" "}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-primary text-white font-medium py-2 px-6 rounded hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
            <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                Biuro Projektu
              </h3>
              <address className="not-italic space-y-4">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-3 mt-0.5"
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
                  <div>
                    <p className="font-medium">Adres:</p>
                    <p>Biuro Projektu &quot;Więźniarki&quot;</p>
                    <p>ul. Przykładowa 123</p>
                    <p>00-001 Warszawa</p>
                  </div>
                </div>

                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-3 mt-0.5"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-3 mt-0.5"
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

            <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
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

            <div className="bg-accent rounded-lg shadow-sm border border-border p-6">
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
                  <Link href="/profiles" className="flex items-center group">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="text-gray-700 group-hover:text-primary transition">
                      Profile
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
