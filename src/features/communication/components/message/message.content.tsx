'use client';

import { FileText, Image as ImageIcon, Music, Video } from 'lucide-react';
import type { Message, CommunicationMember, EventResponse } from '../../types/communication.types';
import { TextContent } from './text.content';
import { SystemMessage } from './system.message';
import { PollCard } from '../rich-content/poll.card';
import { EventCard } from '../rich-content/event.card';

export interface MessageContentProps {
  message: Message;
  currentUserId: string;
  membersRecord: Record<string, CommunicationMember>;
  onVote: (conversationId: string, messageId: string, optionId: string) => void;
  onRespondToEvent: (conversationId: string, messageId: string, response: EventResponse) => void;
}

export function MessageContent({
  message,
  currentUserId,
  membersRecord,
  onVote,
  onRespondToEvent,
}: MessageContentProps) {
  if (message.messageType === 'SYSTEM') {
    return <SystemMessage content={message.content} />;
  }

  if (message.messageType === 'POLL' && message.pollData) {
    return (
      <PollCard
        pollData={message.pollData}
        messageId={message.id}
        conversationId={message.conversationId}
        currentUserId={currentUserId}
        onVote={onVote}
      />
    );
  }

  if (message.messageType === 'EVENT' && message.eventData) {
    return (
      <EventCard
        eventData={message.eventData}
        messageId={message.id}
        conversationId={message.conversationId}
        currentUserId={currentUserId}
        onRespond={onRespondToEvent}
      />
    );
  }

  // Attachments placeholders (Image, Video, Audio, File)
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <div className="space-y-2">
      {message.content && (
        <TextContent
          content={message.content}
          mentions={message.mentions}
          membersRecord={membersRecord}
        />
      )}

      {hasAttachments && (
        <div className="space-y-1.5 mt-2">
          {message.attachments.map(att => (
            <div
              key={att.id}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/50 border border-border text-xs"
            >
              {att.mimeType.startsWith('image/') ? (
                <ImageIcon className="w-4 h-4 text-primary shrink-0" />
              ) : att.mimeType.startsWith('video/') ? (
                <Video className="w-4 h-4 text-primary shrink-0" />
              ) : att.mimeType.startsWith('audio/') ? (
                <Music className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-primary shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{att.fileName}</p>
                <p className="text-[10px] text-muted-foreground">
                  {(att.fileSize / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
