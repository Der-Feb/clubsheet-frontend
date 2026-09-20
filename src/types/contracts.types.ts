export type SalaryPeriod = "MONTHLY" | "WEEKLY";

export interface OtherFeeItem {
  id?: string;
  name: string;
  amount: number;
}

export interface Contract {
  id: string;
  membershipId: string;   // required FK to Membership
  signingId?: string;     // set when origin = Signing pipeline
  hireId?: string;        // set when origin = Direct Hire
  lengthMonths: number;
  salaryAmount: number;
  salaryPeriod: SalaryPeriod;
  signingBonus: number;
  performanceAddOn?: number;
  sellOnClause?: number;
  agentFee?: number;
  otherFees?: OtherFeeItem[];
  startDate?: string;     // ISO date string
  createdAt: string;
}
