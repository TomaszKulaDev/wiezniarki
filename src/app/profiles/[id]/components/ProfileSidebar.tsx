"use client";

import Link from "next/link";
import { Profile } from "@/backend/models/Profile";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Informacje o programie</h3>
        <p className="text-gray-600 mb-4">
          {profile.firstName} jest uczestniczką programu resocjalizacji
          społecznej &quot;Więźniarki&quot;, którego celem jest pomoc w
          reintegracji kobiet osadzonych w zakładach karnych.
        </p>
        <Link
          href="/about"
          className="text-primary hover:underline inline-flex items-center"
        >
          <span>Dowiedz się więcej o programie</span>
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Informacje o placówce</h3>
        <p className="font-medium text-gray-800 mb-2">{profile.facility}</p>
        <p className="text-gray-600 mb-4">
          Placówka prowadzi program reintegracji społecznej i pozwala na
          budowanie relacji między osadzonymi a partnerami z zewnątrz, co pomaga
          w przygotowaniu do życia po odbyciu kary.
        </p>
        <Link
          href="/units"
          className="text-primary hover:underline inline-flex items-center"
        >
          <span>Lista jednostek penitencjarnych</span>
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
