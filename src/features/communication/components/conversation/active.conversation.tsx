'use client';

import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useCommunication } from '../../context/communication.context';
import { useActiveConversation } from '../../hooks/use-conversation.hook';
import type { Group } from '../../types/communication.types';
import { ConversationHeader } from './conversation.header';
import { MessageList } from '../message/message.list';
import { MessageComposer } from '../message/message.composer';
import { SearchOverlay } from '../search/search.overlay';

export function ActiveConversation() {
  const {
    activeConversationId,
    currentUserId,
    members,
    messages,
    markConversationAsRead,
    setReplyTo,
    addReaction,
    removeReaction,
    castVote,
    respondToEvent,
  } = useCommunication();

  const { conversation, type } = useActiveConversation();
  const currentMember = members[currentUserId];

  // Auto mark conversation as read when selected
  useEffect(() => {
    if (activeConversationId) {
      markConversationAsRead(activeConversationId);
    }
  }, [activeConversationId, markConversationAsRead]);

  if (!conversation || !activeConversationId || !type) {
    return (
      <main className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-card text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground">No Conversation Selected</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Select a group or direct message from the sidebar to view your conversation.
        </p>
      </main>
    );
  }

  const activeMessages = messages[activeConversationId] || [];

  const handleToggleReaction = (msgId: string, emoji: string) => {
    const msg = activeMessages.find(m => m.id === msgId);
    if (!msg) return;

    const existing = msg.reactions.find(r => r.emoji === emoji);
    const hasReacted = existing && existing.memberIds.includes(currentUserId);

    if (hasReacted) {
      removeReaction(msgId, emoji);
    } else {
      addReaction(msgId, emoji);
    }
  };

  const handleScrollToMessage = (targetId: string) => {
    const el = document.getElementById(`msg-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-primary/10');
      setTimeout(() => el.classList.remove('bg-primary/10'), 2000);
    }
  };

  return (
    <main className="relative flex-1 h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <ConversationHeader onScrollToMessage={handleScrollToMessage} />

      {/* Messages List */}
      <MessageList
        messages={activeMessages}
        currentUserId={currentUserId}
        membersRecord={members}
        isGroup={type === 'group'}
        onReply={id => setReplyTo(id)}
        onToggleReaction={handleToggleReaction}
        onVote={castVote}
        onRespondToEvent={respondToEvent}
        onScrollToMessage={handleScrollToMessage}
      />

      {/* Composer */}
      <MessageComposer
        conversationId={activeConversationId}
        isGroup={type === 'group'}
        group={type === 'group' ? (conversation as Group) : undefined}
        currentMember={currentMember}
      />

      {/* Search Overlay */}
      <SearchOverlay onSelectResult={handleScrollToMessage} />
    </main>
  );
}
