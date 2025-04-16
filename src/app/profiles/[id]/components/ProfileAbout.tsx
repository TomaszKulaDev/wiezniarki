"use client";

import { Profile } from "@/backend/models/Profile";

interface ProfileAboutProps {
  profile: Profile;
}

export default function ProfileAbout({ profile }: ProfileAboutProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">O mnie</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Biografia</h3>
          <div className="prose max-w-none">
            <p>{profile.bio}</p>
          </div>
        </div>
        {profile.personalityTraits && profile.personalityTraits.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Cechy charakteru</h3>
            <div className="flex flex-wrap gap-2">
              {profile.personalityTraits.map((trait, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
