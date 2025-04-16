"use client";

import { Profile } from "@/backend/models/Profile";
import ProfileBreadcrumbs from "./components/ProfileBreadcrumbs";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInterests from "./components/ProfileInterests";
import ProfileAbout from "./components/ProfileAbout";
import ProfileGoals from "./components/ProfileGoals";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileContact from "./components/ProfileContact";
import { useState } from "react";
import { useGetProfileByIdQuery } from "@/frontend/store/apis/profileApi";

export default function ProfileClientContent({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  // Używamy initialProfile jako fallback, ale korzystamy z RTK Query
  // aby mieć zawsze aktualne dane
  const { data: profile = initialProfile } = useGetProfileByIdQuery(
    initialProfile.id
  );
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "interests" | "goals">(
    "about"
  );

  const handleContactRequest = () => {
    setShowContactForm(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <ProfileBreadcrumbs profile={profile} />

      <ProfileHeader
        profile={profile}
        onContactRequest={handleContactRequest}
      />

      {/* Nawigacja zakładek */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("about")}
            className={`${
              activeTab === "about"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm md:text-base transition-colors`}
          >
            O mnie
          </button>
          <button
            onClick={() => setActiveTab("interests")}
            className={`${
              activeTab === "interests"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm md:text-base transition-colors`}
          >
            Zainteresowania i hobby
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`${
              activeTab === "goals"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm md:text-base transition-colors`}
          >
            Cele i plany
          </button>
        </nav>
      </div>

      {/* Treść zakładek */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lewa kolumna z główną treścią */}
        <div className="md:col-span-2 space-y-8">
          {activeTab === "about" && <ProfileAbout profile={profile} />}
          {activeTab === "interests" && <ProfileInterests profile={profile} />}
          {activeTab === "goals" && <ProfileGoals profile={profile} />}
        </div>

        {/* Prawa kolumna */}
        <div className="space-y-8">
          <ProfileSidebar profile={profile} />
        </div>
      </div>

      {/* Formularz kontaktowy */}
      {showContactForm && (
        <ProfileContact
          profile={profile}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
}
