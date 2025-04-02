import { Message } from "../models/Message";
import { matchingService } from "./matchingService";

// Symulacja danych - w rzeczywistym projekcie użylibyśmy bazy danych
const messages: Message[] = [];

export const messageService = {
  // Pobierz wszystkie wiadomości
  async getAllMessages(): Promise<Message[]> {
    return messages;
  },

  // Pobierz wiadomość po ID
  async getMessageById(id: string): Promise<Message | null> {
    const message = messages.find((m) => m.id === id);
    return message || null;
  },

  // Pobierz wiadomości dla danego matchu
  async getMessagesByMatchId(matchId: string): Promise<Message[]> {
    return messages
      .filter((m) => m.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  // Pobierz wiadomości dla danego użytkownika (więźniarki lub partnera)
  async getMessagesByUserId(userId: string): Promise<Message[]> {
    return messages
      .filter((m) => m.senderId === userId || m.recipientId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Od najnowszych
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
    const match = await matchingService.getMatchById(messageData.matchId);
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

    messages.push(newMessage);

    // Zaktualizuj licznik wiadomości w matchu
    await matchingService.incrementMessageCount(messageData.matchId);

    return newMessage;
  },

  // Oznacz wiadomość jako przeczytaną
  async markMessageAsRead(id: string): Promise<Message | null> {
    const messageIndex = messages.findIndex((m) => m.id === id);

    if (messageIndex === -1) {
      return null;
    }

    messages[messageIndex].readStatus = true;
    messages[messageIndex].updatedAt = new Date();

    return messages[messageIndex];
  },

  // Aktualizuj status moderacji wiadomości
  async updateModerationStatus(
    id: string,
    status: Message["moderationStatus"],
    reason?: string
  ): Promise<Message | null> {
    const messageIndex = messages.findIndex((m) => m.id === id);

    if (messageIndex === -1) {
      return null;
    }

    messages[messageIndex].moderationStatus = status;

    if (status === "rejected" && reason) {
      messages[messageIndex].moderationReason = reason;
    }

    messages[messageIndex].updatedAt = new Date();

    return messages[messageIndex];
  },

  // Usuń wiadomość
  async deleteMessage(id: string): Promise<boolean> {
    const messageIndex = messages.findIndex((m) => m.id === id);

    if (messageIndex === -1) {
      return false;
    }

    messages.splice(messageIndex, 1);
    return true;
  },

  // Pobierz nieprzeczytane wiadomości dla użytkownika
  async getUnreadMessagesByUserId(userId: string): Promise<Message[]> {
    return messages.filter(
      (m) =>
        m.recipientId === userId &&
        !m.readStatus &&
        m.moderationStatus === "approved"
    );
  },

  // Pobierz wiadomości oczekujące na moderację
  async getPendingModerationMessages(): Promise<Message[]> {
    return messages.filter((m) => m.moderationStatus === "pending");
  },
};
