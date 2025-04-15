"use client";

import { Profile } from "@/backend/models/Profile";

interface ProfileGoalsProps {
  profile: Profile;
}

export default function ProfileGoals({ profile }: ProfileGoalsProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Cele i plany na przyszłość</h2>
        <div className="prose max-w-none">
          <p>{profile.goals}</p>
        </div>

        {profile.matchingPreferences && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Czego szukam</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {profile.matchingPreferences.lookingFor && (
                <div className="mb-2">
                  <span className="font-medium">Rodzaj relacji: </span>
                  <span className="capitalize">
                    {profile.matchingPreferences.lookingFor === "relationship"
                      ? "romantyczna"
                      : profile.matchingPreferences.lookingFor === "friendship"
                      ? "przyjaźń"
                      : profile.matchingPreferences.lookingFor === "penpal"
                      ? "korespondencja"
                      : "inna"}
                  </span>
                </div>
              )}

              {profile.matchingPreferences.locationPreference &&
                profile.matchingPreferences.locationPreference.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium">
                      Preferowana lokalizacja:{" "}
                    </span>
                    <span>
                      {profile.matchingPreferences.locationPreference.join(
                        ", "
                      )}
                    </span>
                  </div>
                )}

              <p className="text-gray-600 mt-2">
                Szukam osób, które pomogą mi w procesie reintegracji społecznej
                i z którymi będę mogła budować wartościowe relacje oparte na
                wzajemnym szacunku i zrozumieniu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
