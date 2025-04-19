"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/frontend/components/admin/AdminLayout";
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
  const profileId = params.id as string;
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
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (currentUser && currentUser.role !== "admin") {
    return null; // Zabezpieczenie przed renderowaniem strony dla nie-administratorów
  }

  if (!profile) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Szczegóły profilu: {profile.firstName} {profile.lastName}
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/admin/profiles")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Powrót do listy
            </button>
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edytuj profil
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolumna lewa - zdjęcie i podstawowe informacje */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-64 w-full">
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
                      className="h-24 w-24 text-gray-400"
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
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL zdjęcia
                      </label>
                      <input
                        type="text"
                        name="photoUrl"
                        value={formData.photoUrl || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-gray-600">{profile.age} lat</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informacje o powiązanym użytkowniku */}
            {profile.user && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Informacje o koncie
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email: </span>
                    {profile.user.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Rola: </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs 
                      ${
                        profile.user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : profile.user.role === "moderator"
                          ? "bg-yellow-100 text-yellow-800"
                          : profile.user.role === "prisoner"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {profile.user.role}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status: </span>
                    {profile.user.locked ? (
                      <span className="text-red-600">Zablokowany</span>
                    ) : profile.user.active ? (
                      <span className="text-green-600">Aktywny</span>
                    ) : (
                      <span className="text-gray-600">Nieaktywny</span>
                    )}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Zweryfikowany: </span>
                    {profile.user.verified ? (
                      <span className="text-green-600">Tak</span>
                    ) : (
                      <span className="text-red-600">Nie</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={navigateToUser}
                  className="mt-3 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  Zarządzaj kontem
                </button>
              </div>
            )}

            {/* Akcje administracyjne */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-3">
                Akcje administracyjne
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleDeleteProfile}
                  className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  Usuń profil
                </button>
              </div>
            </div>
          </div>

          {/* Kolumna środkowa i prawa - dane profilu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Podstawowe informacje */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Podstawowe informacje
              </h3>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nazwisko
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wiek
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="18"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zakład karny
                    </label>
                    <input
                      type="text"
                      name="facility"
                      value={formData.facility || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status związku
                    </label>
                    <select
                      name="relationshipStatus"
                      value={formData.relationshipStatus || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="single">Singiel/ka</option>
                      <option value="complicated">Skomplikowany</option>
                      <option value="divorced">Rozwiedziony/a</option>
                      <option value="widowed">Wdowiec/Wdowa</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Imię</p>
                    <p className="font-medium">{profile.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nazwisko</p>
                    <p className="font-medium">{profile.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wiek</p>
                    <p className="font-medium">{profile.age} lat</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zakład karny</p>
                    <p className="font-medium">{profile.facility}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status związku</p>
                    <p className="font-medium">
                      {profile.relationshipStatus === "single"
                        ? "Singiel/ka"
                        : profile.relationshipStatus === "complicated"
                        ? "Skomplikowany"
                        : profile.relationshipStatus === "divorced"
                        ? "Rozwiedziony/a"
                        : profile.relationshipStatus === "widowed"
                        ? "Wdowiec/Wdowa"
                        : "Nie określono"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data utworzenia</p>
                    <p className="font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Informacje dodatkowe i zainteresowania - możesz dodać więcej sekcji w zależności od potrzeb */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
