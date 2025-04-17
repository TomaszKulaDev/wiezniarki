import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "../services/jwtService";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export async function authMiddleware(
  request: AuthenticatedRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Pobierz token z nagłówka
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Brak tokenu autoryzacji" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Weryfikuj token
    const payload = jwtService.verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { message: "Nieprawidłowy lub wygasły token" },
        { status: 401 }
      );
    }

    // Dodaj informacje o użytkowniku do żądania
    request.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    // Kontynuuj do właściwego handlera
    return handler(request);
  } catch (error) {
    console.error("Błąd autoryzacji:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd autoryzacji" },
      { status: 500 }
    );
  }
}

// Middleware do weryfikacji roli
export function roleMiddleware(
  request: AuthenticatedRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  allowedRoles: string[]
): Promise<NextResponse> {
  return authMiddleware(request, async (req) => {
    if (!req.user) {
      return NextResponse.json(
        { message: "Wymagana autoryzacja" },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return NextResponse.json(
        { message: "Brak uprawnień do tego zasobu" },
        { status: 403 }
      );
    }

    return handler(req);
  });
}
