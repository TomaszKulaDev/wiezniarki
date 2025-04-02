"use client";

import { useState, useEffect } from "react";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import ProfileCard from "@/frontend/components/profile/ProfileCard";
import ProfileFilter from "@/frontend/components/profile/ProfileFilter";
import { Profile } from "@/backend/models/Profile";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true);
        // W przyszłości zastąpić rzeczywistym wywołaniem API
        const response = await fetch("/api/profiles");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać profili");
        }
        const data = await response.json();
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (err) {
        setError("Wystąpił błąd podczas pobierania profili");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  const handleFilter = (filters: {
    minAge?: number;
    maxAge?: number;
    facility?: string;
    interests?: string[];
    releaseDate?: { before?: Date; after?: Date };
  }) => {
    let filtered = [...profiles];

    if (filters.minAge) {
      filtered = filtered.filter((profile) => profile.age >= filters.minAge!);
    }

    if (filters.maxAge) {
      filtered = filtered.filter((profile) => profile.age <= filters.maxAge!);
    }

    if (filters.facility) {
      filtered = filtered.filter((profile) =>
        profile.facility.toLowerCase().includes(filters.facility!.toLowerCase())
      );
    }

    if (filters.interests && filters.interests.length > 0) {
      filtered = filtered.filter((profile) =>
        filters.interests!.some((interest) =>
          profile.interests.some((profileInterest) =>
            profileInterest.toLowerCase().includes(interest.toLowerCase())
          )
        )
      );
    }

    setFilteredProfiles(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Profile Więźniarek
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <ProfileFilter onFilter={handleFilter} />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-lg text-gray-600">
                  Nie znaleziono profili spełniających podane kryteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
