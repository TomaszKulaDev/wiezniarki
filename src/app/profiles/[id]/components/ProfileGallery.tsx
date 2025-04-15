"use client";

import { useState } from "react";
import Image from "next/image";

// Stałe z ustawionymi zdjęciami i ich indeksami dla profili o określonych ID
const PROFILE_IMAGES: Record<string, string[]> = {
  "1": [
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop&exp=-10",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop&exp=-20",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop&exp=-30",
  ],
  "2": [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&exp=-10",
  ],
  "3": [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&exp=-10",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&exp=-20",
  ],
  "4": [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&exp=-10",
  ],
  "5": [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&exp=-10",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&exp=-20",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&exp=-30",
  ],
  "6": [
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop",
  ],
  "7": [
    "https://images.unsplash.com/photo-1554727242-741c14fa561c?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554727242-741c14fa561c?q=80&w=1974&auto=format&fit=crop&exp=-10",
  ],
  "8": [
    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1974&auto=format&fit=crop&exp=-10",
    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1974&auto=format&fit=crop&exp=-20",
  ],
};

interface ProfileGalleryProps {
  profileId: string;
  photoUrl?: string;
  firstName: string;
  lastName: string;
}

export default function ProfileGallery({
  profileId,
  photoUrl,
  firstName,
  lastName,
}: ProfileGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Pobieranie odpowiednich zdjęć lub używanie tego z profilu
  const getProfileImages = (): string[] => {
    if (profileId in PROFILE_IMAGES) {
      return PROFILE_IMAGES[profileId];
    }
    return photoUrl ? [photoUrl] : [];
  };

  const images = getProfileImages();

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <span className="text-4xl font-bold text-gray-400">
          {firstName.charAt(0)}
          {lastName.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Główne zdjęcie */}
      <div className="relative h-64 md:h-full w-full">
        <Image
          src={images[activeImageIndex]}
          alt={`${firstName} ${lastName}`}
          fill
          style={{ objectFit: "cover" }}
          className="transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
      </div>

      {/* Miniatury zdjęć (jeśli jest więcej niż 1) */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center p-2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                activeImageIndex === index
                  ? "bg-primary"
                  : "bg-white bg-opacity-50 hover:bg-opacity-70"
              } transition-all duration-200`}
              aria-label={`Zdjęcie ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
