"use client";

import { Profile } from "@/backend/models/Profile";

interface ProfileInterestsProps {
  profile: Profile;
}

export default function ProfileInterests({ profile }: ProfileInterestsProps) {
  return (
    <div className="space-y-8">
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
    </div>
  );
}
