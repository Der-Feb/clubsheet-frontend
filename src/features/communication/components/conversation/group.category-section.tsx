'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Group } from '../../types/communication.types';
import { ConversationListItem } from './conversation.list-item';

export interface GroupCategorySectionProps {
  title: string;
  groups: Group[];
  activeConversationId: string | null;
  onSelectGroup: (groupId: string) => void;
  defaultExpanded?: boolean;
}

export function GroupCategorySection({
  title,
  groups,
  activeConversationId,
  onSelectGroup,
  defaultExpanded = true,
}: GroupCategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (groups.length === 0) {
    return null;
  }

  const totalUnread = groups.reduce((acc, g) => acc + g.unreadCount, 0);

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{title}</span>
          <span className="text-muted-foreground/70 font-normal">({groups.length})</span>
        </div>

        {!isExpanded && totalUnread > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {totalUnread}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="space-y-0.5 mt-1">
          {groups.map(group => (
            <ConversationListItem
              key={group.id}
              id={group.id}
              name={group.name}
              lastMessage={group.lastMessagePreview}
              lastMessageAt={group.lastMessageAt}
              unreadCount={group.unreadCount}
              isMuted={group.notificationPreference === 'MUTED'}
              isFavorite={group.isFavorite}
              isActive={activeConversationId === group.id}
              avatarInitials={group.name.slice(0, 2).toUpperCase()}
              onClick={() => onSelectGroup(group.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
