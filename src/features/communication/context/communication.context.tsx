'use client';

import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import type {
  MemberId,
  Organization,
  Group,
  GroupId,
  DirectMessage,
  CommunicationMember,
  Message,
  MessageId,
  MessageType,
  NotificationPreference,
  EventResponse,
  CreateGroupConfig,
  PollData,
  EventData,
  MessageAttachment,
} from '../types/communication.types';
import {
  MOCK_COMMUNICATION_MEMBERS,
  MOCK_COMMUNICATION_ORGANIZATION,
  MOCK_COMMUNICATION_GROUPS,
  MOCK_COMMUNICATION_DMS,
  MOCK_COMMUNICATION_MESSAGES,
} from '@/mocks/communication';
import { generateUsername } from '../utils/username.utils';

// ─── State ────────────────────────────────────────────────────────────────────

export interface CommunicationState {
  // Identity
  currentUserId: MemberId;
  currentUsername: string;

  // Data
  organization: Organization;
  groups: Group[];
  directMessages: DirectMessage[];
  members: Record<MemberId, CommunicationMember>;
  messages: Record<string, Message[]>;

  // Navigation
  activeConversationId: string | null;
  activeConversationType: 'group' | 'dm' | null;
  isDetailsPanelOpen: boolean;

  // Mobile navigation
  mobileView: 'list' | 'conversation';

  // Composer state
  replyToMessageId: string | null;
  isSearchOpen: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export interface CommunicationActions {
  // Navigation
  selectConversation(id: string, type: 'group' | 'dm'): void;
  openDetailsPanel(): void;
  closeDetailsPanel(): void;
  setMobileView(view: 'list' | 'conversation'): void;

  // Messages
  sendMessage(
    conversationId: string,
    content: string,
    replyTo?: MessageId,
    extra?: {
      messageType?: MessageType;
      pollData?: PollData;
      eventData?: EventData;
      attachments?: MessageAttachment[];
      mentions?: MemberId[];
    }
  ): void;
  addReaction(messageId: MessageId, emoji: string): void;
  removeReaction(messageId: MessageId, emoji: string): void;
  markConversationAsRead(conversationId: string): void;

  // Groups
  createGroup(config: CreateGroupConfig): void;
  toggleFavorite(groupId: GroupId): void;
  updateNotificationPreference(groupId: GroupId, pref: NotificationPreference, mutedUntil?: string): void;

  // Username
  updateUsername(newUsername: string): void;

  // Composer
  setReplyTo(messageId: string | null): void;
  toggleSearch(): void;

  // Rich content
  castVote(conversationId: string, messageId: MessageId, optionId: string): void;
  respondToEvent(conversationId: string, messageId: MessageId, response: EventResponse): void;
}

export type CommunicationContextValue = CommunicationState & CommunicationActions;

export const CommunicationContext = createContext<CommunicationContextValue | null>(null);

// ─── Reducer Types ────────────────────────────────────────────────────────────

export type CommunicationAction =
  | { type: 'SELECT_CONVERSATION'; payload: { id: string; conversationType: 'group' | 'dm' } }
  | { type: 'OPEN_DETAILS_PANEL' }
  | { type: 'CLOSE_DETAILS_PANEL' }
  | { type: 'SET_MOBILE_VIEW'; payload: 'list' | 'conversation' }
  | {
      type: 'SEND_MESSAGE';
      payload: {
        conversationId: string;
        content: string;
        replyTo?: MessageId;
        messageType?: MessageType;
        pollData?: PollData;
        eventData?: EventData;
        attachments?: MessageAttachment[];
        mentions?: MemberId[];
      };
    }
  | { type: 'ADD_REACTION'; payload: { messageId: MessageId; emoji: string } }
  | { type: 'REMOVE_REACTION'; payload: { messageId: MessageId; emoji: string } }
  | { type: 'MARK_AS_READ'; payload: { conversationId: string } }
  | { type: 'CREATE_GROUP'; payload: { config: CreateGroupConfig } }
  | { type: 'TOGGLE_FAVORITE'; payload: { groupId: GroupId } }
  | {
      type: 'UPDATE_NOTIFICATION_PREFERENCE';
      payload: { groupId: GroupId; pref: NotificationPreference; mutedUntil?: string };
    }
  | { type: 'UPDATE_USERNAME'; payload: { newUsername: string } }
  | { type: 'SET_REPLY_TO'; payload: string | null }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'CAST_VOTE'; payload: { conversationId: string; messageId: MessageId; optionId: string } }
  | { type: 'RESPOND_TO_EVENT'; payload: { conversationId: string; messageId: MessageId; response: EventResponse } };

// ─── Initial State ────────────────────────────────────────────────────────────

const initialMembersRecord: Record<MemberId, CommunicationMember> = {};
for (const m of MOCK_COMMUNICATION_MEMBERS) {
  initialMembersRecord[m.id] = m;
}

const CURRENT_USER_ID = 'member-12';
const currentUser = initialMembersRecord[CURRENT_USER_ID];

export const initialCommunicationState: CommunicationState = {
  currentUserId: CURRENT_USER_ID,
  currentUsername: currentUser?.username || 'john.doe',
  organization: MOCK_COMMUNICATION_ORGANIZATION,
  groups: MOCK_COMMUNICATION_GROUPS,
  directMessages: MOCK_COMMUNICATION_DMS,
  members: initialMembersRecord,
  messages: MOCK_COMMUNICATION_MESSAGES,
  activeConversationId: MOCK_COMMUNICATION_GROUPS[0]?.id || null,
  activeConversationType: 'group',
  isDetailsPanelOpen: false,
  mobileView: 'list',
  replyToMessageId: null,
  isSearchOpen: false,
};

// ─── Reducer Function ─────────────────────────────────────────────────────────

export function communicationReducer(
  state: CommunicationState,
  action: CommunicationAction
): CommunicationState {
  switch (action.type) {
    case 'SELECT_CONVERSATION': {
      const { id, conversationType } = action.payload;
      return {
        ...state,
        activeConversationId: id,
        activeConversationType: conversationType,
        mobileView: 'conversation',
        replyToMessageId: null,
        groups: state.groups.map(g => (g.id === id ? { ...g, unreadCount: 0 } : g)),
        directMessages: state.directMessages.map(d => (d.id === id ? { ...d, unreadCount: 0 } : d)),
      };
    }

    case 'OPEN_DETAILS_PANEL':
      return { ...state, isDetailsPanelOpen: true };

    case 'CLOSE_DETAILS_PANEL':
      return { ...state, isDetailsPanelOpen: false };

    case 'SET_MOBILE_VIEW':
      return { ...state, mobileView: action.payload };

    case 'SEND_MESSAGE': {
      const {
        conversationId,
        content,
        replyTo,
        messageType = 'TEXT',
        pollData,
        eventData,
        attachments = [],
        mentions = [],
      } = action.payload;

      const now = new Date().toISOString();
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conversationId,
        senderId: state.currentUserId,
        content,
        messageType,
        replyTo,
        reactions: [],
        attachments,
        mentions,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
        pollData,
        eventData,
      };

      const existingMessages = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...existingMessages, newMessage],
      };

      const previewText =
        messageType === 'POLL'
          ? `📊 ${pollData?.question || 'Poll'}`
          : messageType === 'EVENT'
            ? `📅 ${eventData?.title || 'Event'}`
            : content;

      return {
        ...state,
        messages: updatedMessages,
        replyToMessageId: state.replyToMessageId === replyTo ? null : state.replyToMessageId,
        groups: state.groups.map(g =>
          g.id === conversationId
            ? { ...g, lastMessagePreview: previewText, lastMessageAt: now }
            : g
        ),
        directMessages: state.directMessages.map(d =>
          d.id === conversationId
            ? { ...d, lastMessagePreview: previewText, lastMessageAt: now }
            : d
        ),
      };
    }

    case 'ADD_REACTION': {
      const { messageId, emoji } = action.payload;
      const updatedMessages: Record<string, Message[]> = {};

      for (const [convId, msgList] of Object.entries(state.messages)) {
        updatedMessages[convId] = msgList.map(msg => {
          if (msg.id !== messageId) return msg;

          const existingIndex = msg.reactions.findIndex(r => r.emoji === emoji);
          const newReactions = [...msg.reactions];

          if (existingIndex >= 0) {
            const r = newReactions[existingIndex];
            if (!r.memberIds.includes(state.currentUserId)) {
              newReactions[existingIndex] = {
                ...r,
                count: r.count + 1,
                memberIds: [...r.memberIds, state.currentUserId],
              };
            }
          } else {
            newReactions.push({
              emoji,
              count: 1,
              memberIds: [state.currentUserId],
            });
          }

          return { ...msg, reactions: newReactions };
        });
      }

      return { ...state, messages: updatedMessages };
    }

    case 'REMOVE_REACTION': {
      const { messageId, emoji } = action.payload;
      const updatedMessages: Record<string, Message[]> = {};

      for (const [convId, msgList] of Object.entries(state.messages)) {
        updatedMessages[convId] = msgList.map(msg => {
          if (msg.id !== messageId) return msg;

          const newReactions = msg.reactions
            .map(r => {
              if (r.emoji !== emoji) return r;
              const memberIds = r.memberIds.filter(id => id !== state.currentUserId);
              return { ...r, count: memberIds.length, memberIds };
            })
            .filter(r => r.count > 0);

          return { ...msg, reactions: newReactions };
        });
      }

      return { ...state, messages: updatedMessages };
    }

    case 'MARK_AS_READ': {
      const cid = action.payload.conversationId;
      const targetGroup = state.groups.find(g => g.id === cid);
      const targetDm = state.directMessages.find(d => d.id === cid);
      const groupNeedsUpdate = targetGroup && targetGroup.unreadCount > 0;
      const dmNeedsUpdate = targetDm && targetDm.unreadCount > 0;

      if (!groupNeedsUpdate && !dmNeedsUpdate) {
        return state;
      }

      return {
        ...state,
        groups: state.groups.map(g => (g.id === cid ? { ...g, unreadCount: 0 } : g)),
        directMessages: state.directMessages.map(d => (d.id === cid ? { ...d, unreadCount: 0 } : d)),
      };
    }

    case 'CREATE_GROUP': {
      const { config } = action.payload;
      const newGroupId = `group-${Date.now()}`;
      const now = new Date().toISOString();
      const memberIds = Array.from(new Set([state.currentUserId, ...config.memberIds]));

      const newGroup: Group = {
        id: newGroupId,
        orgId: state.organization.id,
        name: config.name,
        description: config.description,
        type: config.type,
        isLocked: config.type === 'TEAM',
        linkedTeamId: config.linkedTeamId,
        linkedRole: config.linkedRole,
        linkedMembershipType: config.linkedMembershipType,
        memberIds,
        adminIds: [state.currentUserId],
        moderatorIds: [],
        permissions: config.permissions,
        pinnedMessageIds: [],
        unreadCount: 0,
        notificationPreference: 'ALL',
        isFavorite: false,
        createdAt: now,
      };

      return {
        ...state,
        groups: [...state.groups, newGroup],
        organization: {
          ...state.organization,
          groupIds: [...state.organization.groupIds, newGroupId],
        },
        messages: {
          ...state.messages,
          [newGroupId]: [],
        },
        activeConversationId: newGroupId,
        activeConversationType: 'group',
        mobileView: 'conversation',
      };
    }

    case 'TOGGLE_FAVORITE': {
      const { groupId } = action.payload;
      return {
        ...state,
        groups: state.groups.map(g => (g.id === groupId ? { ...g, isFavorite: !g.isFavorite } : g)),
      };
    }

    case 'UPDATE_NOTIFICATION_PREFERENCE': {
      const { groupId, pref, mutedUntil } = action.payload;
      return {
        ...state,
        groups: state.groups.map(g =>
          g.id === groupId ? { ...g, notificationPreference: pref, mutedUntil } : g
        ),
        directMessages: state.directMessages.map(d =>
          d.id === groupId ? { ...d, notificationPreference: pref, mutedUntil } : d
        ),
      };
    }

    case 'UPDATE_USERNAME': {
      const { newUsername } = action.payload;
      const currentMember = state.members[state.currentUserId];
      return {
        ...state,
        currentUsername: newUsername,
        members: currentMember
          ? {
              ...state.members,
              [state.currentUserId]: { ...currentMember, username: newUsername },
            }
          : state.members,
      };
    }

    case 'SET_REPLY_TO':
      return { ...state, replyToMessageId: action.payload };

    case 'TOGGLE_SEARCH':
      return { ...state, isSearchOpen: !state.isSearchOpen };

    case 'CAST_VOTE': {
      const { conversationId, messageId, optionId } = action.payload;
      const msgList = state.messages[conversationId];
      if (!msgList) return state;

      const updatedList = msgList.map(msg => {
        if (msg.id !== messageId || !msg.pollData) return msg;

        const poll = msg.pollData;
        const allowMultiple = poll.allowMultiple;

        const newOptions = poll.options.map(opt => {
          if (allowMultiple) {
            if (opt.id === optionId) {
              const hasVoted = opt.voterIds.includes(state.currentUserId);
              const voterIds = hasVoted
                ? opt.voterIds.filter(id => id !== state.currentUserId)
                : [...opt.voterIds, state.currentUserId];
              return { ...opt, voterIds };
            }
            return opt;
          } else {
            // Single vote: strip current user from all options, add to target option
            const cleanedVoters = opt.voterIds.filter(id => id !== state.currentUserId);
            if (opt.id === optionId) {
              return { ...opt, voterIds: [...cleanedVoters, state.currentUserId] };
            }
            return { ...opt, voterIds: cleanedVoters };
          }
        });

        return {
          ...msg,
          pollData: { ...poll, options: newOptions },
        };
      });

      return {
        ...state,
        messages: { ...state.messages, [conversationId]: updatedList },
      };
    }

    case 'RESPOND_TO_EVENT': {
      const { conversationId, messageId, response } = action.payload;
      const msgList = state.messages[conversationId];
      if (!msgList) return state;

      const updatedList = msgList.map(msg => {
        if (msg.id !== messageId || !msg.eventData) return msg;
        return {
          ...msg,
          eventData: {
            ...msg.eventData,
            responses: {
              ...msg.eventData.responses,
              [state.currentUserId]: response,
            },
          },
        };
      });

      return {
        ...state,
        messages: { ...state.messages, [conversationId]: updatedList },
      };
    }

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCommunication(): CommunicationContextValue {
  const ctx = useContext(CommunicationContext);
  if (!ctx) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return ctx;
}

// ─── Provider Implementation ──────────────────────────────────────────────────

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(communicationReducer, initialCommunicationState);

  // Auto-assign username on first access if empty (Requirement 2.1)
  useEffect(() => {
    if (!state.currentUsername) {
      const usedUsernames = new Set(Object.values(state.members).map(m => m.username));
      const autoUsername = generateUsername('John Doe', usedUsernames);
      dispatch({ type: 'UPDATE_USERNAME', payload: { newUsername: autoUsername } });
    }
  }, [state.currentUsername, state.members]);

  const actions = useMemo<CommunicationActions>(
    () => ({
      selectConversation(id, type) {
        dispatch({ type: 'SELECT_CONVERSATION', payload: { id, conversationType: type } });
      },
      openDetailsPanel() {
        dispatch({ type: 'OPEN_DETAILS_PANEL' });
      },
      closeDetailsPanel() {
        dispatch({ type: 'CLOSE_DETAILS_PANEL' });
      },
      setMobileView(view) {
        dispatch({ type: 'SET_MOBILE_VIEW', payload: view });
      },
      sendMessage(conversationId, content, replyTo, extra) {
        dispatch({
          type: 'SEND_MESSAGE',
          payload: {
            conversationId,
            content,
            replyTo,
            ...extra,
          },
        });
      },
      addReaction(messageId, emoji) {
        dispatch({ type: 'ADD_REACTION', payload: { messageId, emoji } });
      },
      removeReaction(messageId, emoji) {
        dispatch({ type: 'REMOVE_REACTION', payload: { messageId, emoji } });
      },
      markConversationAsRead(conversationId) {
        dispatch({ type: 'MARK_AS_READ', payload: { conversationId } });
      },
      createGroup(config) {
        dispatch({ type: 'CREATE_GROUP', payload: { config } });
      },
      toggleFavorite(groupId) {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: { groupId } });
      },
      updateNotificationPreference(groupId, pref, mutedUntil) {
        dispatch({
          type: 'UPDATE_NOTIFICATION_PREFERENCE',
          payload: { groupId, pref, mutedUntil },
        });
      },
      updateUsername(newUsername) {
        dispatch({ type: 'UPDATE_USERNAME', payload: { newUsername } });
      },
      setReplyTo(messageId) {
        dispatch({ type: 'SET_REPLY_TO', payload: messageId });
      },
      toggleSearch() {
        dispatch({ type: 'TOGGLE_SEARCH' });
      },
      castVote(conversationId, messageId, optionId) {
        dispatch({ type: 'CAST_VOTE', payload: { conversationId, messageId, optionId } });
      },
      respondToEvent(conversationId, messageId, response) {
        dispatch({ type: 'RESPOND_TO_EVENT', payload: { conversationId, messageId, response } });
      },
    }),
    [dispatch]
  );

  const value = useMemo<CommunicationContextValue>(() => {
    return {
      ...state,
      ...actions,
    };
  }, [state, actions]);

  return <CommunicationContext.Provider value={value}>{children}</CommunicationContext.Provider>;
}
