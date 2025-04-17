import { NextRequest, NextResponse } from "next/server";
import { profileService } from "@/backend/services/profileService";

/**
 * UWAGA DLA PRZYSZŁYCH PROGRAMISTÓW
 * -----------------------------------------------------------------------------
 * Ten plik zawiera obejście problemu typów w Next.js 15.2.4 dla API Routes z dynamicznymi segmentami.
 *
 * PROBLEM:
 * W Next.js 15.2.4 występuje problem z typami dla funkcji obsługi żądań HTTP (GET, PATCH, DELETE)
 * w plikach route.ts znajdujących się w folderach z dynamicznymi segmentami ([id]).
 *
 * Standardowa składnia:
 * ```
 * export async function GET(
 *   request: NextRequest,
 *   { params }: { params: { id: string } }
 * ) {...}
 * ```
 *
 * Powoduje błąd typów podczas budowania:
 * "Type error: Route has an invalid GET export: Type { params: { id: string } }
 * is not a valid type for the function's second argument."
 *
 * ROZWIĄZANIE:
 * Zamiast polegać na mechanizmie segmentów dynamicznych Next.js, ręcznie wyciągamy ID
 * bezpośrednio z URL żądania. Funkcje obsługi żądań HTTP przyjmują tylko obiekt request
 * jako parametr, co całkowicie omija problem typów.
 *
 * ALTERNATYWY:
 * 1. Aktualizacja do nowszej wersji Next.js, jeśli problem został naprawiony
 * 2. Downgrade do starszej wersji Next.js (np. 14.x), gdzie ten problem nie występuje
 * 3. Użycie flagi --no-lint podczas budowania: "next build --no-lint"
 *
 * DODATKOWE INFORMACJE:
 * - Jest to znany problem związany z pewnymi wersjami Next.js
 * - To rozwiązanie zachowuje pełną funkcjonalność API Routes, ale z innym sposobem dostępu do parametrów URL
 * - Gdy problem zostanie rozwiązany w przyszłych wersjach Next.js, można wrócić do standardowej składni
 */

// Funkcja pomocnicza do wyodrębniania ID z URL
function getIdFromUrl(request: NextRequest): string | null {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  return pathParts[pathParts.length - 1] || null;
}

export async function GET(request: NextRequest) {
  try {
    const id = getIdFromUrl(request);

    if (!id) {
      return NextResponse.json(
        { message: "ID profilu jest wymagane" },
        { status: 400 }
      );
    }

    // Pobierz profil z usługi
    const profile = await profileService.getProfileById(id);

    if (!profile) {
      return NextResponse.json(
        { message: "Profil nie został znaleziony" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error: unknown) {
    console.error("Błąd podczas pobierania profilu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania profilu" },
      { status: 500 }
    );
  }
}

// Dodajemy metodę PATCH do obsługi aktualizacji profilu
export async function PATCH(request: NextRequest) {
  try {
    const id = getIdFromUrl(request);

    if (!id) {
      return NextResponse.json(
        { message: "ID profilu jest wymagane" },
        { status: 400 }
      );
    }

    // Pobieramy dane aktualizacji z ciała żądania
    const updateData = await request.json();

    // Sprawdzamy, czy profil istnieje
    const existingProfile = await profileService.getProfileById(id);

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Profil nie został znaleziony" },
        { status: 404 }
      );
    }

    // Aktualizujemy profil
    const updatedProfile = await profileService.updateProfile(id, updateData);

    if (!updatedProfile) {
      return NextResponse.json(
        { message: "Nie udało się zaktualizować profilu" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error: unknown) {
    console.error("Błąd podczas aktualizacji profilu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas aktualizacji profilu" },
      { status: 500 }
    );
  }
}

// Dodajemy metodę DELETE do obsługi usuwania profilu
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromUrl(request);

    if (!id) {
      return NextResponse.json(
        { message: "ID profilu jest wymagane" },
        { status: 400 }
      );
    }

    // Sprawdzamy, czy profil istnieje
    const existingProfile = await profileService.getProfileById(id);

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Profil nie został znaleziony" },
        { status: 404 }
      );
    }

    // Usuwamy profil
    const result = await profileService.deleteProfile(id);

    if (!result) {
      return NextResponse.json(
        { message: "Nie udało się usunąć profilu" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Profil został usunięty" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Błąd podczas usuwania profiluu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas usuwania profilu" },
      { status: 500 }
    );
  }
}
