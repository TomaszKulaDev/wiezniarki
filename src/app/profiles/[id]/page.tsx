// To jest Server Component (brak dyrektywy "use client")
import { Profile } from "@/backend/models/Profile";
import MainLayout from "../../MainLayout";
import ProfileClientContent from "./ProfileClientContent";
import Link from "next/link";

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

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
  const { id } = await props.params;
  const profile = await getProfile(id);

  return (
    <MainLayout>
      {!profile ? (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow-sm mb-6">
            <h1 className="text-xl font-bold mb-2">Nie znaleziono profilu</h1>
            <p>
              Niestety, nie mogliśmy znaleźć profilu o podanym identyfikatorze.
            </p>
            <div className="mt-4">
              <Link
                href="/profiles"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Wróć do listy profili
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <ProfileClientContent initialProfile={profile} />
      )}
    </MainLayout>
  );
}
