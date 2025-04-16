"use client";

import { useState } from "react";
import MainLayout from "../MainLayout";
import ProfileCard from "@/frontend/components/profile/ProfileCard";
import ProfileFilter from "@/frontend/components/profile/ProfileFilter";
import { useGetProfilesQuery } from "@/frontend/store/apis/profileApi";

export default function ProfilesPage() {
  // Używamy RTK Query zamiast własnego stanu i fetcha
  const [filterParams, setFilterParams] = useState<{
    minAge?: number;
    maxAge?: number;
    facility?: string;
    interests?: string[];
  }>({});

  const {
    data: profiles,
    isLoading,
    error,
  } = useGetProfilesQuery(filterParams);

  const handleFilter = (filters: {
    minAge?: number;
    maxAge?: number;
    facility?: string;
    interests?: string[];
    releaseDate?: { before?: Date; after?: Date };
  }) => {
    // Usuwamy filtrację lokalną, aktualizujemy parametry zapytania API
    const apiFilters = {
      minAge: filters.minAge,
      maxAge: filters.maxAge,
      facility: filters.facility,
      interests: filters.interests,
    };

    setFilterParams(apiFilters);
  };

  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <section className="bg-primary py-5">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Profile Więźniarek
          </h1>
          <p className="text-gray-600">
            Poznaj uczestniczki programu resocjalizacji społecznej
          </p>
        </div>
      </section>

      {/* Główna treść */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <ProfileFilter onFilter={handleFilter} />
            </div>

            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">
                  Wystąpił błąd podczas pobierania profili
                </div>
              ) : !profiles || profiles.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-lg text-gray-600">
                    Nie znaleziono profili spełniających podane kryteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
