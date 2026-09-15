'use client';

import { Shield, Crown } from 'lucide-react';
import type { CommunicationMember } from '../../types/communication.types';

export interface MemberListItemProps {
  member: CommunicationMember;
  isAdmin?: boolean;
  isModerator?: boolean;
}

export function MemberListItem({ member, isAdmin, isModerator }: MemberListItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs">
        {member.initials}
        {member.isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground truncate font-mono">
            @{member.username}
          </span>
          {isAdmin && (
            <span title="Admin">
              <Crown className="w-3.5 h-3.5 text-warning shrink-0" />
            </span>
          )}
          {isModerator && !isAdmin && (
            <span title="Moderator">
              <Shield className="w-3.5 h-3.5 text-info shrink-0" />
            </span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{member.role}</p>
      </div>
    </div>
  );
}
