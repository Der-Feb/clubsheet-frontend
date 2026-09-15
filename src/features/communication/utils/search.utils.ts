import type { Message } from '../types/communication.types';

/**
 * Searches messages for a given query string (case-insensitive).
 */
export function searchMessages(query: string, messages: Message[]): Message[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  return messages.filter(
    msg => !msg.isDeleted && msg.content && msg.content.toLowerCase().includes(trimmed)
  );
}
