export type MedicalRecordStatus = "ACTIVE" | "RECOVERING" | "RECOVERED";

/**
 * Athlete health history is independent from transfer medical examinations.
 */
export interface MedicalRecord {
  id: string;
  membershipId: string;
  condition: string;
  dateOccurred: string;
  severity: "MINOR" | "MODERATE" | "SEVERE";
  status: MedicalRecordStatus;
}
