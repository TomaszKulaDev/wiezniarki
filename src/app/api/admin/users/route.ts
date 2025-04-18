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

    // Pobierz parametry zapytania
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "0"); // 0 oznacza wszystkie
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt-desc";

    // Przygotuj filtr
    const filter: any = {};

    // Filtrowanie po wyszukiwaniu
    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }

    // Filtrowanie po roli
    if (role && role !== "all") {
      filter.role = role;
    }

    // Filtrowanie po statusie
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

    // Pobierz kolekcję użytkowników
    const collection = await mongodbService.getCollection(dbName, "users");

    // Pobierz całkowitą liczbę użytkowników spełniających filtr
    const totalUsers = await collection.countDocuments(filter);

    // Przygotuj sortowanie
    const [sortField, sortDirection] = sortBy.split("-");
    const sort: any = {};

    if (sortField === "email") {
      sort.email = sortDirection === "asc" ? 1 : -1;
    } else if (sortField === "role") {
      sort.role = sortDirection === "asc" ? 1 : -1;
    } else if (sortField === "createdAt") {
      sort.createdAt = sortDirection === "asc" ? 1 : -1;
    } else if (sortField === "lastLogin") {
      sort.lastLogin = sortDirection === "asc" ? 1 : -1;
    }

    // Pobierz użytkowników z paginacją
    let usersQuery = collection.find(filter).sort(sort);

    // Zastosuj paginację, jeśli określono limit
    if (limit > 0) {
      const skip = (page - 1) * limit;
      usersQuery = usersQuery.skip(skip).limit(limit);
    }

    const users = await usersQuery.toArray();

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

    // Zwróć dane wraz z informacjami o paginacji
    return NextResponse.json({
      users: safeUsers,
      pagination: {
        total: totalUsers,
        page,
        limit: limit > 0 ? limit : totalUsers,
        pages: limit > 0 ? Math.ceil(totalUsers / limit) : 1,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania użytkowników:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania użytkowników" },
      { status: 500 }
    );
  }
}
