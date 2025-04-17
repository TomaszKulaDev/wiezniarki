"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import DashboardSidebar from "@/frontend/components/dashboard/DashboardSidebar";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import {
  useGetProfileByIdQuery,
  useUpdateProfileMutation,
  useCreateProfileMutation,
} from "@/frontend/store/apis/profileApi";
import { useUpdateProfileLinkMutation } from "@/frontend/store/apis/authApi";
import { Profile } from "@/backend/models/Profile";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sprawdzamy czy użytkownik ma już profil
  const { data: profile, isLoading: profileLoading } = useGetProfileByIdQuery(
    user?.profileId || "none",
    { skip: !user?.profileId }
  );

  const [formData, setFormData] = useState<Partial<Profile>>({
    firstName: "",
    lastName: "",
    age: 0,
    facility: "",
    interests: [],
    skills: [],
    bio: "",
    education: "",
    goals: "",
    contactPreferences: {
      email: true,
      letter: false,
      phone: false,
    },
    relationshipStatus: "single",
    personalityTraits: [],
    hobbies: [],
  });

  // Hooki RTK Query
  const [updateProfile] = useUpdateProfileMutation();
  const [createProfile] = useCreateProfileMutation();
  const [updateProfileLink] = useUpdateProfileLinkMutation();

  // Inicjalizacja formularza danymi z profilu
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        facility: profile.facility,
        interests: profile.interests,
        skills: profile.skills,
        bio: profile.bio,
        education: profile.education,
        goals: profile.goals,
        contactPreferences: profile.contactPreferences,
        relationshipStatus: profile.relationshipStatus,
        personalityTraits: profile.personalityTraits,
        hobbies: profile.hobbies,
      });
    }
  }, [profile]);

  // Handler do aktualizacji pól formularza
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

  // Handler dla zainteresowań (dodawanie/usuwanie tagów)
  const handleInterestChange = (interest: string, action: "add" | "remove") => {
    if (action === "add") {
      setFormData((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), interest],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        interests: (prev.interests || []).filter((i) => i !== interest),
      }));
    }
  };

  // Handler dla umiejętności
  const handleSkillChange = (skill: string, action: "add" | "remove") => {
    if (action === "add") {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skills: (prev.skills || []).filter((s) => s !== skill),
      }));
    }
  };

  // Zapisywanie zmian
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (profile) {
        // Aktualizacja istniejącego profilu
        await updateProfile({
          id: profile.id,
          ...formData,
        }).unwrap();
        setIsEditing(false);
      } else if (user) {
        // Przygotuj dane profilu, zapewniając że wszystkie wymagane pola są zdefiniowane
        const profileDataToCreate: Omit<
          Profile,
          "id" | "createdAt" | "updatedAt"
        > = {
          firstName: formData.firstName || "", // Zapewnij niepustą wartość
          lastName: formData.lastName || "", // Zapewnij niepustą wartość
          age: formData.age || 18, // Zapewnij domyślny wiek
          facility: formData.facility || "", // Zapewnij niepustą wartość
          interests: formData.interests || [], // Zapewnij pustą tablicę
          skills: formData.skills || [], // Zapewnij pustą tablicę
          bio: formData.bio || "", // Zapewnij niepustą wartość
          education: formData.education || "", // Zapewnij niepustą wartość
          goals: formData.goals || "", // Zapewnij niepustą wartość
          contactPreferences: formData.contactPreferences || {
            email: true,
            letter: false,
            phone: false,
          },
          relationshipStatus: formData.relationshipStatus || "single",
          personalityTraits: formData.personalityTraits || [],
          hobbies: formData.hobbies || [],
        };

        // Tworzenie nowego profilu z odpowiednio przygotowanymi danymi
        const newProfile = await createProfile(profileDataToCreate).unwrap();
        console.log("Utworzono profil:", newProfile);

        // Użyj właściwego ID (albo email jako alternatywa) do powiązania
        try {
          // Preferuj użycie ID, ale jeśli to nie zadziała, możesz spróbować email
          await updateProfileLink({
            userId: user.id || user.email, // Używaj ID lub email jako fallback
            profileId: newProfile.id,
          }).unwrap();
          console.log("Powiązanie zaktualizowane");

          // Pokaż komunikat sukcesu
          setError(null);
          alert("Profil został pomyślnie utworzony!");
          router.refresh();
        } catch (linkError) {
          console.error("Błąd powiązania:", linkError);
          // Pokaż bardziej pomocny komunikat dla MVP
          setError(
            "Profil został utworzony, ale wystąpił problem z powiązaniem go z kontem. Odśwież stronę lub skontaktuj się z administratorem."
          );
        }
      }
    } catch (mainError) {
      console.error("Główny błąd:", mainError);
      setError("Wystąpił błąd podczas zapisywania profilu. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading || profileLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            {user ? (
              <DashboardSidebar user={user} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse h-24 w-24 rounded-full bg-gray-200 mx-auto"></div>
                <div className="animate-pulse h-6 bg-gray-200 rounded mt-4 mx-auto w-3/4"></div>
                <div className="animate-pulse h-4 bg-gray-200 rounded mt-2 mx-auto w-1/2"></div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  {profile ? "Mój profil" : "Utwórz profil"}
                </h1>
                {profile && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors"
                  >
                    Edytuj profil
                  </button>
                )}
              </div>

              {/* Wyświetl błąd jeśli występuje */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Formularz lub widok profilu */}
              {isEditing || !profile ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Podstawowe informacje */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Imię
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nazwisko
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Wiek
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                        min="18"
                        max="99"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Zakład karny
                      </label>
                      <input
                        type="text"
                        name="facility"
                        value={formData.facility}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  {/* Zainteresowania */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Zainteresowania
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.interests?.map((interest) => (
                        <div
                          key={interest}
                          className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full flex items-center"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() =>
                              handleInterestChange(interest, "remove")
                            }
                            className="ml-2 text-slate-500 hover:text-slate-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        id="new-interest"
                        className="w-full border border-gray-300 rounded-l-md px-3 py-2"
                        placeholder="Dodaj zainteresowanie"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(
                            "new-interest"
                          ) as HTMLInputElement;
                          if (input.value.trim()) {
                            handleInterestChange(input.value.trim(), "add");
                            input.value = "";
                          }
                        }}
                        className="bg-slate-700 text-white px-4 py-2 rounded-r hover:bg-slate-800 transition-colors"
                      >
                        Dodaj
                      </button>
                    </div>
                  </div>

                  {/* Przyciski formularza */}
                  <div className="flex justify-end space-x-4">
                    {profile && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                      >
                        Anuluj
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {profile ? "Zapisywanie..." : "Tworzenie..."}
                        </span>
                      ) : (
                        <span>
                          {profile ? "Zapisz zmiany" : "Utwórz profil"}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Wyświetlanie danych profilu gdy nie edytujemy */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Imię
                      </h3>
                      <p className="mt-1">{profile.firstName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Nazwisko
                      </h3>
                      <p className="mt-1">{profile.lastName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Wiek
                      </h3>
                      <p className="mt-1">{profile.age} lat</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Zakład karny
                      </h3>
                      <p className="mt-1">{profile.facility}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Zainteresowania
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.interests?.map((interest) => (
                        <div
                          key={interest}
                          className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full"
                        >
                          {interest}
                        </div>
                      ))}
                      {profile.interests?.length === 0 && (
                        <p className="text-gray-500 italic">
                          Brak zainteresowań
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
