'use client';

import type { Group } from '../../types/communication.types';
import { useCommunication } from '../../context/communication.context';
import { useActiveConversation, useConversationMembers } from '../../hooks/use-conversation.hook';
import { GroupAvatarStack } from '../group/group.avatar-stack';
import { PinnedMessageBar } from '../group/pinned.message-bar';
import { HeaderActions } from './header.actions';

export interface ConversationHeaderProps {
  onScrollToMessage?: (messageId: string) => void;
}

export function ConversationHeader({ onScrollToMessage }: ConversationHeaderProps) {
  const {
    activeConversationId,
    activeConversationType,
    isDetailsPanelOpen,
    openDetailsPanel,
    closeDetailsPanel,
    toggleSearch,
    messages,
    currentUserId,
  } = useCommunication();

  const { conversation, type } = useActiveConversation();
  const members = useConversationMembers(activeConversationId, activeConversationType);

  if (!conversation) return null;

  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Pinned message (first pinned ID if group)
  const groupConv = type === 'group' ? (conversation as Group) : null;
  const pinnedMessageId = groupConv?.pinnedMessageIds?.[0];
  const pinnedMessage = pinnedMessageId
    ? activeMessages.find(m => m.id === pinnedMessageId)
    : undefined;

  const displayMembers = type === 'dm'
    ? members.filter(m => m.id !== currentUserId)
    : members;

  const conversationName = groupConv ? groupConv.name : displayMembers.map(m => `@${m.username}`).join(', ');
  const subtitle =
    type === 'group'
      ? `${members.length} member${members.length === 1 ? '' : 's'}`
      : displayMembers.some(m => m.isOnline)
        ? 'Online'
        : 'Offline';

  return (
    <header className="flex flex-col bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Info Section */}
        <div className="flex items-center gap-3 min-w-0">
          {type === 'group' ? (
            <GroupAvatarStack members={members} />
          ) : (
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm shrink-0">
              {conversationName.slice(0, 2).toUpperCase()}
              {displayMembers.some(m => m.isOnline) && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
              )}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground truncate">{conversationName}</h2>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>

        {/* Right Header Actions */}
        <HeaderActions
          onToggleSearch={toggleSearch}
          onToggleDetails={isDetailsPanelOpen ? closeDetailsPanel : openDetailsPanel}
        />
      </div>

      {/* Pinned Message Bar if present */}
      <PinnedMessageBar pinnedMessage={pinnedMessage} onScrollToMessage={onScrollToMessage} />
    </header>
  );
}
