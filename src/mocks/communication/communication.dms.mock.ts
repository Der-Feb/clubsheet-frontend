import type { DirectMessage } from '@/features/communication/types/communication.types';

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_COMMUNICATION_DMS: DirectMessage[] = [
  {
    id: 'dm-1',
    orgId: 'org-1',
    participantIds: ['member-12', 'member-1'],
    unreadCount: 0,
    lastMessagePreview: 'Can you approve the GPS vests purchase?',
    lastMessageAt: hoursAgo(3),
    notificationPreference: 'ALL',
    createdAt: daysAgo(30),
  },
  {
    id: 'dm-2',
    orgId: 'org-1',
    participantIds: ['member-12', 'member-8'],
    unreadCount: 1,
    lastMessagePreview: "Eric's ankle MRI is completely clear",
    lastMessageAt: hoursAgo(1),
    notificationPreference: 'ALL',
    createdAt: daysAgo(14),
  },
  {
    id: 'dm-3',
    orgId: 'org-1',
    participantIds: ['member-12', 'member-3', 'member-9'],
    unreadCount: 0,
    lastMessagePreview: 'See you at training',
    lastMessageAt: daysAgo(1),
    notificationPreference: 'ALL',
    createdAt: daysAgo(7),
  },
  {
    id: 'dm-4',
    orgId: 'org-1',
    participantIds: ['member-12', 'member-4'],
    unreadCount: 0,
    lastMessageAt: daysAgo(2),
    notificationPreference: 'ALL',
    createdAt: daysAgo(20),
  },
];
