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
} from "@/frontend/store/apis/profileApi";
import { Profile } from "@/backend/models/Profile";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  const [isEditing, setIsEditing] = useState(false);

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

  const [updateProfile] = useUpdateProfileMutation();

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

    try {
      if (profile) {
        // Aktualizacja istniejącego profilu
        await updateProfile({
          id: profile.id,
          ...formData,
        }).unwrap();
      } else {
        // Tworzenie nowego profilu
        // Tu należałoby zaimplementować createProfile mutation
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Błąd podczas zapisywania profilu:", error);
    }
  };

  if (userLoading || profileLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  >
                    Edytuj profil
                  </button>
                )}
              </div>

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
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() =>
                              handleInterestChange(interest, "remove")
                            }
                            className="ml-2 text-primary/70 hover:text-primary"
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
                        className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary/90"
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
                      >
                        Anuluj
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    >
                      {profile ? "Zapisz zmiany" : "Utwórz profil"}
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
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full"
                        >
                          {interest}
                        </div>
                      ))}
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
