'use client';

import { useEffect, useRef } from 'react';

export interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '✅', '⚽', '😊', '🎉', '🚀', '👏', '🔥', '🙏', '💪'];

export function EmojiPicker({ isOpen, onClose, onSelectEmoji }: EmojiPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full mb-2 left-0 z-30 p-2 bg-popover border border-border rounded-xl shadow-lg text-popover-foreground grid grid-cols-6 gap-1"
    >
      {COMMON_EMOJIS.map(emoji => (
        <button
          key={emoji}
          type="button"
          onClick={() => {
            onSelectEmoji(emoji);
            onClose();
          }}
          className="p-2 hover:bg-muted rounded-lg text-base transition-colors flex items-center justify-center cursor-pointer"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
