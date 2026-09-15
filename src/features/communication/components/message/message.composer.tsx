'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Smile, Paperclip, Lock } from 'lucide-react';
import { useCommunication } from '../../context/communication.context';
import { canPerformAction } from '../../utils/permissions.utils';
import type { Group, CommunicationMember } from '../../types/communication.types';
import { ReplyPreview } from './reply.preview';
import { EmojiPicker } from './emoji.picker';

export interface MessageComposerProps {
  conversationId: string;
  isGroup?: boolean;
  group?: Group;
  currentMember?: CommunicationMember;
}

export function MessageComposer({
  conversationId,
  isGroup,
  group,
  currentMember,
}: MessageComposerProps) {
  const {
    sendMessage,
    replyToMessageId,
    setReplyTo,
    messages,
    members,
  } = useCommunication();

  const [draftsByConversation, setDraftsByConversation] = useState<Record<string, string>>({});
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const text = draftsByConversation[conversationId] ?? '';

  const setText = (nextText: string | ((currentText: string) => string)) => {
    setDraftsByConversation(prev => {
      const currentText = prev[conversationId] ?? '';
      const value = typeof nextText === 'function' ? nextText(currentText) : nextText;

      if (!value) {
        const remainingDrafts = { ...prev };
        delete remainingDrafts[conversationId];
        return remainingDrafts;
      }

      return { ...prev, [conversationId]: value };
    });
  };

  // Permission check for sending messages
  const canSend = isGroup && group
    ? canPerformAction(currentMember, group, 'canSendMessages')
    : true;

  // Active reply message details
  const activeMessages = messages[conversationId] || [];
  const replyToMsg = replyToMessageId
    ? activeMessages.find(m => m.id === replyToMessageId)
    : undefined;
  const replyToSender = replyToMsg ? members[replyToMsg.senderId] : undefined;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !canSend) return;

    sendMessage(conversationId, trimmed, replyToMsg?.id);
    setText('');
    setReplyTo(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  if (!canSend) {
    return (
      <div className="p-3 bg-muted/60 border-t border-border text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
        <Lock className="w-4 h-4 shrink-0" />
        <span>Only administrators can send messages in this group.</span>
      </div>
    );
  }

  return (
    <div className="relative border-t border-border bg-card">
      {/* Reply Preview Strip */}
      {replyToMsg && (
        <ReplyPreview
          replyToMessage={replyToMsg}
          sender={replyToSender}
          onDismiss={() => setReplyTo(null)}
        />
      )}

      {/* Main Composer Box */}
      <div className="flex items-end gap-2 p-3">
        {/* Emoji & Attachment Triggers */}
        <div className="relative flex items-center gap-1 shrink-0 pb-1">
          <button
            type="button"
            onMouseDown={event => event.stopPropagation()}
            onClick={() => setIsEmojiOpen(!isEmojiOpen)}
            aria-label="Add emoji"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <Smile className="w-4 h-4" />
          </button>

          <EmojiPicker
            isOpen={isEmojiOpen}
            onClose={() => setIsEmojiOpen(false)}
            onSelectEmoji={handleInsertEmoji}
          />

          <button
            type="button"
            aria-label="Attach file (coming soon)"
            disabled
            className="p-2 rounded-lg text-muted-foreground/40 cursor-not-allowed"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full resize-none max-h-32 px-3 py-2 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
