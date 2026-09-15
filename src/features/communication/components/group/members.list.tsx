'use client';

import { UserPlus } from 'lucide-react';
import type { Group, CommunicationMember } from '../../types/communication.types';
import { MemberListItem } from './member.list-item';

export interface MembersListProps {
  group: Group;
  members: CommunicationMember[];
  currentUserId: string;
  onOpenInvite?: () => void;
}

export function MembersList({ group, members, currentUserId, onOpenInvite }: MembersListProps) {
  if (members.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-muted-foreground">
        No members in this group yet
      </div>
    );
  }

  const isAdmin = group.adminIds.includes(currentUserId);
  const canInvite = !group.isLocked || isAdmin;

  const adminMembers = members.filter(m => group.adminIds.includes(m.id));
  const moderatorMembers = members.filter(
    m => group.moderatorIds.includes(m.id) && !group.adminIds.includes(m.id)
  );
  const regularMembers = members.filter(
    m => !group.adminIds.includes(m.id) && !group.moderatorIds.includes(m.id)
  );

  return (
    <div className="p-3 space-y-4">
      {/* Invite Member Header Button */}
      {canInvite && onOpenInvite && (
        <button
          type="button"
          onClick={onOpenInvite}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-primary/50 text-primary hover:bg-primary/5 text-xs font-semibold transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Members</span>
        </button>
      )}

      {/* Admins */}
      {adminMembers.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1">
            Administrators ({adminMembers.length})
          </h4>
          <div className="space-y-0.5">
            {adminMembers.map(m => (
              <MemberListItem key={m.id} member={m} isAdmin={true} />
            ))}
          </div>
        </div>
      )}

      {/* Moderators */}
      {moderatorMembers.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1">
            Moderators ({moderatorMembers.length})
          </h4>
          <div className="space-y-0.5">
            {moderatorMembers.map(m => (
              <MemberListItem key={m.id} member={m} isModerator={true} />
            ))}
          </div>
        </div>
      )}

      {/* Members */}
      {regularMembers.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1">
            Members ({regularMembers.length})
          </h4>
          <div className="space-y-0.5">
            {regularMembers.map(m => (
              <MemberListItem key={m.id} member={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
