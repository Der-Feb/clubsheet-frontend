export type TransferStatus =
  | "OPEN"
  | "COUNTERED"
  | "TERMS_AGREED"
  | "MEDICAL_SCHEDULED"
  | "MEDICAL_FLAGGED"
  | "ACCEPTED"
  | "DISQUALIFIED"
  | "REJECTED"
  | "WITHDRAWN";

export type MedicalExamStatus = "SCHEDULED" | "PASSED" | "FLAGGED" | "FAILED";
export type FindingSeverity = "MINOR" | "MODERATE" | "SEVERE";

export interface MedicalFinding {
  id: string;
  examId: string;
  condition: string;
  severity: FindingSeverity;
  note: string;
  disqualifying: boolean;
}

export interface MedicalExam {
  id: string;
  transferId: string;
  athleteId: string;
  status: MedicalExamStatus;
  examDate: string;
  clinician: string;
  findings: MedicalFinding[];
}

export interface TransferOffer {
  id: string;
  clubId: string;
  clubName: string;
  clubLogo?: string;
  feeAmount: number;
  terms?: string;
  notes?: string;
  isCounter?: boolean;
  citesFindingId?: string;
  citesFindingCondition?: string;
  createdAt: string;
}

export interface ScoutingReportSummary {
  overallRating: number;
  estimatedValue: number;
  notes: string;
}

export interface Transfer {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  athletePosition?: string;
  fromClubId: string;
  fromClubName: string;
  fromClubLogo?: string;
  toClubId: string;
  toClubName: string;
  toClubLogo?: string;
  currentOfferFee: number;
  status: TransferStatus;
  lastActivity: string;
  createdAt: string;
  negotiationHistory: TransferOffer[];
  signingId?: string | null;
  scoutingTargetId?: string | null;
  scoutingReport?: ScoutingReportSummary | null;
  medicalExam?: MedicalExam | null;
}
