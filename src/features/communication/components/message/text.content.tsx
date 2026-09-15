'use client';

import { useMemo } from 'react';
import type { CommunicationMember } from '../../types/communication.types';

export interface TextContentProps {
  content: string;
  mentions?: string[];
  membersRecord?: Record<string, CommunicationMember>;
}

export function TextContent({ content, membersRecord = {} }: TextContentProps) {
  // Regex to match URLs or @mentions
  const elements = useMemo(() => {
    if (!content) return null;

    // Pattern for URLs and @word patterns
    const regex = /(https?:\/\/[^\s]+|@[a-zA-Z0-9_.]+)/g;
    const parts = content.split(regex);

    return parts.map((part, idx) => {
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary hover:text-primary-hover break-all"
          >
            {part}
          </a>
        );
      }

      if (part.startsWith('@')) {
        const usernameWithoutAt = part.slice(1);
        const mentionedMember = Object.values(membersRecord).find(
          m => m.username.toLowerCase() === usernameWithoutAt.toLowerCase()
        );

        return (
          <span
            key={idx}
            className="inline-block px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold text-xs mx-0.5"
          >
            {mentionedMember ? `@${mentionedMember.displayName}` : part}
          </span>
        );
      }

      return <span key={idx}>{part}</span>;
    });
  }, [content, membersRecord]);

  return <div className="leading-relaxed break-words">{elements}</div>;
}
