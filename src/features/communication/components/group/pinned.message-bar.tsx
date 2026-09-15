'use client';

import { Pin } from 'lucide-react';
import type { Message } from '../../types/communication.types';

export interface PinnedMessageBarProps {
  pinnedMessage?: Message;
  onScrollToMessage?: (messageId: string) => void;
}

export function PinnedMessageBar({ pinnedMessage, onScrollToMessage }: PinnedMessageBarProps) {
  if (!pinnedMessage) return null;

  return (
    <button
      type="button"
      onClick={() => onScrollToMessage?.(pinnedMessage.id)}
      className="w-full flex items-center gap-2 px-4 py-1.5 bg-primary/5 border-b border-primary/10 text-xs text-foreground hover:bg-primary/10 text-left transition-colors cursor-pointer"
    >
      <Pin className="w-3.5 h-3.5 text-primary shrink-0" />
      <span className="font-semibold text-primary shrink-0">Pinned:</span>
      <span className="truncate text-muted-foreground">{pinnedMessage.content}</span>
    </button>
  );
}
