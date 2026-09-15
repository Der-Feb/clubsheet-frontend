'use client';

import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { isSameDay } from 'date-fns';
import type { Message, CommunicationMember, EventResponse } from '../../types/communication.types';
import { MessageBubble } from './message.bubble';
import { DateSeparator } from './date.separator';
import { SystemMessage } from './system.message';

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  membersRecord: Record<string, CommunicationMember>;
  isGroup?: boolean;
  onReply: (messageId: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onVote: (conversationId: string, messageId: string, optionId: string) => void;
  onRespondToEvent: (conversationId: string, messageId: string, response: EventResponse) => void;
}

export function MessageList({
  messages,
  currentUserId,
  membersRecord,
  isGroup,
  onReply,
  onToggleReaction,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleScrollToMessage = (targetId: string) => {
    const el = document.getElementById(`msg-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-primary/10');
      setTimeout(() => el.classList.remove('bg-primary/10'), 2000);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-semibold text-foreground">No messages yet</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Start the conversation by sending a message below.
        </p>
      </div>
    );
  }

  // Create lookup map for messages
  const messageMap = new Map<string, Message>();
  for (const m of messages) {
    messageMap.set(m.id, m);
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-1 focus:outline-none"
    >
      <ul className="list-none m-0 p-0 space-y-1">
        {messages.map((msg, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : undefined;

          const currentDate = new Date(msg.createdAt);
          const prevDate = prevMsg ? new Date(prevMsg.createdAt) : undefined;

          const showDateSeparator =
            !prevDate || isNaN(prevDate.getTime()) || !isSameDay(currentDate, prevDate);

          const sender = membersRecord[msg.senderId];
          const replyToMsg = msg.replyTo ? messageMap.get(msg.replyTo) : undefined;
          const replyToSender = replyToMsg ? membersRecord[replyToMsg.senderId] : undefined;

          return (
            <li key={msg.id}>
              {showDateSeparator && <DateSeparator dateIso={msg.createdAt} />}

              {msg.messageType === 'SYSTEM' ? (
                <SystemMessage content={msg.content} />
              ) : (
                <MessageBubble
                  message={msg}
                  currentUserId={currentUserId}
                  sender={sender}
                  replyToMessage={replyToMsg}
                  replyToSender={replyToSender}
                  isGroup={isGroup}
                  onReply={onReply}
                  onToggleReaction={onToggleReaction}
                  onScrollToMessage={handleScrollToMessage}
                />
              )}
            </li>
          );
        })}
      </ul>
      <div ref={bottomRef} />
    </div>
  );
}
