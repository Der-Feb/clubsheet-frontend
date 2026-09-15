'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Reply, Smile } from 'lucide-react';
import { useIsHydrated } from '@/hooks/use-is-hydrated.hook';
import type {
  Message,
  CommunicationMember,
  EventResponse,
} from '../../types/communication.types';
import { ReplyIndicator } from './reply.indicator';
import { ReactionBar } from './reaction.bar';
import { MessageContextMenu } from './message.context-menu';
import { MessageContent } from './message.content';

export interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
  sender?: CommunicationMember;
  replyToMessage?: Message;
  replyToSender?: CommunicationMember;
  isGroup?: boolean;
  membersRecord: Record<string, CommunicationMember>;
  onReply: (messageId: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onVote: (conversationId: string, messageId: string, optionId: string) => void;
  onRespondToEvent: (
    conversationId: string,
    messageId: string,
    response: EventResponse
  ) => void;
  onScrollToMessage?: (messageId: string) => void;
}

export function MessageBubble({
  message,
  currentUserId,
  sender,
  replyToMessage,
  replyToSender,
  isGroup,
  membersRecord,
  onReply,
  onToggleReaction,
  onVote,
  onRespondToEvent,
  onScrollToMessage,
}: MessageBubbleProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHydrated = useIsHydrated();

  const isOwn = message.senderId === currentUserId;
  const createdAtDate = new Date(message.createdAt);
  const timeFormatted = !isHydrated || isNaN(createdAtDate.getTime())
    ? ''
    : format(createdAtDate, 'h:mm a');
  const fullDateTime = !isHydrated || isNaN(createdAtDate.getTime())
    ? ''
    : format(createdAtDate, 'PPP p');

  const handleCopyText = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
    }
  };

  return (
    <div
      id={`msg-${message.id}`}
      className={`group relative flex flex-col my-1.5 ${isOwn ? 'items-end' : 'items-start'}`}
    >
      {/* Sender Name in Groups for non-own messages */}
      {!isOwn && isGroup && sender && (
        <span className="text-xs font-semibold text-muted-foreground mb-1 ml-1 font-mono">
          @{sender.username}
        </span>
      )}

      {/* Bubble Container */}
      <div className="relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
        {/* Focus + Hover Quick Action Bar (fine pointers) */}
        <div
          className={`absolute top-0 -translate-y-1/2 z-10 flex items-center gap-0.5 p-1 rounded-lg bg-popover border border-border shadow-md transition-opacity duration-150 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto touch:hidden ${
            isOwn ? 'right-full mr-2' : 'left-full ml-2'
          }`}
        >
          <button
            type="button"
            onClick={() => onReply(message.id)}
            aria-label="Reply to message"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="React or more actions"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="More options"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Coarse-pointer (touch) visible trigger */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Message actions"
          className={`absolute top-0 -translate-y-1/2 z-10 p-1.5 rounded-lg bg-popover border border-border shadow-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer touch:visible fine:hidden ${
            isOwn ? 'right-full mr-2' : 'left-full ml-2'
          }`}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Bubble Content Box */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl shadow-sm ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-xs'
              : 'bg-card text-card-foreground border border-border rounded-bl-xs'
          }`}
        >
          {/* Reply Indicator if message is a reply */}
          {replyToMessage && (
            <ReplyIndicator
              replyToMessage={replyToMessage}
              sender={replyToSender}
              onScrollToReply={onScrollToMessage}
            />
          )}

          {/* Deleted Message State vs Active Content */}
          {message.isDeleted ? (
            <p className="text-xs italic opacity-75">This message was deleted</p>
          ) : (
            <MessageContent
              message={message}
              currentUserId={currentUserId}
              membersRecord={membersRecord}
              onVote={onVote}
              onRespondToEvent={onRespondToEvent}
            />
          )}

          {/* Timestamp */}
          <div
            title={fullDateTime}
            className={`text-[10px] mt-1 text-right select-none ${
              isOwn ? 'text-primary-foreground/75' : 'text-muted-foreground'
            }`}
          >
            {timeFormatted}
          </div>
        </div>

        {/* Reaction Bar */}
        <ReactionBar
          reactions={message.reactions}
          currentUserId={currentUserId}
          onToggleReaction={emoji => onToggleReaction(message.id, emoji)}
        />

        {/* Context Menu */}
        <MessageContextMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onReply={() => onReply(message.id)}
          onReact={emoji => onToggleReaction(message.id, emoji)}
          onCopy={handleCopyText}
          canDelete={isOwn}
        />
      </div>
    </div>
  );
}
