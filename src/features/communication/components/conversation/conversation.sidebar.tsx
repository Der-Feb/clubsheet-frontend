'use client';

import { useMemo } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { useCommunication } from '../../context/communication.context';
import { categoriseGroups } from '../../utils/groups.utils';
import { SidebarHeader } from './sidebar.header';
import { FavoritesSection } from './favorites.section';
import { GroupCategorySection } from './group.category-section';
import { DmSection } from './dm.section';
import { ScrollArea } from '@/components/ScrollArea';

export interface ConversationSidebarProps {
  onOpenCreateGroup: () => void;
}

export function ConversationSidebar({ onOpenCreateGroup }: ConversationSidebarProps) {
  const {
    groups,
    directMessages,
    members,
    currentUserId,
    activeConversationId,
    selectConversation,
    toggleSearch,
  } = useCommunication();

  const categorised = useMemo(() => categoriseGroups(groups), [groups]);

  const hasAnyConversations = groups.length > 0 || directMessages.length > 0;

  return (
    <aside className="w-full h-full flex flex-col bg-card border-r border-border overflow-hidden">
      {/* Header */}
      <SidebarHeader onOpenSearch={toggleSearch} onOpenCreateGroup={onOpenCreateGroup} />

      {/* Navigation List */}
      <nav role="navigation" aria-label="Conversations" className="flex-1 min-h-0">
        <ScrollArea className="h-full px-2 py-3 space-y-1">
        {!hasAnyConversations ? (
          <div className="flex flex-col items-center justify-center h-48 px-4 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Start by creating a group or messaging a club member.
            </p>
            <button
              type="button"
              onClick={onOpenCreateGroup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create a Group</span>
            </button>
          </div>
        ) : (
          <>
            {/* Favorites Section */}
            <FavoritesSection
              groups={groups}
              activeConversationId={activeConversationId}
              onSelectGroup={id => selectConversation(id, 'group')}
            />

            {/* Teams Category */}
            <GroupCategorySection
              title="Teams"
              groups={categorised.teams}
              activeConversationId={activeConversationId}
              onSelectGroup={id => selectConversation(id, 'group')}
              defaultExpanded={true}
            />

            {/* Club Category */}
            <GroupCategorySection
              title="Club"
              groups={categorised.club}
              activeConversationId={activeConversationId}
              onSelectGroup={id => selectConversation(id, 'group')}
              defaultExpanded={true}
            />

            {/* Communities Category */}
            <GroupCategorySection
              title="Communities"
              groups={categorised.communities}
              activeConversationId={activeConversationId}
              onSelectGroup={id => selectConversation(id, 'group')}
              defaultExpanded={true}
            />

            {/* Custom Category */}
            <GroupCategorySection
              title="Custom Groups"
              groups={categorised.custom}
              activeConversationId={activeConversationId}
              onSelectGroup={id => selectConversation(id, 'group')}
              defaultExpanded={true}
            />

            {/* Direct Messages Section */}
            <DmSection
              directMessages={directMessages}
              members={members}
              currentUserId={currentUserId}
              activeConversationId={activeConversationId}
              onSelectDm={id => selectConversation(id, 'dm')}
              defaultExpanded={true}
            />
          </>
        )}
        </ScrollArea>
      </nav>
    </aside>
  );
}
