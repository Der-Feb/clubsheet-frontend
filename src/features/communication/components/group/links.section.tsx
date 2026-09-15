'use client';

import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Message } from '../../types/communication.types';

export interface LinksSectionProps {
  messages: Message[];
}

export function LinksSection({ messages }: LinksSectionProps) {
  const extractedLinks = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links: { url: string; msgId: string }[] = [];

    for (const msg of messages) {
      if (msg.isDeleted || !msg.content) continue;
      const matches = msg.content.match(urlRegex);
      if (matches) {
        for (const url of matches) {
          links.push({ url, msgId: msg.id });
        }
      }
    }
    return links;
  }, [messages]);

  if (extractedLinks.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-40" />
        No links shared in this group yet
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {extractedLinks.map((item, idx) => (
        <a
          key={`${item.msgId}-${idx}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-xs text-primary"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span className="truncate flex-1 font-medium">{item.url}</span>
        </a>
      ))}
    </div>
  );
}
