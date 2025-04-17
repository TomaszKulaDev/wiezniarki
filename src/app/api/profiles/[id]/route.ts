/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { profileService } from "@/backend/services/profileService";

// Podejście z jawnym typem "Partial<Record<string, string | string[]>>"
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  try {
    const id = params.id;

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
export async function PATCH(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  try {
    const id = params.id;

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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  try {
    const id = params.id;

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
