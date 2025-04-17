import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Brak tokenu odświeżającego" },
        { status: 400 }
      );
    }

    await authService.logout(refreshToken);

    return NextResponse.json(
      { message: "Wylogowano pomyślnie", success: true },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Błąd wylogowywania:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas wylogowywania", success: false },
      { status: 500 }
    );
  }
}
