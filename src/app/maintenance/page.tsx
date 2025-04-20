"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MaintenancePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "Przepraszamy za utrudnienia. Pracujemy nad ulepszeniem serwisu i wkrótce wrócimy."
  );
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Sprawdź, czy użytkownik jest już zalogowany jako administrator
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsCheckingAuth(true);
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const userData = await response.json();

          // Jeśli użytkownik jest administratorem, przekieruj do panelu admina
          if (userData && userData.role === "admin") {
            router.push("/admin/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Błąd sprawdzania statusu użytkownika:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  // Pobierz komunikat z trybu konserwacji
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        setIsMessageLoading(true);
        const response = await fetch("/api/settings/maintenance");

        if (response.ok) {
          const data = await response.json();
          if (data.message) {
            setMaintenanceMessage(data.message);
          }
        }
      } catch (error) {
        console.error("Błąd pobierania statusu konserwacji:", error);
      } finally {
        setTimeout(() => {
          setIsMessageLoading(false);
        }, 500);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  // Funkcja do logowania administratora
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Wprowadź adres email");
      return;
    }

    if (!password) {
      setError("Wprowadź hasło");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sprawdź, czy zalogowany użytkownik jest administratorem
        const userResponse = await fetch("/api/auth/me");

        if (userResponse.ok) {
          const userData = await userResponse.json();

          if (userData && userData.role === "admin") {
            // Przekieruj do panelu admina po poprawnym zalogowaniu
            router.push("/admin/dashboard");
          } else {
            setError("Tylko administratorzy mają dostęp podczas konserwacji");
          }
        } else {
          setError("Błąd weryfikacji uprawnień");
        }
      } else {
        setError(data.message || "Nieprawidłowe dane logowania");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas próby logowania");
    } finally {
      setIsLoading(false);
    }
  };

  // Animowany spinner podczas sprawdzania autoryzacji
  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary z-50">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-200 text-sm font-medium">Ładowanie</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Nagłówek strony - taki jak w other pages */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Trwa konserwacja
          </h1>
          <p className="text-gray-600">
            Przepraszamy za utrudnienia. Pracujemy nad ulepszeniem serwisu.
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-6 bg-accent rounded-full flex items-center justify-center relative">
                  <svg
                    className="w-12 h-12 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <div className="absolute -right-1 -top-1 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center text-white animate-bounce-gentle">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-primary mb-4">
                  Przepraszamy za niedogodności
                </h2>

                <div className="bg-accent p-6 rounded-lg mb-6 w-full max-w-2xl shadow-sm">
                  {isMessageLoading ? (
                    <div className="animate-pulse flex space-x-4 py-2">
                      <div className="flex-1 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                      </div>
                    </div>
                  ) : (
                    <p
                      className="text-gray-700 text-lg"
                      id="maintenance-message"
                    >
                      {maintenanceMessage}
                    </p>
                  )}
                </div>

                <div className="max-w-2xl text-center">
                  <p className="text-gray-600 mb-4">
                    Pracujemy nad ulepszeniem naszego serwisu, aby zapewnić
                    lepsze doświadczenie wszystkim użytkownikom. Przepraszamy za
                    wszelkie niedogodności i dziękujemy za cierpliwość.
                  </p>
                </div>
              </div>
            </div>

            {/* Formularz logowania administratora */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-primary mb-4 text-center">
                Dostęp dla administratorów
              </h3>

              <div className="max-w-md mx-auto">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {error && (
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
                        <p className="font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Adres e-mail
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@wiezniarki.pl"
                        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hasło
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        placeholder="••••••••"
                        className="block w-full pr-10 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                        >
                          {showPassword ? (
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-semibold py-3 px-6 rounded hover:bg-primary-dark transition shadow-md"
                    style={{
                      color: "white",
                      backgroundColor: "#1e50a0",
                      border: "2px solid #1e50a0",
                    }}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Zaloguj się"
                    )}
                  </button>
                </form>

                <p className="mt-4 text-xs text-center text-gray-500">
                  Tylko administratorzy mają dostęp do panelu podczas
                  konserwacji.
                </p>
              </div>
            </div>

            {/* CTA na dole strony - podobnie jak na innych stronach */}
            <div className="mt-8 bg-accent rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Masz pytania dotyczące systemu?
              </h3>
              <p className="text-gray-600 mb-4">
                Skontaktuj się z nami na adres e-mail:
              </p>
              <a
                href="mailto:kontakt@wiezniarki.pl"
                className="inline-flex items-center text-primary hover:underline"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
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
                kontakt@wiezniarki.pl
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stopka z zaktualizowanymi linkami */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-3">
              © {new Date().getFullYear()} Więźniarki - Projekt integracji
              społecznej
            </p>
            <div className="flex flex-wrap justify-center space-x-1 sm:space-x-4">
              <Link
                href="/contact"
                className="text-sm text-gray-500 hover:text-primary transition-colors px-2 py-1"
              >
                Kontakt
              </Link>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-primary transition-colors px-2 py-1"
              >
                Polityka prywatności
              </Link>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Link
                href="/regulamin"
                className="text-sm text-gray-500 hover:text-primary transition-colors px-2 py-1"
              >
                Regulamin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animacje CSS */}
      <style jsx>{`
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s infinite;
        }
      `}</style>
    </div>
  );
}
