// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import MainLayout from "../MainLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Wystąpił błąd");
      }

      setSuccess(true);
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
            Odzyskiwanie hasła
          </h1>
          <p className="text-gray-600">Proces resetowania dostępu do konta</p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 mb-8">
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                <p>
                  Jeśli konto o podanym adresie email istnieje, wkrótce
                  otrzymasz wiadomość z instrukcjami dotyczącymi resetowania
                  hasła.
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
                    Wróć do strony logowania
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

                <p className="mb-6 text-gray-600">
                  Podaj adres email powiązany z Twoim kontem, a my wyślemy Ci
                  instrukcje resetowania hasła.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Adres email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="twoj@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    style={{
                      backgroundColor: "#1e50a0",
                      color: "white",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Wysyłanie..." : "Wyślij link resetujący"}
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
