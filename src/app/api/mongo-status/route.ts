import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/backend/utils/mongodb";

export async function GET() {
  try {
    // Próba połączenia z MongoDB
    const client = await clientPromise;

    // Sprawdź dostęp do bazy danych
    const db = client.db(dbName);

    // Pobierz listę kolekcji
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Sprawdź dostęp do kolekcji profiles
    let profilesCount = 0;
    if (collectionNames.includes("profiles")) {
      profilesCount = await db.collection("profiles").countDocuments();
    }

    // Zwróć informacje o statusie
    return NextResponse.json(
      {
        status: "connected",
        database: dbName,
        collections: collectionNames,
        profilesCount,
        message: "Połączenie z MongoDB działa poprawnie!",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd połączenia z MongoDB:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Nie można połączyć się z MongoDB",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
