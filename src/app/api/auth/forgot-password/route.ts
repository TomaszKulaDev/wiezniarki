import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Adres email jest wymagany" },
        { status: 400 }
      );
    }

    // Użyj istniejącego serwisu
    await authService.requestPasswordReset(email);

    // Zawsze zwracaj sukces, nawet jeśli email nie istnieje (ze względów bezpieczeństwa)
    return NextResponse.json(
      { message: "Jeśli konto istnieje, email z instrukcjami został wysłany" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd przy żądaniu resetowania hasła:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd przy przetwarzaniu żądania" },
      { status: 500 }
    );
  }
}
