"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/frontend/components/admin/AdminLayout";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import Image from "next/image";

// Interfejs dla profilu
interface ProfileListItem {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  facility: string;
  interests: string[];
  photoUrl?: string;
  createdAt: string;
  userId?: string;
}

export default function AdminProfilesPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [ageRangeFilter, setAgeRangeFilter] = useState("all");
  const [facilities, setFacilities] = useState<string[]>([]);

  // Przekieruj, jeśli użytkownik nie jest administratorem
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Pobierz profile
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/profiles");

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania profili");
        }

        const data = await response.json();
        setProfiles(data);
        setFilteredProfiles(data);

        // Wyciągnij unikalne nazwy zakładów
        const uniqueFacilities = Array.from(
          new Set(data.map((p: ProfileListItem) => p.facility))
        );
        setFacilities(uniqueFacilities.map((facility) => String(facility)));
      } catch (error) {
        console.error("Błąd pobierania profili:", error);
        setError(
          "Wystąpił błąd podczas pobierania profili. Spróbuj odświeżyć stronę."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchProfiles();
    }
  }, [user]);

  // Filtrowanie profili
  useEffect(() => {
    let result = [...profiles];

    // Filtrowanie po wyszukiwaniu
    if (searchTerm) {
      result = result.filter(
        (profile) =>
          profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrowanie po zakładzie karnym
    if (facilityFilter !== "all") {
      result = result.filter((profile) => profile.facility === facilityFilter);
    }

    // Filtrowanie po wieku
    if (ageRangeFilter !== "all") {
      if (ageRangeFilter === "18-30") {
        result = result.filter(
          (profile) => profile.age >= 18 && profile.age <= 30
        );
      } else if (ageRangeFilter === "31-45") {
        result = result.filter(
          (profile) => profile.age >= 31 && profile.age <= 45
        );
      } else if (ageRangeFilter === "46-60") {
        result = result.filter(
          (profile) => profile.age >= 46 && profile.age <= 60
        );
      } else if (ageRangeFilter === "60+") {
        result = result.filter((profile) => profile.age > 60);
      }
    }

    setFilteredProfiles(result);
  }, [profiles, searchTerm, facilityFilter, ageRangeFilter]);

  // Usuń profil
  const handleDeleteProfile = async (profileId: string) => {
    if (
      !confirm(
        "Czy na pewno chcesz usunąć ten profil? Ta operacja jest nieodwracalna."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania profilu");
      }

      // Usuń profil z lokalnego stanu
      setProfiles(profiles.filter((p) => p.id !== profileId));
    } catch (error) {
      console.error("Błąd usuwania profilu:", error);
      alert("Wystąpił błąd podczas usuwania profilu.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (user && user.role !== "admin") {
    return null; // Zabezpieczenie przed renderowaniem strony dla nie-administratorów
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zarządzanie Profilami</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Odśwież dane
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filtry */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wyszukiwanie
              </label>
              <input
                type="text"
                id="search"
                placeholder="Szukaj po imieniu lub nazwisku..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="facility"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zakład karny
              </label>
              <select
                id="facility"
                value={facilityFilter}
                onChange={(e) => setFacilityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Wszystkie zakłady</option>
                {facilities.map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Przedział wiekowy
              </label>
              <select
                id="age"
                value={ageRangeFilter}
                onChange={(e) => setAgeRangeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Wszystkie wieki</option>
                <option value="18-30">18-30 lat</option>
                <option value="31-45">31-45 lat</option>
                <option value="46-60">46-60 lat</option>
                <option value="60+">Powyżej 60 lat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista profili */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48">
                  {profile.photoUrl ? (
                    <Image
                      src={profile.photoUrl}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.firstName} {profile.lastName}, {profile.age} lat
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {profile.facility}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.interests.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        +{profile.interests.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Utworzony:{" "}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/profiles/${profile.id}`)
                        }
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        Szczegóły
                      </button>
                      <button
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">
              Brak profili spełniających kryteria wyszukiwania
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
