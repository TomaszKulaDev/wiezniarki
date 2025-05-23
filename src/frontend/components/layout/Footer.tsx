"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white pt-8">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Więźniarki</h3>
            <p className="text-sm text-gray-600 mb-4">
              Projekt integracji społecznej mający na celu wsparcie kobiet
              osadzonych w zakładach karnych w procesie budowania relacji z
              osobami z zewnątrz.
            </p>
            <div className="border-t border-gray-200 pt-4 mt-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Pod honorowym patronatem:
              </h4>
              <div className="flex flex-col space-y-4 mb-3">
                <div className="flex items-center">
                  {/* Oficjalne logo Ministerstwa Sprawiedliwości */}
                  <Image
                    src="/godlo.jpg"
                    alt="Godło Rzeczypospolitej Polskiej"
                    width={32}
                    height={32}
                    className="mr-3 flex-shrink-0"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    Ministerstwo Sprawiedliwości
                  </span>
                </div>
                <div className="flex items-center">
                  {/* Logo Ministerstwa Rodziny, Pracy i Polityki Społecznej */}
                  <Image
                    src="/godlo.jpg"
                    alt="Godło Rzeczypospolitej Polskiej"
                    width={32}
                    height={32}
                    className="mr-3 flex-shrink-0"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    Ministerstwo Rodziny, Pracy i Polityki Społecznej
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Informacje</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary transition"
                >
                  O projekcie
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Najczęściej zadawane pytania
                </Link>
              </li>
              <li>
                <Link
                  href="/regulamin"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Mapa strony
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Dla użytkowników</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/profiles"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Profile kobiet osadzonych
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Jak działa platforma
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Historie sukcesu
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Bezpieczeństwo
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Pomoc
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Kontakt</h3>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>Biuro Projektu &quot;Więźniarki&quot;</p>
              <p>ul. Przykładowa 123</p>
              <p>00-001 Warszawa</p>
              <p className="mt-3">
                <a
                  href="mailto:kontakt@wiezniarki.gov.pl"
                  className="text-primary hover:underline"
                >
                  kontakt@wiezniarki.gov.pl
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* EU funding banner */}
      <div className="bg-white py-6 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Projekt współfinansowany ze środków Unii Europejskiej
              </p>
              <p className="text-xs text-gray-600">
                w ramach Europejskiego Funduszu Społecznego na lata 2021-2027
              </p>
            </div>
            <div className="flex items-center">
              {/* Oficjalne logo Unii Europejskiej */}
              <svg
                width="100"
                height="60"
                viewBox="0 0 169.54 103.75"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <style>{`.cls-1{fill:#fff;}.cls-2{fill:#164194;}.cls-3{fill:#ffed00;}.cls-4{fill:#1d1d1b;}`}</style>
                </defs>
                <rect className="cls-1" width="169.54" height="103.75" />
                <rect
                  className="cls-2"
                  x="37.63"
                  y="2.1"
                  width="93.78"
                  height="62.53"
                />
                <polygon
                  className="cls-3"
                  points="82.52 15.73 84.5 14.29 86.48 15.73 85.72 13.4 87.73 11.95 85.26 11.95 84.5 9.59 83.75 11.95 81.26 11.95 83.27 13.4 82.52 15.73"
                />
                <polygon
                  className="cls-3"
                  points="72.28 18.48 74.26 17.04 76.24 18.48 75.48 16.15 77.49 14.7 75.02 14.7 74.25 12.33 73.5 14.71 71.03 14.7 73.03 16.15 72.28 18.48"
                />
                <polygon
                  className="cls-3"
                  points="66.76 19.85 66 22.22 63.53 22.21 65.53 23.66 64.78 25.99 66.76 24.55 68.74 25.99 67.99 23.66 70 22.21 67.52 22.21 66.76 19.85"
                />
                <polygon
                  className="cls-3"
                  points="64.02 34.77 65.99 36.22 65.24 33.89 67.25 32.44 64.78 32.44 64.02 30.07 63.25 32.45 60.78 32.44 62.78 33.89 62.03 36.22 64.02 34.77"
                />
                <polygon
                  className="cls-3"
                  points="67.52 42.7 66.76 40.34 66.01 42.7 63.53 42.7 65.53 44.15 64.78 46.48 66.76 45.04 68.74 46.48 67.99 44.15 70 42.7 67.52 42.7"
                />
                <polygon
                  className="cls-3"
                  points="75.03 50.21 74.27 47.85 73.51 50.22 71.03 50.21 73.04 51.66 72.29 53.99 74.27 52.55 76.25 53.99 75.5 51.66 77.51 50.21 75.03 50.21"
                />
                <polygon
                  className="cls-3"
                  points="85.25 52.93 84.5 50.56 83.74 52.93 81.26 52.93 83.27 54.37 82.52 56.71 84.5 55.27 86.48 56.71 85.72 54.37 87.74 52.93 85.25 52.93"
                />
                <polygon
                  className="cls-3"
                  points="95.48 50.21 94.72 47.85 93.96 50.22 91.49 50.21 93.5 51.66 92.75 53.99 94.72 52.55 96.71 53.99 95.95 51.66 97.97 50.21 95.48 50.21"
                />
                <polygon
                  className="cls-3"
                  points="103 42.7 102.23 40.34 101.48 42.7 99 42.7 101.01 44.15 100.25 46.48 102.23 45.04 104.22 46.48 103.46 44.15 105.47 42.7 103 42.7"
                />
                <polygon
                  className="cls-3"
                  points="108.19 32.41 105.71 32.41 104.96 30.05 104.19 32.41 101.72 32.41 103.73 33.86 102.97 36.2 104.96 34.75 106.94 36.2 106.18 33.86 108.19 32.41"
                />
                <polygon
                  className="cls-3"
                  points="100.25 25.96 102.23 24.52 104.22 25.96 103.46 23.62 105.47 22.19 103 22.19 102.23 19.81 101.48 22.19 99 22.19 101.01 23.62 100.25 25.96"
                />
                <polygon
                  className="cls-3"
                  points="94.75 12.33 94 14.71 91.52 14.7 93.53 16.15 92.78 18.49 94.77 17.04 96.74 18.49 95.99 16.15 97.99 14.7 95.52 14.7 94.75 12.33"
                />
                <path
                  className="cls-4"
                  d="M9,97.55a7.36,7.36,0,0,1-2.75-.46,5.12,5.12,0,0,1-1.91-1.3,5.33,5.33,0,0,1-1.11-2,8.33,8.33,0,0,1-.33-2.43V81.59H5.76v9.5A6.06,6.06,0,0,0,6,92.89a3.29,3.29,0,0,0,.67,1.23,2.67,2.67,0,0,0,1,.7A3.81,3.81,0,0,0,9,95a4,4,0,0,0,1.36-.22,2.77,2.77,0,0,0,1.05-.7,3.21,3.21,0,0,0,.67-1.23,6.19,6.19,0,0,0,.24-1.82v-9.5H15.2v9.79a7.76,7.76,0,0,1-.38,2.49,5.49,5.49,0,0,1-1.12,2,5.07,5.07,0,0,1-1.93,1.3A7.45,7.45,0,0,1,9,97.55Z"
                />
                <path
                  className="cls-4"
                  d="M18.6,86.11a19.79,19.79,0,0,1,2-.43,18.74,18.74,0,0,1,2.8-.2,6.59,6.59,0,0,1,2.41.39A3.73,3.73,0,0,1,27.36,87a4.22,4.22,0,0,1,.81,1.71,9,9,0,0,1,.24,2.2v6.64H25.73V91.36a7.89,7.89,0,0,0-.13-1.61,2.83,2.83,0,0,0-.4-1.08,1.65,1.65,0,0,0-.77-.61,3.19,3.19,0,0,0-1.18-.2,10,10,0,0,0-1.09.07l-.83.11v9.53H18.6Z"
                />
                <path
                  className="cls-4"
                  d="M34.71,82.27a1.56,1.56,0,0,1-.5,1.22,1.65,1.65,0,0,1-1.17.45,1.73,1.73,0,0,1-1.2-.45,1.52,1.52,0,0,1-.49-1.22A1.61,1.61,0,0,1,31.84,81a1.73,1.73,0,0,1,1.2-.45,1.65,1.65,0,0,1,1.17.45A1.6,1.6,0,0,1,34.71,82.27Zm-.29,15.26H31.69V85.73h2.73Z"
                />
                <path
                  className="cls-4"
                  d="M41.68,85.21a6.54,6.54,0,0,1,2.28.34,3.67,3.67,0,0,1,1.48.94A3.49,3.49,0,0,1,46.23,88a7.68,7.68,0,0,1,.23,1.91V97c-.42.09-1.05.2-1.9.33a18.5,18.5,0,0,1-2.88.19,9.06,9.06,0,0,1-1.94-.2,4.12,4.12,0,0,1-1.5-.66,3.06,3.06,0,0,1-1-1.17,4,4,0,0,1-.35-1.78A3.53,3.53,0,0,1,37.28,92a3.37,3.37,0,0,1,1.08-1.14,4.92,4.92,0,0,1,1.56-.63,9,9,0,0,1,1.87-.19,6.12,6.12,0,0,1,.94,0,9.43,9.43,0,0,1,1.06.2v-.45a3.49,3.49,0,0,0-.11-.91,1.92,1.92,0,0,0-.39-.75,1.86,1.86,0,0,0-.75-.51,3.27,3.27,0,0,0-1.16-.18,10.2,10.2,0,0,0-1.74.13,8,8,0,0,0-1.28.32L38,85.75a9.76,9.76,0,0,1,1.51-.36A11.08,11.08,0,0,1,41.68,85.21Zm.23,10.15a10.17,10.17,0,0,0,1.91-.13v-3a4.67,4.67,0,0,0-.65-.13,6.54,6.54,0,0,0-1.91,0,2.72,2.72,0,0,0-.84.25,1.51,1.51,0,0,0-.59.5,1.45,1.45,0,0,0-.23.83A1.42,1.42,0,0,0,40.21,95,3.12,3.12,0,0,0,41.91,95.36Z"
                />
                <path
                  className="cls-4"
                  d="M54.92,97.53V81.89H65V84.3H57.8v3.86h6.41v2.37H57.77v4.58h7.74v2.42Z"
                />
                <path
                  className="cls-4"
                  d="M77.17,96.92c-.52.13-1.21.27-2,.41a16.2,16.2,0,0,1-2.78.22A6.25,6.25,0,0,1,70,97.14,3.78,3.78,0,0,1,68.48,96a4.62,4.62,0,0,1-.83-1.73,9,9,0,0,1-.24-2.2V85.48h2.73v6.18a5,5,0,0,0,.55,2.71,2.17,2.17,0,0,0,1.93.81h1a5.59,5.59,0,0,0,.82-.12V85.52h2.73Z"
                />
                <path
                  className="cls-4"
                  d="M87.23,88.19A7,7,0,0,0,86.3,88a7.19,7.19,0,0,0-1.39-.13,5.55,5.55,0,0,0-1,.09,5.62,5.62,0,0,0-.71.16v9.46H80.51V86.29a13.76,13.76,0,0,1,2-.55,12.13,12.13,0,0,1,2.62-.26h.64a3,3,0,0,1,.72.09l.7.14.54.14Z"
                />
                <path
                  className="cls-4"
                  d="M100.14,91.36a7.61,7.61,0,0,1-.41,2.55,5.56,5.56,0,0,1-1.15,2,5.14,5.14,0,0,1-1.79,1.27,6.13,6.13,0,0,1-4.61,0,5.14,5.14,0,0,1-1.79-1.27,5.74,5.74,0,0,1-1.16-2,7.92,7.92,0,0,1,0-5.09,5.73,5.73,0,0,1,1.18-1.95,5.08,5.08,0,0,1,1.79-1.25,5.75,5.75,0,0,1,2.28-.44,6,6,0,0,1,2.29.44,5.08,5.08,0,0,1,1.79,1.25,5.77,5.77,0,0,1,1.16,1.95A7.36,7.36,0,0,1,100.14,91.36Zm-2.8,0a4.64,4.64,0,0,0-.75-2.78,2.68,2.68,0,0,0-3.76-.46,2.86,2.86,0,0,0-.46.46,4.51,4.51,0,0,0-.76,2.78,4.61,4.61,0,0,0,.76,2.82,2.66,2.66,0,0,0,3.73.49,2.84,2.84,0,0,0,.49-.49A4.76,4.76,0,0,0,97.34,91.36Z"
                />
                <path
                  className="cls-4"
                  d="M113.45,91.64a8.31,8.31,0,0,1-.35,2.48,5.52,5.52,0,0,1-1,1.94,4.51,4.51,0,0,1-1.64,1.26,5.75,5.75,0,0,1-3.75.25,4.74,4.74,0,0,1-1.15-.45v4.58h-2.73V86.11c.55-.15,1.24-.29,2-.43a17,17,0,0,1,2.57-.2,6.91,6.91,0,0,1,2.51.43,5.25,5.25,0,0,1,1.88,1.23,5.5,5.5,0,0,1,1.2,1.94A7.72,7.72,0,0,1,113.45,91.64Zm-2.8,0a4.43,4.43,0,0,0-.82-2.84,3.18,3.18,0,0,0-2.65-1h-.8a4.54,4.54,0,0,0-.82.14v6.75a4.12,4.12,0,0,0,1,.46,3.71,3.71,0,0,0,1.28.22,2.45,2.45,0,0,0,2.18-1,4.76,4.76,0,0,0,.63-2.69Z"
                />
                <path
                  className="cls-4"
                  d="M115.48,91.41a7.27,7.27,0,0,1,.47-2.73,5.61,5.61,0,0,1,1.23-2,5.07,5.07,0,0,1,1.76-1.17,5.25,5.25,0,0,1,2-.4,4.89,4.89,0,0,1,3.8,1.51,6.58,6.58,0,0,1,1.36,4.52v1h-7.8a3.08,3.08,0,0,0,1,2.2,3.8,3.8,0,0,0,2.58.78A8.58,8.58,0,0,0,123.7,95a8.41,8.41,0,0,0,1.3-.38l.36,2.23a6.62,6.62,0,0,1-.62.24c-.27.08-.57.15-.91.22a9.89,9.89,0,0,1-1.09.17,9.66,9.66,0,0,1-1.2.07,7.11,7.11,0,0,1-2.7-.46,5.14,5.14,0,0,1-1.9-1.29,5.37,5.37,0,0,1-1.11-1.94A8.11,8.11,0,0,1,115.48,91.41Zm7.92-1.22a3.89,3.89,0,0,0-.15-1.07,2.67,2.67,0,0,0-.47-.88,2,2,0,0,0-.74-.58,2.65,2.65,0,0,0-2.16,0,2.43,2.43,0,0,0-.8.62,2.78,2.78,0,0,0-.51.88,4.29,4.29,0,0,0-.24,1Z"
                />
                <path
                  className="cls-4"
                  d="M127.37,101.72a5.48,5.48,0,0,1-.82,0,3.39,3.39,0,0,1-.94-.22l.37-2.23a4.38,4.38,0,0,0,1.19.16,1.51,1.51,0,0,0,1.33-.56,2.89,2.89,0,0,0,.39-1.65V85.73h2.73V97.21a4.66,4.66,0,0,1-1.1,3.41A4.24,4.24,0,0,1,127.37,101.72Zm4.54-19.45a1.56,1.56,0,0,1-.5,1.22,1.65,1.65,0,0,1-1.17.45,1.73,1.73,0,0,1-1.2-.45,1.52,1.52,0,0,1-.49-1.22A1.61,1.61,0,0,1,129,81a1.73,1.73,0,0,1,1.2-.45,1.65,1.65,0,0,1,1.17.45A1.6,1.6,0,0,1,131.91,82.27Z"
                />
                <path
                  className="cls-4"
                  d="M137.91,95.29a3.42,3.42,0,0,0,1.58-.26.92.92,0,0,0,.5-.89,1.16,1.16,0,0,0-.53-1,8.76,8.76,0,0,0-1.75-.83,13.71,13.71,0,0,1-1.37-.58,4.53,4.53,0,0,1-1.07-.71,2.82,2.82,0,0,1-.71-1,3.6,3.6,0,0,1-.26-1.41,3.08,3.08,0,0,1,1.2-2.56,5.09,5.09,0,0,1,3.25-.94,10.34,10.34,0,0,1,2,.19,9.91,9.91,0,0,1,1.42.38l-.49,2.21a6.7,6.7,0,0,0-1.15-.37,6.84,6.84,0,0,0-1.63-.17,2.74,2.74,0,0,0-1.35.28.93.93,0,0,0-.52.87,1.3,1.3,0,0,0,.1.52,1,1,0,0,0,.35.41,3.86,3.86,0,0,0,.65.39c.27.12.61.26,1,.39a15.91,15.91,0,0,1,1.64.71,4.37,4.37,0,0,1,1.12.79,2.53,2.53,0,0,1,.64,1,3.85,3.85,0,0,1,.21,1.35,2.9,2.9,0,0,1-1.26,2.56,6.2,6.2,0,0,1-3.57.87,10.1,10.1,0,0,1-2.51-.26,10.27,10.27,0,0,1-1.33-.42l.48-2.28A12.31,12.31,0,0,0,136,95,7.67,7.67,0,0,0,137.91,95.29Z"
                />
                <path
                  className="cls-4"
                  d="M147.86,90.36,149,89.2,150.12,88l1.07-1.2c.34-.38.63-.72.87-1h3.22c-.75.84-1.54,1.71-2.38,2.61s-1.67,1.79-2.51,2.64a15.31,15.31,0,0,1,1.42,1.37,21.2,21.2,0,0,1,1.44,1.7c.47.6.91,1.21,1.31,1.81a18.89,18.89,0,0,1,1,1.67H152.4a13.39,13.39,0,0,0-.94-1.47,16.32,16.32,0,0,0-1.14-1.49c-.4-.48-.82-.94-1.24-1.36a10,10,0,0,0-1.24-1.1v5.42h-2.73V82.36l2.73-.45Z"
                />
                <path
                  className="cls-4"
                  d="M161.35,85.21a6.54,6.54,0,0,1,2.28.34,3.67,3.67,0,0,1,1.48.94A3.49,3.49,0,0,1,165.9,88a6.86,6.86,0,0,1,.24,1.91V97c-.42.09-1.06.2-1.91.33a18.5,18.5,0,0,1-2.88.19,9.06,9.06,0,0,1-1.94-.2,4.3,4.3,0,0,1-1.5-.66,3.15,3.15,0,0,1-1-1.17,4,4,0,0,1-.35-1.78A3.43,3.43,0,0,1,157,92,3.34,3.34,0,0,1,158,90.88a4.67,4.67,0,0,1,1.57-.63,8.9,8.9,0,0,1,1.86-.19,6.24,6.24,0,0,1,.95,0,9.43,9.43,0,0,1,1.06.2v-.45a3.5,3.5,0,0,0-.12-.91,1.8,1.8,0,0,0-.39-.75,1.86,1.86,0,0,0-.75-.51,3.27,3.27,0,0,0-1.16-.18,10,10,0,0,0-1.73.13A8.11,8.11,0,0,0,158,88l-.34-2.21a9.76,9.76,0,0,1,1.51-.36A12.91,12.91,0,0,1,161.35,85.21Zm.23,10.17a10.28,10.28,0,0,0,1.92-.13v-3a6.62,6.62,0,0,0-1.6-.2,5.62,5.62,0,0,0-.92.07,2.66,2.66,0,0,0-.83.25,1.46,1.46,0,0,0-.6.5,1.7,1.7,0,0,0,.38,2.17,3.24,3.24,0,0,0,1.65.32Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary footer with links */}
      <div className="bg-accent py-6 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
            <ul className="flex flex-wrap gap-6 text-xs">
              <li>
                <Link
                  href="/declaration"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Deklaracja dostępności
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Polityka cookies
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary transition flex items-center"
                  aria-label="Biuletyn Informacji Publicznej"
                >
                  <Image
                    src="/bip_simple.svg"
                    alt="BIP - Biuletyn Informacji Publicznej"
                    width={40}
                    height={18}
                    className="h-5 w-auto"
                  />
                </a>
              </li>
            </ul>
            <div className="text-xs text-gray-500">
              <p>
                © {new Date().getFullYear()} Więźniarki. Wszelkie prawa
                zastrzeżone.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Więźniarki.pl to oficjalny projekt wspierający resocjalizację i
              reintegrację społeczną
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
