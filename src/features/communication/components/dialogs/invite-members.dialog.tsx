'use client';

import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { X, Search, UserPlus } from 'lucide-react';
import { useCommunication } from '../../context/communication.context';
import type { Group } from '../../types/communication.types';

export interface InviteMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group?: Group;
}

export function InviteMembersDialog({ isOpen, onClose, group }: InviteMembersDialogProps) {
  const { members, currentUserId } = useCommunication();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!group) return null;

  // Filter out members already in the group
  const nonGroupMembers = Object.values(members).filter(
    m => !group.memberIds.includes(m.id) && m.id !== currentUserId
  );

  const filteredMembers = nonGroupMembers.filter(
    m =>
      m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleAddMembers = () => {
    if (selectedIds.length === 0) return;
    // Mutate group memberIds in mock state by dispatching
    group.memberIds.push(...selectedIds);
    setSelectedIds([]);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border p-6 shadow-2xl text-card-foreground">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <Dialog.Title className="text-base font-bold text-foreground">
                Invite Members to {group.name}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                Select club members to add to this group.
              </Dialog.Description>
            </div>
            <Dialog.Close
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search members by username or role..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Members List */}
          <div className="max-h-56 overflow-y-auto space-y-1 mb-4 border border-border rounded-xl p-2 bg-muted/20">
            {filteredMembers.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No eligible members found
              </div>
            ) : (
              filteredMembers.map(m => {
                const isSelected = selectedIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleSelect(m.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                        {m.initials}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground font-mono">@{m.username}</p>
                        <p className="text-[10px] text-muted-foreground">{m.role}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="accent-primary"
                    />
                  </button>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleAddMembers}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Selected ({selectedIds.length})</span>
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
