import { NextRequest, NextResponse } from "next/server";
import { profileService } from "@/backend/services/profileService";

export async function GET(request: NextRequest) {
  try {
    // Pobierz parametry wyszukiwania z URL
    const searchParams = request.nextUrl.searchParams;
    const minAge = searchParams.get("minAge")
      ? parseInt(searchParams.get("minAge")!)
      : undefined;
    const maxAge = searchParams.get("maxAge")
      ? parseInt(searchParams.get("maxAge")!)
      : undefined;
    const facility = searchParams.get("facility") || undefined;
    const interests = searchParams.get("interests")
      ? searchParams.get("interests")!.split(",")
      : undefined;

    // Pobierz profile z usługi
    let profiles;

    if (minAge || maxAge || facility || interests) {
      // Wyszukiwanie z kryteriami
      profiles = await profileService.searchProfiles({
        minAge,
        maxAge,
        facility,
        interests,
      });
    } else {
      // Pobierz wszystkie profile
      profiles = await profileService.getAllProfiles();
    }

    return NextResponse.json(profiles, { status: 200 });
  } catch (error: unknown) {
    console.error("Błąd podczas pobierania profili:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania profili" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Pobierz dane profilu z ciała żądania
    const profileData = await request.json();

    // Walidacja - sprawdź czy podstawowe pola są obecne
    if (!profileData.firstName || !profileData.lastName || !profileData.age) {
      return NextResponse.json(
        { message: "Brakujące wymagane pola profilu" },
        { status: 400 }
      );
    }

    // Utwórz profil za pomocą serwisu
    const newProfile = await profileService.createProfile(profileData);

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error: unknown) {
    console.error("Błąd podczas tworzenia profilu:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas tworzenia profilu" },
      { status: 500 }
    );
  }
}
