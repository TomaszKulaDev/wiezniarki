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
      // Usuń ciasteczka, jeśli token odświeżający jest nieprawidłowy
      const response = NextResponse.json(
        { message: "Nieprawidłowy lub wygasły token odświeżający" },
        { status: 401 }
      );

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    }

    // Stwórz odpowiedź i ustaw ciasteczka
    const response = NextResponse.json(
      {
        message: "Tokeny odświeżone pomyślnie",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      { status: 200 }
    );

    // Ustaw ciasteczka
    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minut
      path: "/",
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Błąd odświeżania tokenów:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas odświeżania tokenów" },
      { status: 500 }
    );
  }
}
