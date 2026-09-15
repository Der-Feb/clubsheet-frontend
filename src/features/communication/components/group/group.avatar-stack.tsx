'use client';

import type { CommunicationMember } from '../../types/communication.types';

export interface GroupAvatarStackProps {
  members: CommunicationMember[];
  maxVisible?: number;
}

export function GroupAvatarStack({ members, maxVisible = 3 }: GroupAvatarStackProps) {
  const visible = members.slice(0, maxVisible);
  const overflowCount = members.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {visible.map((m, idx) => (
        <div
          key={m.id || idx}
          title={m.displayName}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold text-xs ring-2 ring-background shrink-0"
        >
          {m.initials}
        </div>
      ))}

      {overflowCount > 0 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-[10px] ring-2 ring-background shrink-0">
          +{overflowCount}
        </div>
      )}
    </div>
  );
}
