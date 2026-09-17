export type SigningStatus =
  | "DRAFT"
  | "AWAITING_ACCEPTANCE"
  | "PENDING_REGISTRATION"
  | "REGISTERED"
  | "EXPIRED"
  | "TERMINATED";

export type SalaryPeriod = "MONTHLY" | "WEEKLY";

export interface OtherFeeItem {
  id?: string;
  name: string;
  amount: number;
}

export interface Contract {
  id: string;
  signingId: string;
  lengthMonths: number;
  salaryAmount: number;
  salaryPeriod: SalaryPeriod;
  signingBonus: number;
  performanceAddOn?: number;
  sellOnClause?: number;
  agentFee?: number;
  otherFees?: OtherFeeItem[];
}

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
  contract: Contract;
  registrationWindowOpen?: boolean;
}
