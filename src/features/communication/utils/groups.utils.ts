import type { Group } from '../types/communication.types';

export interface CategorisedGroups {
  teams: Group[];
  club: Group[];
  communities: Group[];
  custom: Group[];
}

/**
 * Categorises an array of Groups into four canonical sections:
 * - teams: GroupType === 'TEAM'
 * - club: GroupType === 'GENERAL' | 'ANNOUNCEMENTS'
 * - communities: GroupType === 'ROLE' | 'MEMBERSHIP_TYPE'
 * - custom: GroupType === 'CUSTOM'
 */
export function categoriseGroups(groups: Group[]): CategorisedGroups {
  const result: CategorisedGroups = {
    teams: [],
    club: [],
    communities: [],
    custom: [],
  };

  for (const group of groups) {
    switch (group.type) {
      case 'TEAM':
        result.teams.push(group);
        break;
      case 'GENERAL':
      case 'ANNOUNCEMENTS':
        result.club.push(group);
        break;
      case 'ROLE':
      case 'MEMBERSHIP_TYPE':
        result.communities.push(group);
        break;
      case 'CUSTOM':
        result.custom.push(group);
        break;
    }
  }

  return result;
}
