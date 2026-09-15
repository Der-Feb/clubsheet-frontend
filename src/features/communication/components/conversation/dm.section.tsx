'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import type { DirectMessage, CommunicationMember } from '../../types/communication.types';
import { ConversationListItem } from './conversation.list-item';

export interface DmSectionProps {
  directMessages: DirectMessage[];
  members: Record<string, CommunicationMember>;
  currentUserId: string;
  activeConversationId: string | null;
  onSelectDm: (dmId: string) => void;
  defaultExpanded?: boolean;
}

export function DmSection({
  directMessages,
  members,
  currentUserId,
  activeConversationId,
  onSelectDm,
  defaultExpanded = true,
}: DmSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (directMessages.length === 0) {
    return null;
  }

  const totalUnread = directMessages.reduce((acc, dm) => acc + dm.unreadCount, 0);

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
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Direct Messages</span>
          </div>
          <span className="text-muted-foreground/70 font-normal">({directMessages.length})</span>
        </div>

        {!isExpanded && totalUnread > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {totalUnread}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="space-y-0.5 mt-1">
          {directMessages.map(dm => {
            // Other participants in DM
            const otherParticipantIds = dm.participantIds.filter(id => id !== currentUserId);
            const otherMembers = otherParticipantIds
              .map(id => members[id])
              .filter((m): m is CommunicationMember => Boolean(m));

            const name =
              otherMembers.length > 0
                ? otherMembers.map(m => `@${m.username}`).join(', ')
                : 'Direct Message';

            const avatarInitials =
              otherMembers.length === 1
                ? otherMembers[0].initials
                : otherMembers.length > 1
                  ? `${otherMembers[0].displayName[0]}${otherMembers[1].displayName[0]}`
                  : 'DM';

            const isOnline = otherMembers.some(m => m.isOnline);

            return (
              <ConversationListItem
                key={dm.id}
                id={dm.id}
                name={name}
                lastMessage={dm.lastMessagePreview}
                lastMessageAt={dm.lastMessageAt}
                unreadCount={dm.unreadCount}
                isMuted={dm.notificationPreference === 'MUTED'}
                isActive={activeConversationId === dm.id}
                avatarInitials={avatarInitials}
                isOnline={isOnline}
                onClick={() => onSelectDm(dm.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
