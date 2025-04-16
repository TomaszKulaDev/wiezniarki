"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "../MainLayout";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const email = searchParams?.get("email") || "";
  const code = searchParams?.get("code") || "";

  useEffect(() => {
    async function verifyEmail() {
      if (!email || !code) {
        setError("Nieprawidłowy link weryfikacyjny");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Błąd weryfikacji");
        }

        setVerified(true);

        // Po 3 sekundach przekieruj do logowania
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [email, code, router]);

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Weryfikacja konta
        </h1>

        {isVerifying ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2">Weryfikacja konta w toku...</p>
          </div>
        ) : verified ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <p>Twoje konto zostało pomyślnie zweryfikowane!</p>
            <p className="mt-2">
              Za chwilę zostaniesz przekierowany na stronę logowania.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href="/login" className="text-primary hover:underline">
                Powrót do strony logowania
              </Link>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
