// src/backend/services/mongodbService.ts

import { Document } from "mongodb";
import clientPromise from "../utils/mongodb";

export const mongodbService = {
  async getCollection(dbName: string, collectionName: string) {
    const client = await clientPromise;
    const db = client.db(dbName);
    return db.collection(collectionName);
  },

  async findDocument<T = Document>(
    dbName: string,
    collectionName: string,
    query: any
  ): Promise<T | null> {
    const collection = await this.getCollection(dbName, collectionName);
    const result = await collection.findOne(query);
    return result as unknown as T | null;
  },

  async findDocuments<T = Document>(
    dbName: string,
    collectionName: string,
    query: any = {}
  ): Promise<T[]> {
    const collection = await this.getCollection(dbName, collectionName);
    const result = await collection.find(query).toArray();
    return result as unknown as T[];
  },

  async insertDocument<T = Document>(
    dbName: string,
    collectionName: string,
    document: T
  ) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.insertOne(document as Document);
  },

  async updateDocument(
    dbName: string,
    collectionName: string,
    query: any,
    update: any
  ) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.updateOne(query, { $set: update });
  },

  async deleteDocument(dbName: string, collectionName: string, query: any) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.deleteOne(query);
  },
};
