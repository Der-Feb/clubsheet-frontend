export type MedicalRecordStatus = "ACTIVE" | "RECOVERING" | "RECOVERED";
export type MedicalRecordType = "CHECKUP" | "INJURY" | "DOPING_TEST";
export type MedicalTestResult = "PENDING" | "CLEARED" | "FLAGGED" | "POSITIVE";

/**
 * Athlete health history is independent from transfer medical examinations.
 */
export interface MedicalRecord {
  id: string;
  membershipId: string;
  type: MedicalRecordType;
  condition: string;
  dateOccurred: string;
  severity: "MINOR" | "MODERATE" | "SEVERE";
  status: MedicalRecordStatus;
  result: MedicalTestResult;
  overallComments?: string;
  clinician?: string;
  transferId?: string;
  signingId?: string;
  createdAt: string;
}
