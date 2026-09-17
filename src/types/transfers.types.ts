export type TransferStatus =
  | "OPEN"
  | "COUNTERED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface TransferOffer {
  id: string;
  clubId: string;
  clubName: string;
  clubLogo?: string;
  feeAmount: number;
  terms?: string;
  notes?: string;
  isCounter?: boolean;
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
  scoutingReport?: ScoutingReportSummary | null;
}
