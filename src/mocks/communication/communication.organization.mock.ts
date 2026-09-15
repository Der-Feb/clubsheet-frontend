import type { Organization } from '@/features/communication/types/communication.types';

export const MOCK_COMMUNICATION_ORGANIZATION: Organization = {
  id: 'org-1',
  clubId: 'club-1',
  name: 'Kigali FC',
  groupIds: [
    'grp-general',
    'grp-announcements',
    'grp-senior',
    'grp-u17',
    'grp-u15',
    'grp-coaches',
    'grp-parents',
    'grp-tournament',
    'grp-travel',
  ],
  directMessageIds: ['dm-1', 'dm-2', 'dm-3', 'dm-4'],
};
