// To jest Server Component (brak dyrektywy "use client")
import { Profile } from "@/backend/models/Profile";
import MainLayout from "../../MainLayout";
import ProfileClientContent from "./ProfileClientContent"; // Będziemy musieli stworzyć ten komponent
import Link from "next/link"; // Dodaj import Link

// Funkcja do pobierania danych po stronie serwera
async function getProfile(id: string): Promise<Profile | null> {
  try {
    // Używamy absolutnego URL lub API route
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/profiles/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Nie udało się pobrać profilu");
    }

    return await response.json();
  } catch (error) {
    console.error("Błąd podczas pobierania profilu:", error);
    return null;
  }
}

// Główny komponent strony jako Server Component
export default async function ProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // W Server Component możemy bezpośrednio używać params.id
  const { id } = params;

  // Pobieramy dane profilu po stronie serwera
  const profile = await getProfile(id);

  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {profile
              ? `${profile.firstName} ${profile.lastName}`
              : "Profil uczestniczki"}
          </h1>
          <p className="text-gray-600">
            Szczegóły uczestniczki programu resocjalizacji społecznej
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {profile ? (
            // Przekazujemy pobrane dane do komponentu klienckiego
            <ProfileClientContent initialProfile={profile} />
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p>
                Nie znaleziono profilu lub wystąpił błąd podczas jego
                pobierania.
              </p>
              <Link
                href="/profiles"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Wróć do listy profili
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
