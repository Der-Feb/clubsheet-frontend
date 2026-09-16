export type ScoutingStatus =
  | "WATCHING"
  | "SHORTLISTED"
  | "TRANSFER_OPENED"
  | "DROPPED";

export type ScoutingAttribute =
  | "PACE"
  | "SHOOTING"
  | "PASSING"
  | "DRIBBLING"
  | "DEFENDING"
  | "PHYSICAL";

export interface ScoutingAttributeRating {
  id: string;
  reportId: string;
  attribute: ScoutingAttribute;
  value: number; // 1-99 rating scale
}

export interface ScoutingReport {
  id: string;
  scoutingTargetId: string;
  scoutId: string;
  scoutName: string;
  position: string;
  overallRating: number; // 1-99 rating
  estimatedValue: number; // transfer fee estimate in USD/EUR
  notes: string;
  createdAt: string;
  attributes: ScoutingAttributeRating[];
}

export interface ScoutingTarget {
  id: string;
  clubId: string;
  athleteId?: string | null;
  externalName: string;
  currentClub?: string;
  primaryPosition: string;
  status: ScoutingStatus;
  addedById: string;
  addedByName: string;
  createdAt: string;
  latestRating?: number; // 1-99
  reports?: ScoutingReport[];
}
