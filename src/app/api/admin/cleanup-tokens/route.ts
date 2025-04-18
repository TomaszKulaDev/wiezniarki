import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "@/backend/services/jwtService";
import { authMiddleware } from "@/backend/middleware/authMiddleware";

export async function POST(request: NextRequest) {
  try {
    // Middleware do weryfikacji, czy użytkownik jest administratorem
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    // Pobierz parametry czyszczenia z ciała żądania
    const body = await request.json();
    const {
      removeExpired = true,
      removeRevoked = true,
      olderThan = 30, // domyślnie usuń tokeny starsze niż 30 dni
      dryRun = false,
    } = body;

    // Uruchom czyszczenie tokenów
    const result = await jwtService.cleanupTokens({
      removeExpired,
      removeRevoked,
      olderThan,
      dryRun,
    });

    return NextResponse.json(
      {
        message: dryRun
          ? "Przeprowadzono symulację czyszczenia tokenów"
          : "Tokeny zostały pomyślnie wyczyszczone",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd podczas czyszczenia tokenów:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas czyszczenia tokenów" },
      { status: 500 }
    );
  }
}
