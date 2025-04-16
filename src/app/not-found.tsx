import Link from "next/link";
import MainLayout from "./MainLayout";

export default function NotFound() {
  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            404: Nie znaleziono strony
          </h1>
          <p className="text-gray-600">
            Strona, której szukasz nie została odnaleziona
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-blue-50 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Strona nie została znaleziona
              </h2>
              <p className="text-gray-600 mb-8">
                Niestety, strona której szukasz nie istnieje lub została
                przeniesiona. Sprawdź dokładnie, czy adres URL został wpisany
                poprawnie i spróbuj ponownie.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded hover:bg-primary-dark transition shadow-sm"
                  style={{
                    backgroundColor: "#1e50a0",
                    color: "white",
                  }}
                >
                  Wróć do strony głównej
                </Link>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-primary font-semibold py-3 px-6 rounded hover:bg-gray-50 transition shadow-sm"
                  style={{
                    backgroundColor: "white",
                    color: "#1e50a0",
                    border: "1px solid #1e50a0",
                  }}
                >
                  Skontaktuj się z nami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
