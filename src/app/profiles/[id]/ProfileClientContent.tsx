"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Profile } from "@/backend/models/Profile";

// Stałe z ustawionymi zdjęciami i ich indeksami dla profili o określonych ID
const PROFILE_IMAGES: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop", // Anna K.
  "2": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop", // Martyna W.
  "3": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop", // Karolina M.
  "4": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop", // Joanna T.
  "5": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop", // Magdalena S.
  "6": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop", // Natalia R.
  "7": "https://images.unsplash.com/photo-1554727242-741c14fa561c?q=80&w=1974&auto=format&fit=crop", // Katarzyna D.
  "8": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1974&auto=format&fit=crop", // Monika P.
};

// Komponent kliencki obsługujący interaktywne elementy
export default function ProfileClientContent({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const [profile] = useState<Profile>(initialProfile);
  const [showContactForm, setShowContactForm] = useState(false);

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

  // Pobieranie odpowiedniego zdjęcia lub używanie tego z profilu
  const getProfileImage = () => {
    if (profile.id in PROFILE_IMAGES) {
      return PROFILE_IMAGES[profile.id];
    }
    return profile.photoUrl || "";
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary"
            >
              <svg
                className="w-3 h-3 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Strona główna
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Link
                href="/profiles"
                className="ml-1 text-sm font-medium text-gray-500 hover:text-primary md:ml-2"
              >
                Profile uczestniczek
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-primary md:ml-2">
                {profile.firstName} {profile.lastName}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Górny panel z podstawowymi informacjami */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-200">
            {getProfileImage() !== "" ? (
              <Image
                src={getProfileImage()}
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
                className="mt-4 md:mt-0 bg-white text-primary py-2 px-6 rounded-lg border border-primary hover:bg-primary hover:text-white transition-colors duration-300"
                style={{
                  backgroundColor: "white",
                  color: "#1e50a0",
                  borderColor: "#1e50a0",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e50a0";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#1e50a0";
                  e.currentTarget.style.borderColor = "#1e50a0";
                }}
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
                  <p className="text-gray-500">Przewidywana data zwolnienia:</p>
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
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Zainteresowania i hobby</h2>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Zainteresowania</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
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
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pozostałe sekcje profilu... */}
          {/* (Przenieś pozostałą część oryginalnego komponentu tutaj) */}
        </div>

        {/* Prawa kolumna */}
        <div className="space-y-8">
          {/* (Przenieś pozostałą prawą kolumnę oryginalnego komponentu tutaj) */}
        </div>
      </div>

      {/* Formularz kontaktowy */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
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
                className="flex-1 text-center py-2 px-4 rounded-lg border transition-colors duration-300"
                style={{
                  backgroundColor: "white",
                  color: "#1e50a0",
                  borderColor: "#1e50a0",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e50a0";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#1e50a0";
                  e.currentTarget.style.borderColor = "#1e50a0";
                }}
              >
                Zaloguj się
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2 px-4 rounded-lg border transition-colors duration-300"
                style={{
                  backgroundColor: "white",
                  color: "#1e50a0",
                  borderColor: "#1e50a0",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e50a0";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#1e50a0";
                  e.currentTarget.style.borderColor = "#1e50a0";
                }}
              >
                Zarejestruj się
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
