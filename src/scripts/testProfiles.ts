import * as dotenv from "dotenv";
// Ładujemy zmienne środowiskowe z .env.local
dotenv.config({ path: ".env.local" });

import { profileService } from "../backend/services/profileService";
import { dbName } from "../backend/utils/mongodb";
import { mongodbService } from "../backend/services/mongodbService";

async function testProfiles() {
  console.log("🔍 Pobieranie profili z bazy danych...");

  try {
    // Pobierz wszystkie profile
    const profiles = await profileService.getAllProfiles();
    console.log(`✅ Znaleziono ${profiles.length} profili:`);

    if (profiles.length === 0) {
      console.log("❗ Brak profili w bazie danych.");

      // Sprawdź, czy kolekcja istnieje
      const client = (await mongodbService.getCollection(dbName, "profiles"))
        .collectionName;
      console.log(`📁 Kolekcja '${client}' istnieje.`);

      console.log("\n🔄 Możliwe przyczyny braku danych:");
      console.log(
        "1. Baza danych jest pusta - nie zostały dodane żadne profile"
      );
      console.log("2. Należy uruchomić skrypt do inicjalizacji danych");
    } else {
      // Wyświetl pierwsze 3 profile (lub wszystkie, jeśli jest ich mniej)
      console.log("\n📋 Przykładowe profile:");

      profiles.slice(0, 3).forEach((profile, index) => {
        console.log(`\n--- Profil ${index + 1} ---`);
        console.log(`ID: ${profile.id}`);
        console.log(`Imię: ${profile.firstName}`);
        console.log(`Nazwisko: ${profile.lastName}`);
        console.log(`Wiek: ${profile.age}`);
        console.log(`Zakład: ${profile.facility}`);
        console.log(`Zainteresowania: ${profile.interests?.join(", ")}`);
      });

      console.log(
        `\n✅ Pozostałe profile: ${
          profiles.length > 3 ? profiles.length - 3 : 0
        }`
      );
    }
  } catch (error) {
    console.error("❌ Błąd podczas pobierania profili:", error);
  } finally {
    // Zakończ process Node.js
    process.exit(0);
  }
}

// Uruchom test
testProfiles();
