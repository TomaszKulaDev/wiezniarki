// src/app/sitemap/page.tsx
import React from "react";
import MainLayout from "@/app/MainLayout";
import Breadcrumbs from "@/frontend/components/layout/Breadcrumbs";
import Link from "next/link";

export default function Sitemap() {
  const sections = [
    {
      title: "Strony główne",
      links: [
        { href: "/", label: "Strona główna" },
        { href: "/about", label: "O projekcie" },
        { href: "/contact", label: "Kontakt" },
        { href: "/faq", label: "Najczęściej zadawane pytania" },
      ],
    },
    {
      title: "Konto użytkownika",
      links: [
        { href: "/login", label: "Logowanie" },
        { href: "/register", label: "Rejestracja" },
        { href: "/dashboard", label: "Panel użytkownika" },
      ],
    },
    {
      title: "Profile i przeglądanie",
      links: [
        { href: "/profiles", label: "Profile więźniarek" },
        { href: "/units", label: "Jednostki penitencjarne" },
      ],
    },
    {
      title: "Regulaminy i polityki",
      links: [
        { href: "/regulamin", label: "Regulamin" },
        { href: "/privacy", label: "Polityka prywatności" },
        { href: "/cookies", label: "Polityka cookies" },
        { href: "/declaration", label: "Deklaracja dostępności" },
      ],
    },
  ];

  return (
    <MainLayout>
      <Breadcrumbs pageName="Mapa strony" />

      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Mapa strony
          </h1>
          <p className="text-gray-600">
            Kompletny przewodnik po wszystkich stronach serwisu
          </p>
        </div>
      </section>

      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Wszystkie dostępne strony
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                {sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-primary mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="flex items-center text-gray-700 hover:text-primary transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 text-primary"
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
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                Potrzebujesz pomocy?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Jeśli nie możesz znaleźć informacji, których szukasz, lub
                potrzebujesz dodatkowej pomocy, skontaktuj się z nami. Nasz
                zespół jest gotowy, aby odpowiedzieć na Twoje pytania.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-primary hover:underline"
              >
                <span>Przejdź do strony kontaktowej</span>
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
