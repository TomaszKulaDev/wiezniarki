import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email i hasło są wymagane" },
        { status: 400 }
      );
    }

    // Zaloguj użytkownika
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password
    );

    return NextResponse.json(
      {
        message: "Zalogowano pomyślnie",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          verified: user.verified,
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Błąd logowania:", error);

    // Type guard - sprawdzamy czy error jest obiektem z właściwością message
    if (error instanceof Error) {
      if (error.message === "Invalid credentials") {
        return NextResponse.json(
          { message: "Nieprawidłowy email lub hasło" },
          { status: 401 }
        );
      }

      if (error.message === "Account is locked") {
        return NextResponse.json(
          { message: "Konto jest zablokowane. Spróbuj ponownie później" },
          { status: 403 }
        );
      }

      if (error.message === "Account is not verified") {
        return NextResponse.json(
          { message: "Konto nie zostało zweryfikowane. Sprawdź swój email" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { message: "Wystąpił błąd podczas logowania" },
      { status: 500 }
    );
  }
}
