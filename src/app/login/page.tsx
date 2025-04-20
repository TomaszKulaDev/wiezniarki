"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import LoginForm from "@/frontend/components/forms/LoginForm";
import { useLoginMutation } from "@/frontend/store/apis/authApi";
import { useAppDispatch } from "@/frontend/store/hooks";
import { loginSuccess } from "@/frontend/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Użycie RTK Query mutation zamiast bezpośredniego fetcha
  const [
    login,
    { isLoading: isSubmitting, error: loginError, data: loginData },
  ] = useLoginMutation();
  const [error, setError] = useState("");
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Efekt czyszczący błędy
  useEffect(() => {
    if (loginError) {
      if ("data" in loginError) {
        // Używamy bardziej precyzyjnego typu
        setError(
          (loginError.data as { message?: string })?.message ||
            "Nieprawidłowy email lub hasło"
        );
      } else {
        setError("Wystąpił błąd podczas logowania");
      }
    }
  }, [loginError]);

  // Efekt po pomyślnym logowaniu
  useEffect(() => {
    if (loginData) {
      dispatch(
        loginSuccess({
          id: loginData.user.id,
          email: loginData.user.email,
          role: loginData.user.role,
        })
      );
      router.push("/");
    }
  }, [loginData, dispatch, router]);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch("/api/settings/maintenance");
        if (response.ok) {
          const { enabled } = await response.json();
          setIsMaintenance(enabled);
        }
      } catch (error) {
        console.error("Błąd sprawdzania trybu konserwacji:", error);
      }
    };

    checkMaintenance();
  }, []);

  const handleLogin = async (formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      setError("");

      // Wykonanie mutacji login
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Zapisz tokeny w localStorage/sessionStorage w zależności od "rememberMe"
      if (formData.rememberMe) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
      } else {
        sessionStorage.setItem("accessToken", result.accessToken);
        sessionStorage.setItem("refreshToken", result.refreshToken);
      }
    } catch {
      // Obsługa błędów jest w useEffect powyżej
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-20 mb-24">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-10 mb-28">
          <h1 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h1>

          {isMaintenance && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
              <p className="text-sm">
                <span className="font-medium">Uwaga:</span> Strona jest obecnie
                w trybie konserwacji. Tylko administratorzy mają do niej dostęp.
              </p>
            </div>
          )}

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
