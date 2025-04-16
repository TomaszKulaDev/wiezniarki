import { NextRequest, NextResponse } from "next/server";
import { profileService } from "@/backend/services/profileService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
