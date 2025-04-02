"use client";

import Navbar from "@/frontend/components/layout/Navbar";

export default function TestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-center p-4 text-2xl font-bold">Test Navbar</h1>
      <div className="p-4 border border-red-500">
        <Navbar />
      </div>
      <div className="p-4">
        <p className="text-center">
          Jeśli widzisz Navbar powyżej, to działa poprawnie.
        </p>
      </div>
    </div>
  );
}
