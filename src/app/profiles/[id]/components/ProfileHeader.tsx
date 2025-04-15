"use client";

import { Profile } from "@/backend/models/Profile";
import ProfileGallery from "./ProfileGallery";

interface ProfileHeaderProps {
  profile: Profile;
  onContactRequest: () => void;
}

export default function ProfileHeader({
  profile,
  onContactRequest,
}: ProfileHeaderProps) {
  // Funkcja pomocnicza do formatowania daty
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Funkcja pomocnicza do tłumaczenia statusu związku
  const translateRelationshipStatus = (status: string): string => {
    const translations: Record<string, string> = {
      single: "Wolna",
      complicated: "Skomplikowany",
      divorced: "Rozwiedziona",
      widowed: "Wdowa",
    };
    return translations[status] || status;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-200">
          <ProfileGallery
            profileId={profile.id}
            photoUrl={profile.photoUrl}
            firstName={profile.firstName}
            lastName={profile.lastName}
          />
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
              onClick={onContactRequest}
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
              <p className="font-medium">
                {translateRelationshipStatus(profile.relationshipStatus)}
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
  );
}
