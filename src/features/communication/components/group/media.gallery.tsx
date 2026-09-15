'use client';

import { Image as ImageIcon } from 'lucide-react';
import type { Message } from '../../types/communication.types';

export interface MediaGalleryProps {
  messages: Message[];
}

export function MediaGallery({ messages }: MediaGalleryProps) {
  const mediaAttachments = messages.filter(m => !m.isDeleted).flatMap(m =>
    m.attachments.filter(
      a => a.mimeType.startsWith('image/') || a.mimeType.startsWith('video/')
    )
  );

  if (mediaAttachments.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
        No media shared in this group yet
      </div>
    );
  }

  return (
    <div className="p-3 grid grid-cols-3 gap-2">
      {mediaAttachments.map(att => (
        <div
          key={att.id}
          className="aspect-square rounded-lg bg-muted/60 border border-border flex flex-col items-center justify-center p-1 text-[10px] text-muted-foreground overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ImageIcon className="w-5 h-5 text-primary mb-1" />
          <span className="truncate w-full text-center px-1 font-medium">{att.fileName}</span>
        </div>
      ))}
    </div>
  );
}
