'use client';

import { X } from 'lucide-react';
import type { Message, CommunicationMember } from '../../types/communication.types';

export interface ReplyPreviewProps {
  replyToMessage: Message;
  sender?: CommunicationMember;
  onDismiss: () => void;
}

export function ReplyPreview({ replyToMessage, sender, onDismiss }: ReplyPreviewProps) {
  const senderName = sender ? `@${sender.username}` : 'Unknown';
  const previewText = replyToMessage.isDeleted
    ? 'This message was deleted'
    : replyToMessage.content;

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border bg-muted/30 text-xs">
      <div className="flex-1 min-w-0 border-l-2 border-primary pl-2">
        <p className="font-semibold text-primary truncate">Replying to {senderName}</p>
        <p className="text-muted-foreground truncate">{previewText}</p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss reply preview"
        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
