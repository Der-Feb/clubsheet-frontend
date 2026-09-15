// ─── Identifiers ────────────────────────────────────────────────────────────
export type OrganizationId = string;
export type GroupId = string;
export type DirectMessageId = string;
export type MessageId = string;
export type MemberId = string;

// ─── Enumerations ───────────────────────────────────────────────────────────
export type GroupType =
  | 'GENERAL'
  | 'ANNOUNCEMENTS'
  | 'TEAM'
  | 'ROLE'
  | 'MEMBERSHIP_TYPE'
  | 'CUSTOM';

export type MessageType =
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'FILE'
  | 'AUDIO'
  | 'SYSTEM'
  | 'EVENT'
  | 'POLL';

export type PermissionLevel = 'EVERYONE' | 'ADMINS_AND_MODERATORS' | 'ADMINS_ONLY';

export type NotificationPreference = 'ALL' | 'MENTIONS_ONLY' | 'MUTED';

export type EventResponse = 'GOING' | 'MAYBE' | 'CANT_GO';

// ─── Organization ────────────────────────────────────────────────────────────
export interface Organization {
  id: OrganizationId;
  clubId: string;
  name: string;
  groupIds: GroupId[];
  directMessageIds: DirectMessageId[];
}

// ─── Member ──────────────────────────────────────────────────────────────────
export interface CommunicationMember {
  id: MemberId;
  displayName: string;
  username: string;        // stored without @; e.g. "john.doe"
  initials: string;
  avatar?: string;
  role: string;            // e.g. "Head Coach", "Athlete", "Administrator"
  membershipType?: string; // e.g. "Player", "Parent", "Staff"
  teamId?: string;
  isOnline: boolean;
  lastSeen?: string;       // ISO string
}

// ─── Group ───────────────────────────────────────────────────────────────────
export interface GroupPermissions {
  canSendMessages: PermissionLevel;
  canAddMembers: PermissionLevel;
  canEditGroupInfo: PermissionLevel;
  canUseBroadcastMentions: PermissionLevel; // @everyone, @coaches, etc.
}

export interface Group {
  id: GroupId;
  orgId: OrganizationId;
  name: string;
  description?: string;
  type: GroupType;
  isLocked: boolean;       // true for TEAM type
  linkedTeamId?: string;   // only for TEAM type
  linkedRole?: string;     // only for ROLE type
  linkedMembershipType?: string; // only for MEMBERSHIP_TYPE type
  memberIds: MemberId[];
  adminIds: MemberId[];
  moderatorIds: MemberId[];
  permissions: GroupPermissions;
  pinnedMessageIds: MessageId[];
  unreadCount: number;
  lastMessagePreview?: string;
  lastMessageAt?: string;  // ISO string
  notificationPreference: NotificationPreference;
  mutedUntil?: string;     // ISO string; undefined = not muted
  isFavorite: boolean;
  createdAt: string;
}

// ─── Direct Message ───────────────────────────────────────────────────────────
export interface DirectMessage {
  id: DirectMessageId;
  orgId: OrganizationId;
  participantIds: MemberId[];
  unreadCount: number;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  notificationPreference: NotificationPreference;
  createdAt: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────
export interface MessageAttachment {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;  // bytes
  mimeType: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  memberIds: MemberId[]; // who reacted
}

export interface Message {
  id: MessageId;
  conversationId: GroupId | DirectMessageId;
  senderId: MemberId;
  content: string;
  messageType: MessageType;
  replyTo?: MessageId;
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  mentions: MemberId[];
  isDeleted: boolean;
  createdAt: string;    // ISO string
  updatedAt: string;
  // Rich content (only one should be set per message)
  pollData?: PollData;
  eventData?: EventData;
}

// ─── Poll ─────────────────────────────────────────────────────────────────────
export interface PollOption {
  id: string;
  label: string;
  voterIds: MemberId[];
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  closedAt?: string;   // ISO string; undefined = open
}

// ─── Event ────────────────────────────────────────────────────────────────────
export interface EventData {
  title: string;
  date: string;        // ISO string
  location?: string;
  description?: string;
  linkedEventId?: string; // future integration with ClubSheet scheduling
  responses: Record<MemberId, EventResponse>;
}

// ─── Group Config ─────────────────────────────────────────────────────────────
export interface CreateGroupConfig {
  name: string;
  description?: string;
  type: GroupType;
  memberIds: MemberId[];
  linkedTeamId?: string;
  linkedRole?: string;
  linkedMembershipType?: string;
  permissions: GroupPermissions;
}
