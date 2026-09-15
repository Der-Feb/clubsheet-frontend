'use client';

import { Lock } from 'lucide-react';
import type { Group } from '../../types/communication.types';

export interface GroupInfoSectionProps {
  group: Group;
}

export function GroupInfoSection({ group }: GroupInfoSectionProps) {
  return (
    <div className="p-4 border-b border-border space-y-3">
      {/* Group Icon + Name */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/15 text-primary font-bold text-xl flex items-center justify-center mb-2">
          {group.name.slice(0, 2).toUpperCase()}
        </div>
        <h3 className="text-base font-bold text-foreground flex items-center justify-center gap-1.5">
          <span>{group.name}</span>
          {group.isLocked && (
            <span title="Locked Team Group">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </span>
          )}
        </h3>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
          {group.type.replace('_', ' ')}
        </span>
      </div>

      {/* Description */}
      {group.description && (
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {group.description}
        </p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-center text-xs">
        <div className="p-2 rounded-lg bg-muted/40">
          <p className="font-bold text-foreground">{group.memberIds.length}</p>
          <p className="text-[10px] text-muted-foreground">Members</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/40">
          <p className="font-bold text-foreground">{group.pinnedMessageIds.length}</p>
          <p className="text-[10px] text-muted-foreground">Pinned</p>
        </div>
      </div>
    </div>
  );
}
