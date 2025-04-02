"use client";

import Image from "next/image";
import Link from "next/link";
import { Profile } from "../../../backend/models/Profile";

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  // Funkcja pomocnicza do formatowania daty
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 bg-gray-200">
        {profile.photoUrl ? (
          <Image
            src={profile.photoUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            fill
            style={{ objectFit: "cover" }}
            className="transition-opacity duration-300"
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
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          {profile.firstName} {profile.lastName}
        </h3>

        <div className="mb-3 text-sm text-gray-500">
          <p>
            {profile.age} lat • {profile.facility}
          </p>
        </div>

        <div className="mb-4">
          {profile.interests.slice(0, 3).map((interest, index) => (
            <span
              key={index}
              className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm mr-2 mb-2"
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

        <p className="text-gray-600 mb-4 line-clamp-3">{profile.bio}</p>

        {profile.releaseDateEstimate && (
          <p className="text-sm text-gray-500 mb-4">
            Przewidywana data zwolnienia:{" "}
            {formatDate(profile.releaseDateEstimate)}
          </p>
        )}

        <Link
          href={`/profiles/${profile.id}`}
          className="block text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Zobacz profil
        </Link>
      </div>
    </div>
  );
}
