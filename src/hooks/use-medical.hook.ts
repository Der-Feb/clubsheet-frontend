import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MOCK_MEDICAL_RECORDS } from "@/mocks/medical.mock";
import type { MedicalRecord, MedicalRecordStatus, MedicalRecordType, MedicalTestResult } from "@/types/medical.types";

let medicalRecordsStore: MedicalRecord[] = [...MOCK_MEDICAL_RECORDS];

export function getMedicalRecordsByMembership(membershipId: string): MedicalRecord[] {
  return medicalRecordsStore.filter((record) => record.membershipId === membershipId);
}

export function getMedicalRecord(id: string): MedicalRecord | undefined {
  return medicalRecordsStore.find((record) => record.id === id);
}

async function fetchMedicalRecords(): Promise<MedicalRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...medicalRecordsStore];
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

export function useMedicalRecords() {
  return useQuery<MedicalRecord[]>({
    queryKey: ["medical-records"],
    queryFn: fetchMedicalRecords,
  });
}

export interface CreateMedicalRecordInput {
  membershipId: string;
  type: MedicalRecordType;
  condition: string;
  dateOccurred: string;
  severity: MedicalRecord["severity"];
  status: MedicalRecordStatus;
  result: MedicalTestResult;
  overallComments?: string;
  clinician?: string;
  transferId?: string;
  signingId?: string;
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMedicalRecordInput) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const record: MedicalRecord = {
        id: `med-rec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...input,
      };
      medicalRecordsStore = [record, ...medicalRecordsStore];
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
  });
}
