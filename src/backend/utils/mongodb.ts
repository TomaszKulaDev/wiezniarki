import { MongoClient, MongoClientOptions } from "mongodb";

// Pobieranie zmiennych środowiskowych z konfiguracji
const host = process.env.MONGODB_HOST;
const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const options = process.env.MONGODB_OPTIONS;

// Sprawdź, czy wszystkie wymagane zmienne środowiskowe są zdefiniowane
if (!host || !user || !password) {
  throw new Error(
    "Brakujące zmienne środowiskowe dla MongoDB. Sprawdź plik .env.local"
  );
}

// Konstruowanie URI MongoDB
const uri = `mongodb+srv://${user}:${password}@${host}/?${options}`;

const mongoOptions: MongoClientOptions = {
  retryWrites: true,
  w: "majority" as any,
};

// Deklaracja zmiennych dla klienta MongoDB
let client;
let clientPromise: Promise<MongoClient>;

// Różne podejście zależne od środowiska
if (process.env.NODE_ENV === "development") {
  // W środowisku deweloperskim używaj globalnej zmiennej, aby uniknąć tworzenia wielu połączeń
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, mongoOptions);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // W produkcji nie używaj globalnej zmiennej
  client = new MongoClient(uri, mongoOptions);
  clientPromise = client.connect();
}

export default clientPromise;

// Eksportuj bazową nazwę bazy danych dla łatwego użycia w serwisach
export const dbName = process.env.MONGODB_DB || "wiezniarki";
