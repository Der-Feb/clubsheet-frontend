import type { MedicalRecord } from "@/types/medical.types";

export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: "med-rec-1",
    membershipId: "m-2",
    condition: "Hamstring strain",
    dateOccurred: "2026-08-27",
    severity: "MODERATE",
    status: "RECOVERING",
  },
  {
    id: "med-rec-2",
    membershipId: "m-2",
    condition: "Ankle sprain",
    dateOccurred: "2026-03-12",
    severity: "MINOR",
    status: "RECOVERED",
  },
  {
    id: "med-rec-3",
    membershipId: "m-4",
    condition: "Knee tendinopathy",
    dateOccurred: "2026-09-04",
    severity: "MODERATE",
    status: "ACTIVE",
  },
];
