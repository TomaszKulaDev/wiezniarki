"use client";

import Image from "next/image";
import Link from "next/link";
import { Profile } from "../../../backend/models/Profile";

interface ProfileCardProps {
  profile: Profile;
}

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

export default function ProfileCard({ profile }: ProfileCardProps) {
  // Funkcja pomocnicza do formatowania daty
  const formatDate = (date: Date): string => {
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
    <div className="group relative transform transition-all duration-300 hover:-translate-y-2">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
        <div className="relative h-64 overflow-hidden">
          {getProfileImage() !== "" ? (
            <Image
              src={getProfileImage()}
              alt={`${profile.firstName} ${profile.lastName}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-2xl font-bold text-gray-400">
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white">
              <h3 className="text-xl font-bold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-sm">
                {profile.age} lat • {profile.facility}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 flex-grow">
          <div className="mb-4 flex flex-wrap gap-2">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="text-xs text-gray-500">
                +{profile.interests.length - 3} więcej
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {profile.bio}
          </p>

          {profile.releaseDateEstimate && (
            <p className="text-sm text-gray-500 mb-4">
              Przewidywana data zwolnienia:{" "}
              {formatDate(profile.releaseDateEstimate)}
            </p>
          )}
        </div>
        <div className="px-5 pb-5">
          <Link
            href={`/profiles/${profile.id}`}
            className="block w-full py-2 text-center border rounded-lg transition-colors duration-300"
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
            Zobacz profil
          </Link>
        </div>
      </div>
    </div>
  );
}
