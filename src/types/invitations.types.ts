export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

export interface Invitation {
  id: string;
  membershipId: string;
  signingId?: string;
  hireId?: string;
  status: InvitationStatus;
  expiresAt: string; // ISO UTC string
  createdAt: string;
}
