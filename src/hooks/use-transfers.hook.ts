import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_TRANSFERS } from "@/mocks/transfers.mock";
import type { Transfer, TransferStatus, TransferOffer } from "@/types/transfers.types";
import { useCreateSigning } from "./use-signings.hook";

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
 * Submit a counter offer in an active transfer negotiation
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
 * Accept a transfer offer
 * - Flips status to ACCEPTED
 * - Creates a linked Signing record with transferId attached!
 */
export function useAcceptTransferOffer() {
  const queryClient = useQueryClient();
  const createSigningMutation = useCreateSigning();

  return useMutation({
    mutationFn: async (transferId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = transfersStore.find((t) => t.id === transferId);
      if (!target) throw new Error("Transfer negotiation not found");

      const generatedSigningId = `sng-${Date.now()}`;

      // Create linked Signing record via createSigningMutation
      try {
        await createSigningMutation.mutateAsync({
          athleteName: target.athleteName,
          transferId: target.id,
          contractLengthMonths: 36,
          salaryAmount: Math.round(target.currentOfferFee / 12),
          salaryPeriod: "MONTHLY",
          signingBonus: Math.round(target.currentOfferFee * 0.1), // 10% bonus
          effectiveDate: new Date().toISOString().split("T")[0],
          registrationWindowOpen: true,
        });
      } catch {
        // Continue fallback
      }

      transfersStore = transfersStore.map((t) => {
        if (t.id === transferId) {
          return {
            ...t,
            status: "ACCEPTED" as TransferStatus,
            lastActivity: "Just now",
            signingId: generatedSigningId,
          };
        }
        return t;
      });

      return transfersStore.find((t) => t.id === transferId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["signings"] });
    },
  });
}

/**
 * Reject a transfer offer
 */
export function useRejectTransferOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

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
 * Withdraw a transfer offer
 */
export function useWithdrawTransferOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

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
