// Contract, SalaryPeriod, and OtherFeeItem now live in @/types/contracts.types
// Re-exported here for backwards compatibility so existing imports don't break.
export type { SalaryPeriod, OtherFeeItem, Contract } from "@/types/contracts.types";

export type SigningStatus =
  | "DRAFT"
  | "AWAITING_ACCEPTANCE"
  | "PENDING_REGISTRATION"
  | "REGISTERED"
  | "EXPIRED"
  | "TERMINATED";

export interface Signing {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  clubId: string;
  transferId?: string | null;
  scoutingTargetId?: string | null;
  status: SigningStatus;
  effectiveDate: string;
  createdAt: string;
  contractId: string;
  invitationId?: string;
  registrationWindowOpen?: boolean;
}
