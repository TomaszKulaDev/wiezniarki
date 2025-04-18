import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { User } from "@/backend/models/User";

export async function GET(request: NextRequest) {
  try {
    // Weryfikacja uprawnień administratora
    const authResult = await authMiddleware(request, ["admin"]);

    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak uprawnień" },
        { status: authResult.status || 403 }
      );
    }

    // Pobierz parametry filtrowania
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "json"; // json lub csv
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    // Przygotuj filtr
    const filter: any = {};

    // Zastosuj filtry (podobnie jak w GET /api/admin/users)
    if (role && role !== "all") {
      filter.role = role;
    }

    if (status === "active") {
      filter.active = true;
      filter.locked = false;
    } else if (status === "inactive") {
      filter.active = false;
    } else if (status === "locked") {
      filter.locked = true;
    } else if (status === "unverified") {
      filter.verified = false;
    }

    // Pobierz użytkowników
    const users = await mongodbService.findDocuments<User>(
      dbName,
      "users",
      filter
    );

    // Usuń wrażliwe dane
    const safeUsers = users.map((user) => {
      const {
        passwordHash,
        verificationCode,
        resetPasswordToken,
        ...safeUser
      } = user;
      return safeUser;
    });

    if (format === "csv") {
      // Przygotuj nagłówki CSV
      const headers = [
        "id",
        "email",
        "role",
        "active",
        "locked",
        "verified",
        "createdAt",
        "lastLogin",
        "profileId",
      ];

      // Przygotuj wiersze
      const rows = safeUsers.map((user) => [
        user.id,
        user.email,
        user.role,
        user.active ? "true" : "false",
        user.locked ? "true" : "false",
        user.verified ? "true" : "false",
        user.createdAt,
        user.lastLogin || "",
        user.profileId || "",
      ]);

      // Połącz nagłówki i wiersze
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Zwróć CSV z odpowiednimi nagłówkami
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="users_export_${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
        },
      });
    }

    // Domyślnie zwróć JSON
    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Błąd podczas eksportu użytkowników:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas eksportu użytkowników" },
      { status: 500 }
    );
  }
}
