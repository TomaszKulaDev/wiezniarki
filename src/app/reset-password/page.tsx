// src/app/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "../MainLayout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const email = searchParams?.get("email") || "";
  const token = searchParams?.get("token") || "";

  useEffect(() => {
    if (!email || !token) {
      setError("Nieprawidłowy link resetowania hasła");
    }
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Wystąpił błąd");
      }

      setSuccess(true);

      // Przekieruj do logowania po 3 sekundach
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Resetowanie hasła
          </h1>
          <p className="text-gray-600">Ustaw nowe hasło do swojego konta</p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 mb-8">
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                <p>
                  Twoje hasło zostało pomyślnie zresetowane. Za chwilę
                  zostaniesz przekierowany do strony logowania.
                </p>
                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-primary-dark transition shadow-sm"
                    style={{
                      backgroundColor: "#1e50a0",
                      color: "white",
                    }}
                  >
                    Przejdź do strony logowania
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nowe hasło
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Minimum 8 znaków"
                      disabled={isSubmitting || !email || !token}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Potwierdź nowe hasło
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Powtórz hasło"
                      disabled={isSubmitting || !email || !token}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    style={{
                      backgroundColor: "#1e50a0",
                      color: "white",
                    }}
                    disabled={isSubmitting || !email || !token}
                  >
                    {isSubmitting ? "Przetwarzanie..." : "Zmień hasło"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-primary hover:underline text-sm"
                    style={{ color: "#1e50a0" }}
                  >
                    Wróć do strony logowania
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
