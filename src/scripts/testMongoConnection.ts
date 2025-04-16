import * as dotenv from "dotenv";
// Użyj bardziej konkretnej ścieżki do pliku .env.local
dotenv.config({ path: `${process.cwd()}/.env.local` });

import clientPromise from "../backend/utils/mongodb";
import { mongodbService } from "../backend/services/mongodbService";
import { profileService } from "../backend/services/profileService";
import { Collection } from "mongodb";

async function testMongoConnection() {
  console.log("====== Test połączenia z MongoDB ======");

  try {
    // Test 1: Sprawdź podstawowe połączenie z bazą
    console.log("\n1. Sprawdzanie połączenia z MongoDB...");
    const client = await clientPromise;
    console.log("✅ Połączenie z MongoDB udane!");

    // Test 2: Sprawdź dostęp do bazy danych
    console.log("\n2. Sprawdzanie dostępu do bazy danych 'wiezniarki'...");
    const db = client.db("wiezniarki");
    const collections = await db.listCollections().toArray();
    console.log(
      `✅ Dostęp do bazy udany. Znaleziono ${collections.length} kolekcji:`
    );
    collections.forEach((collection) => {
      console.log(`   - ${collection.name}`);
    });

    // Test 3: Sprawdź dostęp do kolekcji profiles
    console.log("\n3. Sprawdzanie kolekcji 'profiles'...");
    let collection: Collection | undefined;
    try {
      collection = await mongodbService.getCollection("wiezniarki", "profiles");
      const count = await collection.countDocuments();
      console.log(
        `✅ Dostęp do kolekcji 'profiles' udany. Liczba dokumentów: ${count}`
      );

      if (count === 0) {
        console.log(
          "   ⚠️ Kolekcja jest pusta. Zalecane uruchomienie skryptu seedDatabase.ts"
        );
      } else {
        // Jeśli są dokumenty, pokaż pierwszy z nich
        const firstProfile = await collection.findOne({});
        console.log("   📄 Przykładowy dokument:");
        console.log(`   - ID: ${firstProfile?.id}`);
        console.log(
          `   - Imię i nazwisko: ${firstProfile?.firstName} ${firstProfile?.lastName}`
        );
      }
    } catch (error) {
      console.error("❌ Błąd podczas dostępu do kolekcji 'profiles':", error);
    }

    // Test 4: Przetestuj usługę profileService
    console.log("\n4. Testowanie usługi profileService...");
    try {
      const profiles = await profileService.getAllProfiles();
      console.log(
        `✅ Usługa profileService działa poprawnie. Pobrano ${profiles.length} profili.`
      );

      if (profiles.length > 0) {
        const firstProfile = profiles[0];
        console.log(
          `   📄 Pierwszy profil: ${firstProfile.firstName} ${firstProfile.lastName}, wiek: ${firstProfile.age}`
        );

        // Test szczegółowy - pobieranie pojedynczego profilu
        const profileById = await profileService.getProfileById(
          firstProfile.id
        );
        if (profileById) {
          console.log(
            `   ✅ Poprawnie pobrano profil po ID: ${profileById.id}`
          );
        } else {
          console.log(
            `   ❌ Nie znaleziono profilu po ID ${firstProfile.id} (to nie powinno się zdarzyć)`
          );
        }

        // Test wyszukiwania
        const searchResult = await profileService.searchProfiles({
          facility: firstProfile.facility,
        });
        console.log(
          `   ✅ Wyszukiwanie działa. Znaleziono ${searchResult.length} profili w placówce "${firstProfile.facility}"`
        );
      }
    } catch (error) {
      console.error("❌ Błąd podczas testowania usługi profileService:", error);
    }

    console.log("\n====== Test zakończony ======");
    console.log("Podsumowanie:");
    console.log("✅ Połączenie z MongoDB działa poprawnie");
    console.log("✅ Dostęp do bazy danych jest możliwy");

    if (!collection) {
      console.log("❌ Brak dostępu do kolekcji 'profiles'");
      console.log("   Zalecane działania:");
      console.log("   1. Sprawdź uprawnienia użytkownika MongoDB");
      console.log(
        "   2. Uruchom skrypt seedDatabase.ts, aby utworzyć kolekcję"
      );
    }
  } catch (error) {
    console.error("\n❌ TEST NIEUDANY");
    console.error(
      "Wystąpił błąd podczas testowania połączenia z MongoDB:",
      error
    );
    console.log("\nMożliwe przyczyny:");
    console.log("1. Niepoprawny ciąg połączenia w pliku .env.local");
    console.log("2. Brak dostępu do sieci lub serwer MongoDB jest niedostępny");
    console.log("3. Niepoprawna nazwa użytkownika lub hasło");
    console.log("4. Nieodpowiednie uprawnienia");
  }
}

// Uruchom test
testMongoConnection();
