"use client";

import Link from "next/link";
import { Profile } from "@/backend/models/Profile";

interface ProfileContactProps {
  profile: Profile;
  onClose: () => void;
}

export default function ProfileContact({
  profile,
  onClose,
}: ProfileContactProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nawiąż kontakt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mb-4 text-gray-600">
          Aby nawiązać kontakt z {profile.firstName}, musisz się zalogować lub
          zarejestrować.
        </p>

        <div className="flex space-x-4">
          <Link
            href="/login"
            className="flex-1 text-center py-2 px-4 rounded-lg border transition-colors duration-300"
            style={{
              backgroundColor: "white",
              color: "#1e50a0",
              borderColor: "#1e50a0",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#1e50a0";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#1e50a0";
              e.currentTarget.style.borderColor = "#1e50a0";
            }}
          >
            Zaloguj się
          </Link>
          <Link
            href="/register"
            className="flex-1 text-center py-2 px-4 rounded-lg border transition-colors duration-300"
            style={{
              backgroundColor: "white",
              color: "#1e50a0",
              borderColor: "#1e50a0",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#1e50a0";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#1e50a0";
              e.currentTarget.style.borderColor = "#1e50a0";
            }}
          >
            Zarejestruj się
          </Link>
        </div>
      </div>
    </div>
  );
}
