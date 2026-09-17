export type HireStatus = "INVITED" | "ACTIVE" | "TERMINATED";

export type HireRole =
  | "Coach"
  | "Technical Staff"
  | "Medical Staff"
  | "Operations"
  | "Executive";

export interface DirectHire {
  id: string;
  membershipId: string;
  contractId: string;
  invitationId: string;
  personName: string;
  personEmail?: string;
  role: HireRole;
  status: HireStatus;
  startDate: string;
  createdAt: string;
}
