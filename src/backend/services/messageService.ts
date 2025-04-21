import { Message } from "../models/Message";
import { matchingService } from "./matchingService";
import { mongodbService } from "./mongodbService";
import { dbName } from "../utils/mongodb";

// Symulacja danych - w rzeczywistym projekcie użylibyśmy bazy danych
const messages: Message[] = [];

export const messageService = {
  // Pobierz wszystkie wiadomości
  async getAllMessages(): Promise<Message[]> {
    const messages = await mongodbService.findDocuments<Message>(
      dbName,
      "messages"
    );
    return messages;
  },

  // Pobierz wiadomość po ID
  async getMessageById(id: string): Promise<Message | null> {
    const message = await mongodbService.findDocument<Message>(
      dbName,
      "messages",
      { id }
    );
    return message;
  },

  // Pobierz wiadomości dla danego matchu
  async getMessagesByMatchId(matchId: string): Promise<Message[]> {
    const messages = await mongodbService.findDocuments<Message>(
      dbName,
      "messages",
      { matchId },
      { sort: { createdAt: 1 } }
    );
    return messages;
  },

  // Pobierz wiadomości dla danego użytkownika (więźniarki lub partnera)
  async getMessagesByUserId(userId: string): Promise<Message[]> {
    const messages = await mongodbService.findDocuments<Message>(
      dbName,
      "messages",
      {
        $or: [{ senderId: userId }, { recipientId: userId }],
      },
      { sort: { createdAt: -1 } }
    );
    return messages;
  },

  // Utwórz nową wiadomość
  async createMessage(messageData: {
    matchId: string;
    senderId: string;
    senderType: Message["senderType"];
    recipientId: string;
    content: string;
    attachments?: string[];
  }): Promise<Message> {
    // Sprawdź, czy match istnieje
    const match = await mongodbService.findDocument(dbName, "matches", {
      id: messageData.matchId,
    });

    if (!match) {
      throw new Error("Match nie istnieje");
    }

    // Sprawdź, czy match jest aktywny
    if (match.status !== "accepted") {
      throw new Error(
        'Nie można wysłać wiadomości do matchu o statusie innym niż "accepted"'
      );
    }

    // Sprawdź, czy nadawca jest częścią matchu
    if (
      messageData.senderType === "prisoner" &&
      match.prisonerId !== messageData.senderId
    ) {
      throw new Error("Nadawca nie jest częścią tego matchu");
    }

    if (
      messageData.senderType === "partner" &&
      match.partnerId !== messageData.senderId
    ) {
      throw new Error("Nadawca nie jest częścią tego matchu");
    }

    // Sprawdź, czy odbiorca jest częścią matchu
    if (
      match.prisonerId !== messageData.recipientId &&
      match.partnerId !== messageData.recipientId
    ) {
      throw new Error("Odbiorca nie jest częścią tego matchu");
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      matchId: messageData.matchId,
      senderId: messageData.senderId,
      senderType: messageData.senderType,
      recipientId: messageData.recipientId,
      content: messageData.content,
      attachments: messageData.attachments,
      readStatus: false,
      moderationStatus: "pending", // Wszystkie wiadomości przechodzą moderację
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Zapisz wiadomość w bazie danych
    await mongodbService.insertDocument(dbName, "messages", newMessage);

    // Zaktualizuj licznik wiadomości w matchu
    await mongodbService.updateDocument(
      dbName,
      "matches",
      { id: messageData.matchId },
      {
        messageCount: (match.messageCount || 0) + 1,
        lastInteraction: new Date(),
        updatedAt: new Date(),
      }
    );

    return newMessage;
  },

  // Oznacz wiadomość jako przeczytaną
  async markMessageAsRead(id: string): Promise<Message | null> {
    const message = await mongodbService.findDocument<Message>(
      dbName,
      "messages",
      { id }
    );

    if (!message) {
      return null;
    }

    await mongodbService.updateDocument(
      dbName,
      "messages",
      { id },
      {
        readStatus: true,
        updatedAt: new Date(),
      }
    );

    return {
      ...message,
      readStatus: true,
      updatedAt: new Date(),
    };
  },

  // Aktualizuj status moderacji wiadomości
  async updateModerationStatus(
    id: string,
    status: Message["moderationStatus"],
    reason?: string
  ): Promise<Message | null> {
    const message = await mongodbService.findDocument<Message>(
      dbName,
      "messages",
      { id }
    );

    if (!message) {
      return null;
    }

    const update: Partial<Message> = {
      moderationStatus: status,
      updatedAt: new Date(),
    };

    if (status === "rejected" && reason) {
      update.moderationReason = reason;
    }

    await mongodbService.updateDocument(dbName, "messages", { id }, update);

    return {
      ...message,
      ...update,
    };
  },

  // Usuń wiadomość
  async deleteMessage(id: string): Promise<boolean> {
    const message = await mongodbService.findDocument<Message>(
      dbName,
      "messages",
      { id }
    );

    if (!message) {
      return false;
    }

    await mongodbService.deleteDocument(dbName, "messages", { id });
    return true;
  },

  // Pobierz nieprzeczytane wiadomości dla użytkownika
  async getUnreadMessagesByUserId(userId: string): Promise<Message[]> {
    const messages = await mongodbService.findDocuments<Message>(
      dbName,
      "messages",
      {
        recipientId: userId,
        readStatus: false,
        moderationStatus: "approved",
      }
    );
    return messages;
  },

  // Pobierz wiadomości oczekujące na moderację
  async getPendingModerationMessages(): Promise<Message[]> {
    const messages = await mongodbService.findDocuments<Message>(
      dbName,
      "messages",
      { moderationStatus: "pending" }
    );
    return messages;
  },

  // Pobierz liczbę nieprzeczytanych wiadomości dla użytkownika
  async getUnreadMessageCount(userId: string): Promise<number> {
    const count = await mongodbService.countDocuments(dbName, "messages", {
      recipientId: userId,
      readStatus: false,
      moderationStatus: "approved",
    });
    return count;
  },

  // Pobierz statystyki wiadomości dla administratora
  async getMessageStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    last24h: number;
  }> {
    const collection = await mongodbService.getCollection(dbName, "messages");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const total = await collection.countDocuments();
    const pending = await collection.countDocuments({
      moderationStatus: "pending",
    });
    const approved = await collection.countDocuments({
      moderationStatus: "approved",
    });
    const rejected = await collection.countDocuments({
      moderationStatus: "rejected",
    });
    const last24h = await collection.countDocuments({
      createdAt: { $gte: yesterday },
    });

    return {
      total,
      pending,
      approved,
      rejected,
      last24h,
    };
  },
};
