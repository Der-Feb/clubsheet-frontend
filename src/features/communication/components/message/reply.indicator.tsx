'use client';

import type { Message, CommunicationMember } from '../../types/communication.types';

export interface ReplyIndicatorProps {
  replyToMessage?: Message;
  sender?: CommunicationMember;
  onScrollToReply?: (messageId: string) => void;
}

export function ReplyIndicator({
  replyToMessage,
  sender,
  onScrollToReply,
}: ReplyIndicatorProps) {
  if (!replyToMessage) return null;

  const senderName = sender ? `@${sender.username}` : 'Unknown';
  const previewText = replyToMessage.isDeleted
    ? 'This message was deleted'
    : replyToMessage.content;

  return (
    <button
      type="button"
      onClick={() => onScrollToReply?.(replyToMessage.id)}
      className="w-full mb-1.5 p-2 rounded border-l-2 border-primary bg-muted/40 hover:bg-muted/70 text-left transition-colors cursor-pointer"
    >
      <span className="block text-xs font-semibold text-primary truncate">{senderName}</span>
      <span className="block text-xs text-muted-foreground truncate">{previewText}</span>
    </button>
  );
}
