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

    // Pobierz parametry z URL
    const url = new URL(request.url);
    const inactiveFilter = url.searchParams.get("inactive") === "true";

    // Standardowe filtry z istniejącego kodu
    const role = url.searchParams.get("role");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Buduj zapytanie filtru
    const filter: any = {};

    if (role && role !== "all") {
      filter.role = role;
    }

    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }

    // Jeśli żądamy nieaktywnych użytkowników, nie stosujemy paginacji
    // i używamy specjalnego filtru
    if (inactiveFilter) {
      // Zwracamy użytkowników, którzy są niezweryfikowani LUB zablokowani
      const collection = await mongodbService.getCollection(dbName, "users");
      const users = await collection
        .find({
          $or: [{ verified: false }, { locked: true }],
        })
        .toArray();

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

      return NextResponse.json({ users: safeUsers });
    }

    // Pobierz kolekcję użytkowników
    const collection = await mongodbService.getCollection(dbName, "users");

    // Pobierz całkowitą liczbę użytkowników spełniających filtr
    const totalUsers = await collection.countDocuments(filter);

    // Przygotuj sortowanie
    const sortBy = url.searchParams.get("sortBy") || "createdAt-desc";
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
