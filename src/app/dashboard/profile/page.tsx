"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import DashboardSidebar from "@/frontend/components/dashboard/DashboardSidebar";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";
import {
  useGetProfilesQuery,
  useGetProfileByIdQuery,
  useUpdateProfileMutation,
  useCreateProfileMutation,
} from "@/frontend/store/apis/profileApi";
import { useUpdateProfileLinkMutation } from "@/frontend/store/apis/authApi";
import { Profile } from "@/backend/models/Profile";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  // Pobierz wszystkie profile, aby znaleźć profil użytkownika, jeśli istnieje
  const { data: allProfiles } = useGetProfilesQuery();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lokalne ID profilu, które będzie używane zamiast user.profileId
  const [localProfileId, setLocalProfileId] = useState<string | null>(null);

  // Znajdź profil po jego ID, używając lokalnego ID jeśli dostępne
  const profileId = localProfileId || user?.profileId || "none";
  const { data: profile, isLoading: profileLoading } = useGetProfileByIdQuery(
    profileId,
    { skip: profileId === "none" }
  );

  // Sprawdź, czy klucz lokalny "createdProfileId" istnieje
  useEffect(() => {
    const savedProfileId = localStorage.getItem("createdProfileId");
    if (savedProfileId) {
      setLocalProfileId(savedProfileId);
    }
  }, []);

  // Sprawdź czy użytkownik ma już profil w bazie danych
  useEffect(() => {
    if (user && allProfiles && allProfiles.length > 0) {
      // Jeśli mamy nowego użytkownika i listę profili, znajdźmy profil
      // który może należeć do tego użytkownika (na podstawie innych pól)
      const userEmail = user.email;

      // Np. możemy sprawdzić, czy jest profil z imieniem lub nazwiskiem
      // zawierającym część adresu email (prostą heurystykę)
      const possibleUserProfile = allProfiles.find(
        (p) =>
          p.firstName.includes(userEmail.split("@")[0]) ||
          p.lastName.includes(userEmail.split("@")[0])
      );

      if (possibleUserProfile) {
        setLocalProfileId(possibleUserProfile.id);
        localStorage.setItem("createdProfileId", possibleUserProfile.id);
      }
    }
  }, [user, allProfiles]);

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
        interests: profile.interests || [],
        skills: profile.skills || [],
        bio: profile.bio || "",
        education: profile.education || "",
        goals: profile.goals || "",
        contactPreferences: profile.contactPreferences || {
          email: true,
          letter: false,
          phone: false,
        },
        relationshipStatus: profile.relationshipStatus || "single",
        personalityTraits: profile.personalityTraits || [],
        hobbies: profile.hobbies || [],
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
      // Sprawdź czy zainteresowanie już istnieje
      if (!formData.interests?.includes(interest)) {
        setFormData((prev) => ({
          ...prev,
          interests: [...(prev.interests || []), interest],
        }));
      }
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

  // Funkcja obsługująca formularz
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (profile) {
        // Aktualizacja istniejącego profilu
        const updatedProfile = await updateProfile({
          id: profile.id,
          ...formData,
        }).unwrap();

        // Aktualizacja lokalnego stanu
        console.log("Profil zaktualizowany:", updatedProfile);
        setSuccess("Profil został pomyślnie zaktualizowany");
        setIsEditing(false);
      } else if (user) {
        // Tworzenie nowego profilu
        const profileDataToCreate = {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          age: formData.age || 18,
          facility: formData.facility || "",
          interests: formData.interests || [],
          skills: formData.skills || [],
          bio: formData.bio || "",
          education: formData.education || "",
          goals: formData.goals || "",
          contactPreferences: formData.contactPreferences || {
            email: true,
            letter: false,
            phone: false,
          },
          relationshipStatus: formData.relationshipStatus || "single",
          personalityTraits: formData.personalityTraits || [],
          hobbies: formData.hobbies || [],
        };

        // Tworzenie nowego profilu
        const newProfile = await createProfile(profileDataToCreate).unwrap();
        console.log("Utworzono profil:", newProfile);

        // Zapisz ID profilu w localStorage dla trwałości
        localStorage.setItem("createdProfileId", newProfile.id);
        setLocalProfileId(newProfile.id);

        // Aktualizacja powiązania
        try {
          await updateProfileLink({
            userId: user.id,
            profileId: newProfile.id,
          }).unwrap();
          console.log("Powiązanie zaktualizowane");
          setSuccess("Profil został utworzony pomyślnie");
        } catch (linkError) {
          console.error("Błąd powiązania:", linkError);
          setError(
            "Profil został utworzony, ale wystąpił problem z powiązaniem go z kontem."
          );
        }

        // Wyłącz edycję
        setIsEditing(false);
      }
    } catch (mainError) {
      console.error("Główny błąd:", mainError);
      setError("Wystąpił błąd podczas zapisywania profilu. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading || (profileLoading && localProfileId)) {
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
                {/* Placeholder */}
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
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        id="newInterest"
                        className="w-full border border-gray-300 rounded-l-md px-3 py-2"
                        placeholder="Dodaj zainteresowanie i naciśnij Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              handleInterestChange(input.value.trim(), "add");
                              input.value = "";
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      O mnie
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                      placeholder="Napisz coś o sobie..."
                    />
                  </div>

                  {/* Wykształcenie */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Wykształcenie
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  {/* Cele */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Cele i aspiracje
                    </label>
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                      placeholder="Jakie masz cele i aspiracje na przyszłość?"
                    />
                  </div>

                  {/* Status związku */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Status związku
                    </label>
                    <select
                      name="relationshipStatus"
                      value={formData.relationshipStatus}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="single">Singiel/ka</option>
                      <option value="complicated">Skomplikowany</option>
                      <option value="divorced">Rozwiedziony/a</option>
                      <option value="widowed">Wdowiec/Wdowa</option>
                    </select>
                  </div>

                  {/* Preferencje kontaktu */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Preferowane formy kontaktu
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.contactPreferences?.email ?? true}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              contactPreferences: {
                                email: e.target.checked,
                                letter:
                                  prev.contactPreferences?.letter ?? false,
                                phone: prev.contactPreferences?.phone ?? false,
                              },
                            }));
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Email
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.contactPreferences?.letter ?? false}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              contactPreferences: {
                                email: prev.contactPreferences?.email ?? true,
                                letter: e.target.checked,
                                phone: prev.contactPreferences?.phone ?? false,
                              },
                            }));
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">List</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.contactPreferences?.phone ?? false}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              contactPreferences: {
                                email: prev.contactPreferences?.email ?? true,
                                letter:
                                  prev.contactPreferences?.letter ?? false,
                                phone: e.target.checked,
                              },
                            }));
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Telefon
                        </span>
                      </label>
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
                      className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Zapisywanie...</span>
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
                      {(profile.interests || []).map((interest) => (
                        <div
                          key={interest}
                          className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full"
                        >
                          {interest}
                        </div>
                      ))}
                      {(profile.interests || []).length === 0 && (
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
