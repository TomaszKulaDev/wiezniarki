"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import RegisterForm from "@/frontend/components/forms/RegisterForm";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (formData: {
    email: string;
    password: string;
    confirmPassword: string;
    role: "prisoner" | "partner";
    acceptTerms: boolean;
  }) => {
    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    if (!formData.acceptTerms) {
      setError("Musisz zaakceptować regulamin");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // W przyszłości zastąpić rzeczywistym wywołaniem API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd podczas rejestracji");
      }

      setSuccess(
        "Rejestracja udana! Sprawdź swoją skrzynkę email, aby zweryfikować konto."
      );

      // Przekieruj po 3 sekundach
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas rejestracji";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-16 mb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mb-20 mt-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Zarejestruj się
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              isSubmitting={isSubmitting}
            />
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Masz już konto?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
