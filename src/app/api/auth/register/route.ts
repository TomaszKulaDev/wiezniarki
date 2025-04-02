import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/backend/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Brakujące pole email, hasło lub rola" },
        { status: 400 }
      );
    }

    // Sprawdź, czy rola jest prawidłowa
    if (role !== "prisoner" && role !== "partner") {
      return NextResponse.json(
        { message: "Nieprawidłowa rola użytkownika" },
        { status: 400 }
      );
    }

    // Dodatkowa walidacja email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Nieprawidłowy format adresu email" },
        { status: 400 }
      );
    }

    // Dodatkowa walidacja hasła
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Hasło musi mieć co najmniej 8 znaków" },
        { status: 400 }
      );
    }

    // Zarejestruj użytkownika
    const user = await authService.register(email, password, role);

    return NextResponse.json(
      {
        message: "Użytkownik został zarejestrowany pomyślnie",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          verified: user.verified,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Błąd rejestracji:", error);

    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return NextResponse.json(
          { message: "Użytkownik z tym adresem email już istnieje" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: "Wystąpił błąd podczas rejestracji" },
      { status: 500 }
    );
  }
}
