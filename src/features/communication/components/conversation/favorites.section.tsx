'use client';

import { Star } from 'lucide-react';
import type { Group } from '../../types/communication.types';
import { ConversationListItem } from './conversation.list-item';

export interface FavoritesSectionProps {
  groups: Group[];
  activeConversationId: string | null;
  onSelectGroup: (groupId: string) => void;
}

export function FavoritesSection({
  groups,
  activeConversationId,
  onSelectGroup,
}: FavoritesSectionProps) {
  const favoriteGroups = groups.filter(g => g.isFavorite);

  if (favoriteGroups.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Star className="w-3.5 h-3.5 text-warning fill-warning" />
        <span>Favorites</span>
      </div>
      <div className="space-y-0.5 mt-1">
        {favoriteGroups.map(group => (
          <ConversationListItem
            key={`fav-${group.id}`}
            id={group.id}
            name={group.name}
            lastMessage={group.lastMessagePreview}
            lastMessageAt={group.lastMessageAt}
            unreadCount={group.unreadCount}
            isMuted={group.notificationPreference === 'MUTED'}
            isFavorite={true}
            isActive={activeConversationId === group.id}
            avatarInitials={group.name.slice(0, 2).toUpperCase()}
            onClick={() => onSelectGroup(group.id)}
          />
        ))}
      </div>
    </div>
  );
}
