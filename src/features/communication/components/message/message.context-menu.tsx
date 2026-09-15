'use client';

import { useEffect, useRef } from 'react';
import { Reply, Copy, Pin, Trash2 } from 'lucide-react';

export interface MessageContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onReply: () => void;
  onReact: (emoji: string) => void;
  onCopy: () => void;
  onPin?: () => void;
  onDelete?: () => void;
  canPin?: boolean;
  canDelete?: boolean;
  position?: { x: number; y: number };
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '✅', '⚽'];

export function MessageContextMenu({
  isOpen,
  onClose,
  onReply,
  onReact,
  onCopy,
  onPin,
  onDelete,
  canPin,
  canDelete,
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
      ref={menuRef}
      className="absolute right-2 top-2 z-30 min-w-40 py-1 bg-popover border border-border rounded-lg shadow-lg text-popover-foreground text-xs"
    >
      {/* Quick Emojis Bar */}
      <div className="flex items-center justify-around px-2 py-1.5 border-b border-border">
        {QUICK_EMOJIS.map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onReact(emoji);
              onClose();
            }}
            className="p-1 hover:bg-muted rounded text-sm transition-colors cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>

      <menu className="py-1 m-0 p-0 list-none">
        <li>
          <button
            type="button"
            onClick={() => {
              onReply();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted text-left transition-colors cursor-pointer"
          >
            <Reply className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Reply</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={() => {
              onCopy();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted text-left transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Copy Text</span>
          </button>
        </li>

        {canPin && onPin && (
          <li>
            <button
              type="button"
              onClick={() => {
                onPin();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted text-left transition-colors cursor-pointer"
            >
              <Pin className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Pin Message</span>
            </button>
          </li>
        )}

        {canDelete && onDelete && (
          <li>
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted text-left text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </li>
        )}
      </menu>
    </div>
  );
}
