"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import LoginForm from "@/frontend/components/forms/LoginForm";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      setIsSubmitting(true);
      setError("");

      // W przyszłości zastąpić rzeczywistym wywołaniem API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nieprawidłowy email lub hasło");
      }

      const data = await response.json();

      // Zapisz token w localStorage/sessionStorage w zależności od "rememberMe"
      if (formData.rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      // Przekieruj na stronę główną
      router.push("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Wystąpił błąd podczas logowania";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-20 mb-24">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-10 mb-28">
          <h1 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nie masz konta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Zarejestruj się
              </Link>
            </p>

            <Link
              href="/forgot-password"
              className="text-primary hover:underline block mt-2"
            >
              Zapomniałeś hasła?
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
