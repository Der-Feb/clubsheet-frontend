import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_TRANSFERS } from "@/mocks/transfers.mock";
import type {
  Transfer,
  TransferStatus,
  TransferOffer,
  MedicalExam,
  MedicalFinding,
  FindingSeverity,
} from "@/types/transfers.types";
import { useCreateSigning } from "./use-signings.hook";
import { dropScoutingTarget } from "./use-scouting.hook";

// In-memory store for persistent session mutations
let transfersStore: Transfer[] = [...MOCK_TRANSFERS];

// Fetchers
async function fetchTransfers(
  statusFilter?: TransferStatus | "ALL"
): Promise<Transfer[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (!statusFilter || statusFilter === "ALL") {
    return [...transfersStore];
  }
  return transfersStore.filter((t) => t.status === statusFilter);
}

async function fetchTransferDetail(id: string): Promise<Transfer | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return transfersStore.find((t) => t.id === id);
}

// Query Hooks
export function useTransfers(statusFilter: TransferStatus | "ALL" = "ALL") {
  return useQuery<Transfer[]>({
    queryKey: ["transfers", statusFilter],
    queryFn: () => fetchTransfers(statusFilter),
  });
}

export function useTransferDetail(id: string) {
  return useQuery<Transfer | undefined>({
    queryKey: ["transfers", "detail", id],
    queryFn: () => fetchTransferDetail(id),
    enabled: Boolean(id),
  });
}

// Mutation Hooks

/**
 * Open a new transfer negotiation
 */
export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      athleteName: string;
      athletePosition?: string;
      fromClubName: string;
      toClubName: string;
      feeAmount: number;
      terms?: string;
      notes?: string;
      scoutingTargetId?: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const transferId = `trf-${Date.now()}`;
      const offerId = `off-${Date.now()}`;

      const initialOffer: TransferOffer = {
        id: offerId,
        clubId: "club-1",
        clubName: data.toClubName,
        feeAmount: data.feeAmount,
        terms: data.terms || "Standard transfer proposal",
        notes: data.notes || "Initial opening offer",
        isCounter: false,
        createdAt: "Just now",
      };

      const newTransfer: Transfer = {
        id: transferId,
        athleteId: `ath-${Date.now()}`,
        athleteName: data.athleteName,
        athletePosition: data.athletePosition || "Athlete",
        fromClubId: "club-from",
        fromClubName: data.fromClubName,
        toClubId: "club-1",
        toClubName: data.toClubName,
        currentOfferFee: data.feeAmount,
        status: "OPEN",
        lastActivity: "Just now",
        createdAt: new Date().toISOString().split("T")[0],
        negotiationHistory: [initialOffer],
        signingId: null,
        scoutingTargetId: data.scoutingTargetId || null,
      };

      transfersStore.unshift(newTransfer);
      return newTransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/**
 * Submit a standard counter offer in an active transfer negotiation
 */
export function useCounterTransferOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      transferId: string;
      feeAmount: number;
      terms?: string;
      notes?: string;
      clubName?: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = transfersStore.find((t) => t.id === data.transferId);
      if (!target) throw new Error("Transfer negotiation not found");

      const newCounterOffer: TransferOffer = {
        id: `off-${Date.now()}`,
        clubId: "club-2",
        clubName: data.clubName || target.fromClubName,
        feeAmount: data.feeAmount,
        terms: data.terms || "Counter proposal terms",
        notes: data.notes || "Counter offer submitted",
        isCounter: true,
        createdAt: "Just now",
      };

      transfersStore = transfersStore.map((t) => {
        if (t.id === data.transferId) {
          return {
            ...t,
            currentOfferFee: data.feeAmount,
            status: "COUNTERED" as TransferStatus,
            lastActivity: "Just now",
            negotiationHistory: [...t.negotiationHistory, newCounterOffer],
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === data.transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/**
 * Counter based on a specific Medical Finding
 * Attaches citesFindingId and citesFindingCondition to the offer bubble
 */
export function useCounterBasedOnFinding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      transferId: string;
      findingId: string;
      findingCondition: string;
      feeAmount: number;
      terms?: string;
      notes?: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = transfersStore.find((t) => t.id === data.transferId);
      if (!target) throw new Error("Transfer negotiation not found");

      const newCounterOffer: TransferOffer = {
        id: `off-${Date.now()}`,
        clubId: "club-1",
        clubName: target.toClubName,
        feeAmount: data.feeAmount,
        terms: data.terms || `Counter-offer citing ${data.findingCondition}`,
        notes: data.notes || `Adjusted transfer valuation citing clinical finding: ${data.findingCondition}`,
        isCounter: true,
        citesFindingId: data.findingId,
        citesFindingCondition: data.findingCondition,
        createdAt: "Just now",
      };

      transfersStore = transfersStore.map((t) => {
        if (t.id === data.transferId) {
          return {
            ...t,
            currentOfferFee: data.feeAmount,
            status: "COUNTERED" as TransferStatus,
            lastActivity: "Just now",
            negotiationHistory: [...t.negotiationHistory, newCounterOffer],
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === data.transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/**
 * Reaching Terms Agreed:
 * - Moves status to TERMS_AGREED
 * - Creates / Attaches a scheduled MedicalExam record
 */
export function useAgreeTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = transfersStore.find((t) => t.id === transferId);
      if (!target) throw new Error("Transfer not found");

      // Each agreed set of terms receives its own examination. This is especially
      // important after a counter based on a prior finding: the revised offer
      // must be reviewed independently rather than reusing a flagged result.
      const defaultExam: MedicalExam = {
        id: `med-${Date.now()}`,
        transferId: target.id,
        athleteId: target.athleteId,
        status: "SCHEDULED",
        examDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        clinician: "Dr. Patrick Rutayisire",
        findings: [],
      };

      transfersStore = transfersStore.map((t) => {
        if (t.id === transferId) {
          return {
            ...t,
            status: "TERMS_AGREED" as TransferStatus,
            lastActivity: "Just now",
            medicalExam: defaultExam,
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/**
 * Schedule or update medical exam date / clinician
 */
export function useScheduleMedicalExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      transferId: string;
      examDate?: string;
      clinician?: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      transfersStore = transfersStore.map((t) => {
        if (t.id === data.transferId && t.medicalExam) {
          return {
            ...t,
            status: "MEDICAL_SCHEDULED" as TransferStatus,
            lastActivity: "Just now",
            medicalExam: {
              ...t.medicalExam,
              status: "SCHEDULED",
              examDate: data.examDate || t.medicalExam.examDate,
              clinician: data.clinician || t.medicalExam.clinician,
            },
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === data.transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/**
 * Pass Medical Exam & Accept Transfer:
 * - Flips MedicalExam to PASSED
 * - Flips Transfer status to ACCEPTED
 * - Creates linked Signing & Contract via useCreateSigning
 */
export function usePassMedicalExam() {
  const queryClient = useQueryClient();
  const createSigningMutation = useCreateSigning();

  return useMutation({
    mutationFn: async (transferId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = transfersStore.find((t) => t.id === transferId);
      if (!target) throw new Error("Transfer negotiation not found");
      if (target.status !== "MEDICAL_SCHEDULED") {
        throw new Error("Medical examination must be scheduled before it can be passed");
      }
      if (target.medicalExam?.findings.length) {
        throw new Error("A medical examination with findings cannot be passed");
      }

      // 1. Create Signing record & shared contract
      let createdSigningId = `sng-${Date.now()}`;
      try {
        const res = await createSigningMutation.mutateAsync({
          athleteName: target.athleteName,
          transferId: target.id,
          scoutingTargetId: target.scoutingTargetId || undefined,
          contractLengthMonths: 36,
          salaryAmount: Math.round(target.currentOfferFee / 12),
          salaryPeriod: "MONTHLY",
          signingBonus: Math.round(target.currentOfferFee * 0.1),
          effectiveDate: new Date().toISOString().split("T")[0],
          registrationWindowOpen: true,
        });
        if (res?.id) createdSigningId = res.id;
      } catch {
        // Continue
      }

      // 2. Update Transfer to ACCEPTED
      transfersStore = transfersStore.map((t) => {
        if (t.id === transferId) {
          return {
            ...t,
            status: "ACCEPTED" as TransferStatus,
            lastActivity: "Just now",
            signingId: createdSigningId,
            medicalExam: t.medicalExam
              ? { ...t.medicalExam, status: "PASSED" as const }
              : {
                  id: `med-${Date.now()}`,
                  transferId: t.id,
                  athleteId: t.athleteId,
                  status: "PASSED",
                  examDate: new Date().toISOString().split("T")[0],
                  clinician: "Dr. Patrick Rutayisire",
                  findings: [],
                },
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["signings"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

/**
 * Record a clinical finding on a Medical Exam:
 * - If disqualifying -> Status becomes DISQUALIFIED, linked scouting target updated to DROPPED
 * - If non-disqualifying -> Status becomes MEDICAL_FLAGGED
 * - Appends new finding to existing findings array (supports multiple findings per exam)
 */
export function useRecordMedicalFinding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      transferId: string;
      condition: string;
      severity: FindingSeverity;
      note: string;
      disqualifying: boolean;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = transfersStore.find((t) => t.id === data.transferId);
      if (!target) throw new Error("Transfer not found");

      const newFinding: MedicalFinding = {
        id: `fnd-${Date.now()}`,
        examId: target.medicalExam?.id || `med-${Date.now()}`,
        condition: data.condition,
        severity: data.severity,
        note: data.note,
        disqualifying: data.disqualifying,
      };

      const existingFindings = target.medicalExam?.findings || [];
      const updatedFindings = [...existingFindings, newFinding];

      const newTransferStatus: TransferStatus = data.disqualifying
        ? "DISQUALIFIED"
        : "MEDICAL_FLAGGED";

      const newExamStatus = data.disqualifying ? "FAILED" : "FLAGGED";

      // If disqualifying, update linked scouting target to DROPPED
      if (data.disqualifying && target.scoutingTargetId) {
        dropScoutingTarget(target.scoutingTargetId);
      }

      transfersStore = transfersStore.map((t) => {
        if (t.id === data.transferId) {
          return {
            ...t,
            status: newTransferStatus,
            lastActivity: "Just now",
            medicalExam: {
              id: target.medicalExam?.id || `med-${Date.now()}`,
              transferId: t.id,
              athleteId: t.athleteId,
              status: newExamStatus,
              examDate: target.medicalExam?.examDate || new Date().toISOString().split("T")[0],
              clinician: target.medicalExam?.clinician || "Dr. Patrick Rutayisire",
              findings: updatedFindings,
            },
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === data.transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["scouting"] });
    },
  });
}

/**
 * Add a new medical finding to an existing medical exam without changing status.
 * Use this when you want to add additional findings to an exam that already has findings.
 */
export function useAddMedicalFinding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      transferId: string;
      condition: string;
      severity: FindingSeverity;
      note: string;
      disqualifying: boolean;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = transfersStore.find((t) => t.id === data.transferId);
      if (!target) throw new Error("Transfer not found");

      const newFinding: MedicalFinding = {
        id: `fnd-${Date.now()}`,
        examId: target.medicalExam?.id || `med-${Date.now()}`,
        condition: data.condition,
        severity: data.severity,
        note: data.note,
        disqualifying: data.disqualifying,
      };

      const existingFindings = target.medicalExam?.findings || [];
      const updatedFindings = [...existingFindings, newFinding];

      const newExamStatus = data.disqualifying ? "FAILED" : "FLAGGED";

      transfersStore = transfersStore.map((t) => {
        if (t.id === data.transferId) {
          return {
            ...t,
            medicalExam: {
              id: target.medicalExam?.id || `med-${Date.now()}`,
              transferId: t.id,
              athleteId: t.athleteId,
              status: newExamStatus,
              examDate: target.medicalExam?.examDate || new Date().toISOString().split("T")[0],
              clinician: target.medicalExam?.clinician || "Dr. Patrick Rutayisire",
              findings: updatedFindings,
            },
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === data.transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/**
 * Accept a transfer offer:
 * If medical not completed -> moves to TERMS_AGREED with scheduled medical exam
 * If medical already PASSED -> moves to ACCEPTED and creates Signing
 */
export function useAcceptTransferOffer() {
  const queryClient = useQueryClient();
  const agreeTermsMutation = useAgreeTerms();
  const passMedicalExamMutation = usePassMedicalExam();

  return useMutation({
    mutationFn: async (transferId: string) => {
      const target = transfersStore.find((t) => t.id === transferId);
      if (!target) throw new Error("Transfer not found");

      if (target.medicalExam?.status === "PASSED") {
        return passMedicalExamMutation.mutateAsync(transferId);
      } else {
        return agreeTermsMutation.mutateAsync(transferId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["signings"] });
    },
  });
}

/**
 * Reject a transfer offer (Available at any stage)
 */
export function useRejectTransferOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      transfersStore = transfersStore.map((t) => {
        if (t.id === transferId) {
          return {
            ...t,
            status: "REJECTED" as TransferStatus,
            lastActivity: "Just now",
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

/**
 * Withdraw a transfer offer (Available at any stage)
 */
export function useWithdrawTransferOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      transfersStore = transfersStore.map((t) => {
        if (t.id === transferId) {
          return {
            ...t,
            status: "WITHDRAWN" as TransferStatus,
            lastActivity: "Just now",
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}
