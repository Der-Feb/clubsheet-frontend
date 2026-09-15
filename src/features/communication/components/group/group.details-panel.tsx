'use client';

import { useState } from 'react';
import { X, Users, Image as ImageIcon, FileText, Link as LinkIcon, Bell } from 'lucide-react';
import type { Group } from '../../types/communication.types';
import { useCommunication } from '../../context/communication.context';
import { useActiveConversation, useConversationMembers } from '../../hooks/use-conversation.hook';
import { GroupInfoSection } from './group.info-section';
import { MembersList } from './members.list';
import { MediaGallery } from './media.gallery';
import { FilesSection } from './files.section';
import { LinksSection } from './links.section';
import { NotificationSettings } from './notification.settings';

export interface GroupDetailsPanelProps {
  onOpenInvite?: () => void;
}

type TabType = 'members' | 'media' | 'files' | 'links' | 'settings';

export function GroupDetailsPanel({ onOpenInvite }: GroupDetailsPanelProps) {
  const {
    isDetailsPanelOpen,
    closeDetailsPanel,
    activeConversationId,
    activeConversationType,
    currentUserId,
    messages,
    updateNotificationPreference,
  } = useCommunication();

  const { conversation, type } = useActiveConversation();
  const members = useConversationMembers(activeConversationId, activeConversationType);
  const [activeTab, setActiveTab] = useState<TabType>('members');

  if (!isDetailsPanelOpen || !conversation) {
    return null;
  }

  const groupConv = type === 'group' ? (conversation as Group) : null;
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const pref = groupConv?.notificationPreference || 'ALL';

  return (
    <aside className="w-80 h-full flex flex-col bg-card border-l border-border overflow-hidden shrink-0 transition-all duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">
          {type === 'group' ? 'Group Details' : 'Contact Info'}
        </h3>
        <button
          type="button"
          onClick={closeDetailsPanel}
          aria-label="Close details panel"
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Info Banner if group */}
        {groupConv && <GroupInfoSection group={groupConv} />}

        {/* Tab Navigation */}
        <div className="flex items-center justify-around border-b border-border bg-muted/20 px-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            title="Members"
            className={`p-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'members'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            title="Media"
            className={`p-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'media'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            title="Files"
            className={`p-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'files'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            title="Links"
            className={`p-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'links'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            title="Notification Settings"
            className={`p-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'members' && (
          <MembersList
            group={conversation as Group}
            members={members}
            currentUserId={currentUserId}
            onOpenInvite={onOpenInvite}
          />
        )}
        {activeTab === 'media' && <MediaGallery messages={activeMessages} />}
        {activeTab === 'files' && <FilesSection messages={activeMessages} />}
        {activeTab === 'links' && <LinksSection messages={activeMessages} />}
        {activeTab === 'settings' && (
          <NotificationSettings
            preference={pref}
            onUpdatePreference={(p, m) =>
              updateNotificationPreference(activeConversationId!, p, m)
            }
          />
        )}
      </div>
    </aside>
  );
}
