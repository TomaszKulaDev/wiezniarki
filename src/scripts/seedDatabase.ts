import { mongodbService } from "../backend/services/mongodbService";
import { Profile } from "../backend/models/Profile";

const DB_NAME = "wiezniarki";
const COLLECTION_NAME = "profiles";

const sampleProfiles: Profile[] = [
  {
    id: "1",
    firstName: "Jan",
    lastName: "Kowalski",
    age: 32,
    facility: "Zakład Karny w Warszawie",
    interests: ["literatura", "filozofia", "sport"],
    skills: ["pisanie", "rysunek"],
    bio: "Pasjonat literatury i filozofii...",
    education: "Wyższe, filozofia",
    goals: "Rozwijać swoje umiejętności pisarskie i nawiązać nowe kontakty",
    photoUrl: "/images/profiles/jan_kowalski.jpg",
    contactPreferences: {
      email: true,
      letter: true,
      phone: false,
    },
    matchingPreferences: {
      minAge: 25,
      maxAge: 45,
      interests: ["literatura", "sztuka"],
      lookingFor: "friendship",
      locationPreference: ["Warszawa", "Kraków"],
    },
    relationshipStatus: "single",
    personalityTraits: ["wrażliwy", "refleksyjny", "kreatywny"],
    hobbies: ["czytanie", "pisanie", "medytacja"],
    createdAt: new Date(),
    updatedAt: new Date(),
    releaseDateEstimate: new Date("2025-06-15"),
  },
  {
    id: "2",
    firstName: "Anna",
    lastName: "Nowak",
    age: 29,
    facility: "Zakład Karny w Krakowie",
    interests: ["muzyka", "malarstwo", "podróże"],
    skills: ["śpiew", "malarstwo", "języki obce"],
    bio: "Artystyczna dusza z zamiłowaniem do różnych form ekspresji...",
    education: "Średnie, technikum artystyczne",
    goals: "Założyć własne studio artystyczne po wyjściu na wolność",
    contactPreferences: {
      email: true,
      letter: true,
      phone: true,
    },
    matchingPreferences: {
      minAge: 28,
      maxAge: 40,
      lookingFor: "relationship",
      locationPreference: ["Kraków", "Wrocław"],
    },
    relationshipStatus: "single",
    personalityTraits: ["kreatywna", "otwarta", "empatyczna"],
    hobbies: ["malarstwo", "śpiew", "nauka języków"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedDatabase() {
  try {
    // Clear existing collection
    const collection = await mongodbService.getCollection(
      DB_NAME,
      COLLECTION_NAME
    );
    await collection.deleteMany({});

    // Insert sample data
    await collection.insertMany(sampleProfiles);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
