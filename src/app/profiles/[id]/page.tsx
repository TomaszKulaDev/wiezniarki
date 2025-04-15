"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import { Profile } from "@/backend/models/Profile";

export default function ProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        // W przyszłości zastąpić rzeczywistym wywołaniem API
        const response = await fetch(`/api/profiles/${params.id}`);
        if (!response.ok) {
          throw new Error("Nie udało się pobrać profilu");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError("Wystąpił błąd podczas pobierania profilu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [params.id]);

  const handleContactRequest = () => {
    setShowContactForm(true);
  };

  // Funkcja pomocnicza do formatowania daty
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e50a0]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error || "Nie znaleziono profilu"}</p>
            <Link
              href="/profiles"
              className="text-[#1e50a0] hover:underline mt-2 inline-block"
            >
              Wróć do listy profili
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Górny panel z podstawowymi informacjami */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-200">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-4xl font-bold text-gray-400">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 md:w-2/3">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {profile.age} lat • {profile.facility}
                    </p>
                  </div>

                  <button
                    onClick={handleContactRequest}
                    className="mt-4 md:mt-0 bg-[#1e50a0] text-white py-2 px-6 rounded-md hover:bg-[#153b7a] transition-colors"
                  >
                    Nawiąż kontakt
                  </button>
                </div>

                <p className="text-gray-700 mb-6">{profile.bio}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Wykształcenie:</p>
                    <p className="font-medium">{profile.education}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status związku:</p>
                    <p className="font-medium capitalize">
                      {profile.relationshipStatus}
                    </p>
                  </div>
                  {profile.releaseDateEstimate && (
                    <div className="col-span-2">
                      <p className="text-gray-500">
                        Przewidywana data zwolnienia:
                      </p>
                      <p className="font-medium">
                        {formatDate(profile.releaseDateEstimate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Szczegóły profilu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lewa kolumna */}
            <div className="md:col-span-2 space-y-8">
              {/* Zainteresowania i hobby */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">
                  Zainteresowania i hobby
                </h2>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Zainteresowania</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-[#1e50a0]/10 text-[#1e50a0] px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Hobby</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cele i ambicje */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Cele i ambicje</h2>
                <p className="text-gray-700">{profile.goals}</p>
              </div>

              {/* Umiejętności */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Umiejętności</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Prawa kolumna */}
            <div className="space-y-8">
              {/* Preferencje kontaktu */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Preferencje kontaktu</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${
                        profile.contactPreferences.email
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {profile.contactPreferences.email ? "✓" : "✗"}
                    </span>
                    <span>Email</span>
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${
                        profile.contactPreferences.letter
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {profile.contactPreferences.letter ? "✓" : "✗"}
                    </span>
                    <span>List</span>
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${
                        profile.contactPreferences.phone
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {profile.contactPreferences.phone ? "✓" : "✗"}
                    </span>
                    <span>Telefon</span>
                  </li>
                </ul>
              </div>

              {/* Cechy osobowości */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Cechy osobowości</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.personalityTraits.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferencje dopasowania */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">
                  Preferencje dopasowania
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Wiek:</p>
                    <p>
                      {profile.matchingPreferences?.minAge || "18"} -{" "}
                      {profile.matchingPreferences?.maxAge || "99"} lat
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Szuka:</p>
                    <p className="capitalize">
                      {profile.matchingPreferences?.lookingFor || "przyjaźni"}
                    </p>
                  </div>
                  {profile.matchingPreferences?.locationPreference && (
                    <div>
                      <p className="text-gray-500 text-sm">
                        Preferowana lokalizacja:
                      </p>
                      <p>
                        {profile.matchingPreferences.locationPreference.join(
                          ", "
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formularz kontaktowy */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Nawiąż kontakt</h2>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="mb-4 text-gray-600">
                Aby nawiązać kontakt z {profile.firstName}, musisz się zalogować
                lub zarejestrować.
              </p>

              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="flex-1 bg-[#1e50a0] text-white text-center py-2 px-4 rounded-md hover:bg-[#153b7a] transition-colors"
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/register"
                  className="flex-1 bg-secondary text-white text-center py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Zarejestruj się
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
