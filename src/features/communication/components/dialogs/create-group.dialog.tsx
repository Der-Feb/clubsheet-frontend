'use client';

import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { X, Users, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCommunication } from '../../context/communication.context';
import type { GroupType, GroupPermissions, CreateGroupConfig } from '../../types/communication.types';

export interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PERMISSIONS: GroupPermissions = {
  canSendMessages: 'EVERYONE',
  canAddMembers: 'EVERYONE',
  canEditGroupInfo: 'ADMINS_AND_MODERATORS',
  canUseBroadcastMentions: 'ADMINS_AND_MODERATORS',
};

export function CreateGroupDialog({ isOpen, onClose }: CreateGroupDialogProps) {
  const { createGroup, members, currentUserId } = useCommunication();

  const [step, setStep] = useState<1 | 2>(1);
  const [groupType, setGroupType] = useState<GroupType>('CUSTOM');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [canSendMessages, setCanSendMessages] = useState<GroupPermissions['canSendMessages']>('EVERYONE');

  const availableMembers = Object.values(members).filter(m => m.id !== currentUserId);

  const toggleMemberSelection = (id: string) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    const config: CreateGroupConfig = {
      name: name.trim(),
      description: description.trim() || undefined,
      type: groupType,
      memberIds: selectedMemberIds,
      permissions: {
        ...DEFAULT_PERMISSIONS,
        canSendMessages,
      },
    };

    createGroup(config);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setStep(1);
    setGroupType('CUSTOM');
    setName('');
    setDescription('');
    setSelectedMemberIds([]);
    setCanSendMessages('EVERYONE');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && handleResetAndClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border p-6 shadow-2xl text-card-foreground">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <Dialog.Title className="text-base font-bold text-foreground">
                {step === 1 ? 'Create a Group — Step 1' : 'Group Details — Step 2'}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                {step === 1 ? 'Select the group type & purpose' : 'Set group name and members'}
              </Dialog.Description>
            </div>
            <Dialog.Close
              onClick={handleResetAndClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Step 1: Group Type Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Group Type</label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGroupType('CUSTOM')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      groupType === 'CUSTOM'
                        ? 'border-primary bg-primary/10 text-foreground font-semibold'
                        : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <Users className="w-4 h-4 mb-1 text-primary" />
                    <p className="text-xs font-bold text-foreground">Custom Group</p>
                    <p className="text-[10px] text-muted-foreground">General chat or project squad</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGroupType('ANNOUNCEMENTS')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      groupType === 'ANNOUNCEMENTS'
                        ? 'border-primary bg-primary/10 text-foreground font-semibold'
                        : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <Shield className="w-4 h-4 mb-1 text-primary" />
                    <p className="text-xs font-bold text-foreground">Announcements</p>
                    <p className="text-[10px] text-muted-foreground">Admin broadcast channel</p>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors mt-4 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Name & Member Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. U17 Travel Squad"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What is this group about?"
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Who can send messages?
                </label>
                <select
                  value={canSendMessages}
                  onChange={e => setCanSendMessages(e.target.value as GroupPermissions['canSendMessages'])}
                  className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="EVERYONE">Everyone</option>
                  <option value="ADMINS_AND_MODERATORS">Admins and Moderators only</option>
                  <option value="ADMINS_ONLY">Admins only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Select Initial Members ({selectedMemberIds.length})
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-border rounded-xl p-2 bg-muted/20">
                  {availableMembers.map(m => {
                    const isSelected = selectedMemberIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMemberSelection(m.id)}
                        className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isSelected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">
                            {m.initials}
                          </div>
                          <span className="font-mono">@{m.username}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="accent-primary"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 py-2 px-3 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={handleCreate}
                  className="py-2 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
