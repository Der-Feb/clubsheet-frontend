'use client';

import type { MessageReaction } from '../../types/communication.types';

export interface ReactionBarProps {
  reactions: MessageReaction[];
  currentUserId: string;
  onToggleReaction: (emoji: string) => void;
}

export function ReactionBar({ reactions, currentUserId, onToggleReaction }: ReactionBarProps) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1.5">
      {reactions.map(r => {
        const hasReacted = r.memberIds.includes(currentUserId);
        return (
          <button
            key={r.emoji}
            type="button"
            onClick={() => onToggleReaction(r.emoji)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              hasReacted
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            <span>{r.emoji}</span>
            <span>{r.count}</span>
          </button>
        );
      })}
    </div>
  );
}
