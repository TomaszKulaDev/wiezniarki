import { Document, Collection } from "mongodb";
import clientPromise from "../utils/mongodb";

export const mongodbService = {
  // Pobierz kolekcję z MongoDB
  async getCollection(
    dbName: string,
    collectionName: string
  ): Promise<Collection> {
    const client = await clientPromise;
    const db = client.db(dbName);
    return db.collection(collectionName);
  },

  // Znajdź jeden dokument
  async findDocument<T = Document>(
    dbName: string,
    collectionName: string,
    query: any
  ): Promise<T | null> {
    const collection = await this.getCollection(dbName, collectionName);
    const result = await collection.findOne(query);
    return result as unknown as T | null;
  },

  // Znajdź wiele dokumentów
  async findDocuments<T = Document>(
    dbName: string,
    collectionName: string,
    query: any = {}
  ): Promise<T[]> {
    const collection = await this.getCollection(dbName, collectionName);
    const result = await collection.find(query).toArray();
    return result as unknown as T[];
  },

  // Wstaw jeden dokument
  async insertDocument<T = Document>(
    dbName: string,
    collectionName: string,
    document: T
  ) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.insertOne(document as Document);
  },

  // Wstaw wiele dokumentów
  async insertDocuments<T = Document>(
    dbName: string,
    collectionName: string,
    documents: T[]
  ) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.insertMany(documents as Document[]);
  },

  // Aktualizuj dokument
  async updateDocument(
    dbName: string,
    collectionName: string,
    query: any,
    update: any
  ) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.updateOne(query, { $set: update });
  },

  // Usuń dokument
  async deleteDocument(dbName: string, collectionName: string, query: any) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.deleteOne(query);
  },
};
