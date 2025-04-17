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

    const tokens = await authService.refreshToken(refreshToken);

    if (!tokens) {
      return NextResponse.json(
        { message: "Nieprawidłowy lub wygasły token odświeżający" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Tokeny odświeżone pomyślnie",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Błąd odświeżania tokenów:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas odświeżania tokenów" },
      { status: 500 }
    );
  }
}
