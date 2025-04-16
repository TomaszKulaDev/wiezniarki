// src/backend/utils/mongodb.ts

import { MongoClient, MongoClientOptions } from "mongodb";

// Sprawdzenie, czy zmienne środowiskowe są zdefiniowane
const requiredEnvVars = ["MONGODB_HOST", "MONGODB_USER", "MONGODB_PASSWORD"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Brakujące zmienne środowiskowe: ${missingVars.join(", ")}`);
}

// Składanie URL MongoDB z oddzielnych zmiennych środowiskowych
const host = process.env.MONGODB_HOST!;
const user = process.env.MONGODB_USER!;
const password = process.env.MONGODB_PASSWORD!;
const options = process.env.MONGODB_OPTIONS || "retryWrites=true&w=majority";

// Konstruowanie pełnego URI
const uri = `mongodb+srv://${user}:${password}@${host}/?${options}`;

const mongoOptions: MongoClientOptions = {
  retryWrites: true,
  w: "majority" as any,
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // W środowisku deweloperskim używamy globalnej zmiennej, aby uniknąć
  // tworzenia wielu połączeń podczas hot-reloading
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, mongoOptions);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // W produkcji lepiej nie używać zmiennej globalnej
  client = new MongoClient(uri, mongoOptions);
  clientPromise = client.connect();
}

export default clientPromise;

// Eksportujemy też nazwę bazy danych, aby była dostępna w serwisach
export const dbName = process.env.MONGODB_DB || "wiezniarki";
