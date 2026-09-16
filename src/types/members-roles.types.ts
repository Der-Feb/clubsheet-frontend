export type Department = "Technical" | "Management" | "Medical" | "Operations";

export type MemberStatus = "Active" | "Invited" | "Suspended";

export type MembershipType =
  | "Executive"
  | "Technical Staff"
  | "Medical Staff"
  | "Operations"
  | "Athlete"
  | "Coach";

export type PermissionCategory =
  | "Members & HR"
  | "Technical & Squad"
  | "Medical & Health"
  | "Finance & Transfers"
  | "Operations & Settings";

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  department: Department | "General";
  isSystem?: boolean;
  memberCount: number;
  permissions: string[];
}

export interface Membership {
  id: string; // membershipId
  userId: string;
  clubId: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  role: string;
  department: Department;
  membershipType: MembershipType;
  status: MemberStatus;
  joinedDate: string;
  avatar?: string;
  /** Granular permission overrides granted directly to this membership */
  directPermissions?: string[];
  /** Granular permissions explicitly revoked from this membership */
  revokedPermissions?: string[];
}

/** Alias for Member to ensure backwards compatibility */
export type Member = Membership;

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
}
