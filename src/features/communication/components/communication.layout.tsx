'use client';

import { useState } from 'react';
import { CommunicationProvider, useCommunication } from '../context/communication.context';
import { useActiveConversation } from '../hooks/use-conversation.hook';
import type { Group } from '../types/communication.types';
import { ConversationSidebar } from './conversation/conversation.sidebar';
import { ActiveConversation } from './conversation/active.conversation';
import { GroupDetailsPanel } from './group/group.details-panel';
import { UsernameSetupBanner } from './username/username.setup-banner';
import { CreateGroupDialog } from './dialogs/create-group.dialog';
import { InviteMembersDialog } from './dialogs/invite-members.dialog';

function InnerCommunicationLayout() {
  const { mobileView } = useCommunication();
  const { conversation, type } = useActiveConversation();

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Banner */}
      <UsernameSetupBanner />

      {/* Main 3-Column Panels Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Full width on mobile list view, w-72 on md+) */}
        <div
          className={`${
            mobileView === 'list' ? 'block w-full' : 'hidden'
          } md:block md:w-72 h-full shrink-0`}
        >
          <ConversationSidebar onOpenCreateGroup={() => setIsCreateGroupOpen(true)} />
        </div>

        {/* Active Conversation Panel (Full width on mobile conversation view, flex-1 on md+) */}
        <div
          className={`${
            mobileView === 'conversation' ? 'block w-full' : 'hidden'
          } md:block md:flex-1 h-full min-w-0`}
        >
          <ActiveConversation />
        </div>

        {/* Group Details Panel (Desktop right panel / drawer) */}
        <div className="hidden lg:block h-full shrink-0">
          <GroupDetailsPanel onOpenInvite={() => setIsInviteOpen(true)} />
        </div>
      </div>

      {/* Dialogs */}
      <CreateGroupDialog
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

      <InviteMembersDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        group={type === 'group' ? (conversation as Group) : undefined}
      />
    </div>
  );
}

export function CommunicationLayout() {
  return (
    <CommunicationProvider>
      <InnerCommunicationLayout />
    </CommunicationProvider>
  );
}
