'use client';

import { BellOff, Star } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useIsHydrated } from '@/hooks/use-is-hydrated.hook';

export interface ConversationListItemProps {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isMuted?: boolean;
  isFavorite?: boolean;
  isActive: boolean;
  avatarInitials: string;
  isOnline?: boolean;
  onClick: () => void;
}

function formatRelativeTimestamp(isoDate?: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMM d');
}

export function ConversationListItem({
  name,
  lastMessage,
  lastMessageAt,
  unreadCount,
  isMuted,
  isFavorite,
  isActive,
  avatarInitials,
  isOnline,
  onClick,
}: ConversationListItemProps) {
  const isHydrated = useIsHydrated();
  const timestamp = isHydrated ? formatRelativeTimestamp(lastMessageAt) : '';
  const hasUnread = unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
        isActive
          ? 'bg-primary/10 text-foreground font-medium'
          : 'hover:bg-muted/60 text-foreground'
      }`}
    >
      {/* Avatar Container */}
      <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 text-primary font-semibold text-sm">
        {avatarInitials}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-background" />
        )}
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span
            className={`truncate text-sm ${
              hasUnread ? 'font-bold text-foreground' : 'font-medium text-foreground'
            }`}
          >
            {name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">{timestamp}</span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-xs text-muted-foreground">
            {lastMessage || 'No messages yet'}
          </p>

          <div className="shrink-0 flex items-center gap-1.5">
            {isMuted && <BellOff className="w-3.5 h-3.5 text-muted-foreground" />}
            {isFavorite && <Star className="w-3.5 h-3.5 text-warning fill-warning" />}
            {hasUnread && (
              <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
