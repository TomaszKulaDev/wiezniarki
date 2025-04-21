import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/backend/middleware/authMiddleware";
import { mongodbService } from "@/backend/services/mongodbService";
import { dbName } from "@/backend/utils/mongodb";
import { Match } from "@/backend/models/Match";

// GET - Pobierz wszystkie dopasowania użytkownika
export async function GET(request: NextRequest) {
  try {
    // Weryfikacja autoryzacji
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak autoryzacji" },
        { status: authResult.status || 401 }
      );
    }

    const { userId } = authResult;

    // Pobierz dopasowania użytkownika
    const matches = await mongodbService.findDocuments<Match>(
      dbName,
      "matches",
      {
        $or: [{ prisonerId: userId }, { partnerId: userId }],
      }
    );

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Błąd podczas pobierania dopasowań:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania dopasowań" },
      { status: 500 }
    );
  }
}

// POST - Utwórz nowe dopasowanie
export async function POST(request: NextRequest) {
  try {
    // Weryfikacja autoryzacji
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message || "Brak autoryzacji" },
        { status: authResult.status || 401 }
      );
    }

    const { userId, role } = authResult;
    const body = await request.json();
    const { partnerId } = body;

    if (!partnerId) {
      return NextResponse.json(
        { message: "Brak ID partnera" },
        { status: 400 }
      );
    }

    // Sprawdź, czy dopasowanie już istnieje
    const existingMatch = await mongodbService.findDocument<Match>(
      dbName,
      "matches",
      {
        $or: [
          { prisonerId: userId, partnerId },
          { prisonerId: partnerId, partnerId: userId },
        ],
      }
    );

    console.log(
      `Sprawdzam istniejący match między ${userId} a ${partnerId}:`,
      existingMatch ? "Znaleziono" : "Nie znaleziono"
    );

    if (existingMatch) {
      // Jeśli dopasowanie już istnieje, zwróć je
      return NextResponse.json(existingMatch);
    }

    // Określ role (więzień/partner) na podstawie roli użytkownika
    let prisonerId, partnerIdToUse;
    if (role === "prisoner") {
      prisonerId = userId;
      partnerIdToUse = partnerId;
    } else {
      prisonerId = partnerId;
      partnerIdToUse = userId;
    }

    // Utwórz nowe dopasowanie
    const newMatch: Match = {
      id: Date.now().toString(),
      prisonerId,
      partnerId: partnerIdToUse,
      status: "pending", // Do zaakceptowania przez drugą stronę
      initiatedBy: role === "prisoner" ? "prisoner" : "partner",
      matchScore: 0, // Do obliczenia później
      matchReason: [], // Do wypełnienia później
      messageCount: 0,
      lastInteraction: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Zapisz dopasowanie w bazie danych
    await mongodbService.insertDocument(dbName, "matches", newMatch);

    return NextResponse.json(newMatch, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia dopasowania:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas tworzenia dopasowania" },
      { status: 500 }
    );
  }
}
