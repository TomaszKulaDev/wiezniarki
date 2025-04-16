import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, password } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        { message: "Brakujące wymagane dane" },
        { status: 400 }
      );
    }

    // Walidacja hasła
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Hasło musi mieć co najmniej 8 znaków" },
        { status: 400 }
      );
    }

    const success = await authService.resetPassword(email, token, password);

    if (!success) {
      return NextResponse.json(
        { message: "Nie udało się zresetować hasła" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Hasło zostało pomyślnie zresetowane" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd przy resetowaniu hasła:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Wystąpił błąd przy resetowaniu hasła";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
