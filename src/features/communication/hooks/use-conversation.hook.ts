import { useMemo } from 'react';
import { useCommunication } from '../context/communication.context';
import type { Group, DirectMessage, Message, CommunicationMember } from '../types/communication.types';

export interface ActiveConversationResult {
  conversation: Group | DirectMessage | null;
  type: 'group' | 'dm' | null;
}

/**
 * Returns the currently active Group or DirectMessage object, or null if none is selected.
 */
export function useActiveConversation(): ActiveConversationResult {
  const { activeConversationId, activeConversationType, groups, directMessages } = useCommunication();

  return useMemo(() => {
    if (!activeConversationId || !activeConversationType) {
      return { conversation: null, type: null };
    }

    if (activeConversationType === 'group') {
      const group = groups.find(g => g.id === activeConversationId) || null;
      return { conversation: group, type: group ? 'group' : null };
    }

    if (activeConversationType === 'dm') {
      const dm = directMessages.find(d => d.id === activeConversationId) || null;
      return { conversation: dm, type: dm ? 'dm' : null };
    }

    return { conversation: null, type: null };
  }, [activeConversationId, activeConversationType, groups, directMessages]);
}

/**
 * Returns the messages array for the currently active conversation, or an empty array.
 */
export function useActiveMessages(): Message[] {
  const { activeConversationId, messages } = useCommunication();
  return useMemo(() => {
    if (!activeConversationId) return [];
    return messages[activeConversationId] || [];
  }, [activeConversationId, messages]);
}

/**
 * Returns the list of CommunicationMember objects participating in a conversation.
 */
export function useConversationMembers(
  conversationId: string | null,
  type: 'group' | 'dm' | null
): CommunicationMember[] {
  const { groups, directMessages, members } = useCommunication();

  return useMemo(() => {
    if (!conversationId || !type) return [];

    let memberIds: string[] = [];

    if (type === 'group') {
      const group = groups.find(g => g.id === conversationId);
      if (group) memberIds = group.memberIds;
    } else if (type === 'dm') {
      const dm = directMessages.find(d => d.id === conversationId);
      if (dm) memberIds = dm.participantIds;
    }

    return memberIds.map(id => members[id]).filter((m): m is CommunicationMember => Boolean(m));
  }, [conversationId, type, groups, directMessages, members]);
}
