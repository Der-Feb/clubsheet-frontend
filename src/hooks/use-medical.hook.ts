import { useQuery } from "@tanstack/react-query";
import { MOCK_MEDICAL_RECORDS } from "@/mocks/medical.mock";
import type { MedicalRecord } from "@/types/medical.types";

let medicalRecordsStore: MedicalRecord[] = [...MOCK_MEDICAL_RECORDS];

export function getMedicalRecordsByMembership(membershipId: string): MedicalRecord[] {
  return medicalRecordsStore.filter((record) => record.membershipId === membershipId);
}

async function fetchMedicalRecordsByMembership(
  membershipId: string
): Promise<MedicalRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return getMedicalRecordsByMembership(membershipId);
}

export function useMedicalRecordsByMembership(membershipId: string) {
  return useQuery<MedicalRecord[]>({
    queryKey: ["medical-records", "membership", membershipId],
    queryFn: () => fetchMedicalRecordsByMembership(membershipId),
    enabled: Boolean(membershipId),
  });
}
