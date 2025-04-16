import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ message: "Brakujące dane" }, { status: 400 });
    }

    const success = await authService.verifyAccount(email, code);

    if (!success) {
      return NextResponse.json(
        { message: "Nie udało się zweryfikować konta" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Konto zostało pomyślnie zweryfikowane" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd przy weryfikacji konta:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Wystąpił błąd przy weryfikacji konta";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
