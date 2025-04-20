"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import Image from "next/image";
import { Profile } from "@/backend/models/Profile";

// Rozszerzmy interfejs profilu o informacje o użytkowniku
interface ProfileDetails extends Profile {
  user?: {
    id: string;
    email: string;
    role: string;
    active: boolean;
    locked: boolean;
    verified: boolean;
  };
}

export default function AdminProfileDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params?.id as string;
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();

  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formularz edycji
  const [formData, setFormData] = useState<Partial<ProfileDetails>>({});

  // Przekieruj, jeśli użytkownik nie jest administratorem
  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  // Pobierz dane profilu
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/profiles/${profileId}`);

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania szczegółów profilu");
        }

        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } catch (error) {
        console.error("Błąd pobierania szczegółów profilu:", error);
        setError(
          "Wystąpił błąd podczas pobierania szczegółów profilu. Spróbuj odświeżyć stronę."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.role === "admin" && profileId) {
      fetchProfileDetails();
    }
  }, [currentUser, profileId]);

  // Obsługa zmian w formularzu
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Obsługa zmian w formularzach zagnieżdżonych
  const handleNestedChange = (
    category: "contactPreferences" | "matchingPreferences",
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...((prev[category] as any) || {}),
        [field]: value,
      },
    }));
  };

  // Zapisz zmiany
  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas aktualizacji profilu");
      }

      const updatedProfile = await response.json();
      setProfile((prevProfile) => ({
        ...prevProfile,
        ...updatedProfile,
        user: prevProfile?.user,
      }));
      setSuccess("Profil został pomyślnie zaktualizowany");
      setIsEditing(false);
    } catch (error) {
      console.error("Błąd aktualizacji profilu:", error);
      setError("Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  // Usuń profil
  const handleDeleteProfile = async () => {
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

      router.push("/admin/profiles");
    } catch (error) {
      console.error("Błąd usuwania profilu:", error);
      setError("Wystąpił błąd podczas usuwania profilu. Spróbuj ponownie.");
      setIsLoading(false);
    }
  };

  // Przejdź do użytkownika
  const navigateToUser = () => {
    if (profile?.user) {
      router.push(`/admin/users/${profile.user.id}`);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentUser && currentUser.role !== "admin") {
    return null; // Zabezpieczenie przed renderowaniem strony dla nie-administratorów
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          Profil nie znaleziony
        </h1>
        <p className="text-gray-600 mb-4">
          Nie znaleziono profilu o podanym ID lub wystąpił błąd podczas jego
          pobierania.
        </p>
        <button
          onClick={() => router.push("/admin/profiles")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Wróć do listy profili
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-gray-600">ID: {profile.id}</p>
        </div>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edytuj
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Usuń
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Zapisywanie..." : "Zapisz"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                Anuluj
              </button>
            </>
          )}
          <button
            onClick={() => router.push("/admin/profiles")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Wróć
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Sekcja informacji o profilu */}
        <div className="p-6">
          {/* Wyświetlanie danych lub edycja */}
          {isEditing ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Formularz edycji */}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Wyświetlanie danych */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
