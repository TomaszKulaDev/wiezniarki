"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import RegisterForm from "@/frontend/components/forms/RegisterForm";
import { useRegisterMutation } from "@/frontend/store/apis/authApi";

export default function RegisterPage() {
  const router = useRouter();

  // Użycie RTK Query mutation zamiast bezpośredniego fetcha
  const [register, { isLoading: isSubmitting, error: registerError }] =
    useRegisterMutation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistrationEnabled, setIsRegistrationEnabled] = useState(true);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  // Sprawdź, czy rejestracja jest włączona
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        setIsCheckingRegistration(true);
        const response = await fetch("/api/settings/registration");

        if (response.ok) {
          const data = await response.json();
          setIsRegistrationEnabled(data.enabled);
        }
      } catch (error) {
        console.error("Błąd sprawdzania statusu rejestracji:", error);
        // W razie błędu pozwalamy na rejestrację
        setIsRegistrationEnabled(true);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  // Efekt obsługujący błędy
  useEffect(() => {
    if (registerError) {
      if ("data" in registerError) {
        // Używamy bardziej precyzyjnego typu
        setError(
          (registerError.data as { message?: string })?.message ||
            "Błąd podczas rejestracji"
        );
      } else {
        setError("Wystąpił błąd podczas rejestracji");
      }
    }
  }, [registerError]);

  const handleRegister = async (formData: {
    email: string;
    password: string;
    confirmPassword: string;
    role: "prisoner" | "partner";
    acceptTerms: boolean;
  }) => {
    if (!isRegistrationEnabled) {
      setError("Rejestracja jest obecnie wyłączona. Spróbuj ponownie później.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    if (!formData.acceptTerms) {
      setError("Musisz zaakceptować regulamin, aby utworzyć konto");
      return;
    }

    try {
      setError("");

      // Wykonanie mutacji register
      await register({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }).unwrap();

      setSuccess(
        "Rejestracja udana! Sprawdź swoją skrzynkę email, aby zweryfikować konto."
      );

      // Przekieruj po 3 sekundach
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      // Obsługa błędów jest w useEffect powyżej
      // Pusty blok catch, ponieważ błędy są obsługiwane w useEffect
    }
  };

  if (isCheckingRegistration) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 mb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-16 mb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mb-20 mt-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Zarejestruj się
          </h1>

          {!isRegistrationEnabled ? (
            <div className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">
                Rejestracja jest obecnie niedostępna
              </p>
              <p className="mt-2">
                System rejestracji nowych użytkowników został tymczasowo
                wyłączony.
              </p>
            </div>
          ) : (
            <>
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
            </>
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
