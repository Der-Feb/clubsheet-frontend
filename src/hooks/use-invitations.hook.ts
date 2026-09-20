import { useQuery } from "@tanstack/react-query";
import { MOCK_INVITATIONS } from "@/mocks/invitations.mock";
import type { Invitation } from "@/types/invitations.types";
import type { Member, MembershipType, Department } from "@/types/members-roles.types";
import {
  addMemberToStore,
  setMemberStatusInStore,
  getMemberFromStore,
} from "./use-members-roles.hook";

// In-memory store
let invitationsStore: Invitation[] = [...MOCK_INVITATIONS];

// ─── Pure functions (not hooks) ────────────────────────────────────────────

export interface CreateInvitationInput {
  membershipId?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  roleId?: string;
  membershipType?: MembershipType;
  department?: Department;
  clubId?: string;
  signingId?: string;
  hireId?: string;
  expiresInDays?: number;
}

/**
 * Creates the Membership (status: "Invited") AND the Invitation (status: "PENDING") together.
 * Returns both records.
 */
export function createInvitation(input: CreateInvitationInput): {
  invitation: Invitation;
  membership: Member;
} {
  const membershipId = input.membershipId || `mbr-${Date.now()}`;
  let existingMember = getMemberFromStore(membershipId);

  let membership: Member;
  if (existingMember) {
    membership = existingMember;
  } else {
    membership = {
      id: membershipId,
      userId: `usr-${Date.now()}`,
      clubId: input.clubId || "club-1",
      name: input.name || "Invited Member",
      email: input.email || `${(input.name || "member").toLowerCase().replace(/\s+/g, ".")}@club.com`,
      phone: input.phone || "+250 788 000 000",
      roleId: input.roleId || "role-default",
      role: input.role || (input.membershipType ? String(input.membershipType) : "Staff"),
      department: input.department || "Technical",
      membershipType: input.membershipType || "Technical Staff",
      status: "Invited",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    addMemberToStore(membership);
  }

  const days = input.expiresInDays || 14;
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

  const invitation: Invitation = {
    id: `inv-${Date.now()}`,
    membershipId: membership.id,
    signingId: input.signingId,
    hireId: input.hireId,
    status: "PENDING",
    expiresAt,
    createdAt: new Date().toISOString().split("T")[0],
  };

  invitationsStore.unshift(invitation);
  return { invitation, membership };
}

/**
 * Flips Invitation to ACCEPTED and Membership to ACTIVE.
 * This is the ONLY place that flips Membership INVITED -> ACTIVE.
 */
export function acceptInvitation(invitationId: string): Invitation | undefined {
  const invitation = invitationsStore.find((inv) => inv.id === invitationId);
  if (!invitation) return undefined;

  invitationsStore = invitationsStore.map((inv) =>
    inv.id === invitationId ? { ...inv, status: "ACCEPTED" as const } : inv
  );

  // Flip linked membership status to Active
  setMemberStatusInStore(invitation.membershipId, "Active");

  return invitationsStore.find((inv) => inv.id === invitationId);
}

export function getInvitation(id: string): Invitation | undefined {
  return invitationsStore.find((inv) => inv.id === id);
}

export function getInvitationByMembership(
  membershipId: string
): Invitation | undefined {
  return invitationsStore.find((inv) => inv.membershipId === membershipId);
}

export function getInvitationBySigningId(
  signingId: string
): Invitation | undefined {
  return invitationsStore.find((inv) => inv.signingId === signingId);
}

export function getInvitationByHireId(
  hireId: string
): Invitation | undefined {
  return invitationsStore.find((inv) => inv.hireId === hireId);
}

export function getAllInvitations(): Invitation[] {
  return [...invitationsStore];
}

// ─── Query hooks ───────────────────────────────────────────────────────────

async function fetchInvitationById(id: string): Promise<Invitation | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return invitationsStore.find((inv) => inv.id === id);
}

async function fetchInvitationByMembership(
  membershipId: string
): Promise<Invitation | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return invitationsStore.find((inv) => inv.membershipId === membershipId);
}

export function useInvitationDetail(id: string) {
  return useQuery<Invitation | undefined>({
    queryKey: ["invitations", "detail", id],
    queryFn: () => fetchInvitationById(id),
    enabled: Boolean(id),
  });
}

export function useInvitationByMembership(membershipId: string) {
  return useQuery<Invitation | undefined>({
    queryKey: ["invitations", "membership", membershipId],
    queryFn: () => fetchInvitationByMembership(membershipId),
    enabled: Boolean(membershipId),
  });
}
