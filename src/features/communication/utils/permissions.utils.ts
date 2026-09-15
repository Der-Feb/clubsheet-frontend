import type {
  CommunicationMember,
  Group,
  GroupPermissions,
} from '../types/communication.types';

export type PermissionAction = keyof GroupPermissions;

/**
 * Checks if a given member has permission to perform an action on a group.
 * Permission levels:
 * - 'EVERYONE': all group members (or all users)
 * - 'ADMINS_AND_MODERATORS': admins or moderators of the group
 * - 'ADMINS_ONLY': group admins only
 */
export function canPerformAction(
  member: CommunicationMember | undefined,
  group: Group | undefined,
  action: PermissionAction
): boolean {
  if (!member || !group) {
    return false;
  }

  // Ensure member belongs to the group or is club administrator
  const isGroupMember = group.memberIds.includes(member.id);
  const isGlobalAdmin =
    member.role.toLowerCase().includes('administrator') ||
    member.role.toLowerCase().includes('admin');

  if (!isGroupMember && !isGlobalAdmin) {
    return false;
  }

  const isGroupAdmin = group.adminIds.includes(member.id) || isGlobalAdmin;
  const isGroupModerator = group.moderatorIds.includes(member.id);

  const level = group.permissions[action];

  switch (level) {
    case 'EVERYONE':
      return true;
    case 'ADMINS_AND_MODERATORS':
      return isGroupAdmin || isGroupModerator;
    case 'ADMINS_ONLY':
      return isGroupAdmin;
    default:
      return false;
  }
}
