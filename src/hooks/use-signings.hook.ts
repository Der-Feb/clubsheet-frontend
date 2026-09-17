import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_SIGNINGS } from "@/mocks/signings.mock";
import type { Signing, SigningStatus } from "@/types/signings.types";
import type { SalaryPeriod, OtherFeeItem } from "@/types/contracts.types";
import { createSigningContract } from "./use-contracts.hook";
import { useCreateFinancialRecord } from "./use-finance.hook";

// In-memory store for persistent session mutations
let signingsStore: Signing[] = [...MOCK_SIGNINGS];

// Fetchers
async function fetchSignings(
  statusFilter?: SigningStatus | "ALL"
): Promise<Signing[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (!statusFilter || statusFilter === "ALL") {
    return [...signingsStore];
  }
  return signingsStore.filter((s) => s.status === statusFilter);
}

async function fetchSigningDetail(id: string): Promise<Signing | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return signingsStore.find((s) => s.id === id);
}

// Query Hooks
export function useSignings(statusFilter: SigningStatus | "ALL" = "ALL") {
  return useQuery<Signing[]>({
    queryKey: ["signings", statusFilter],
    queryFn: () => fetchSignings(statusFilter),
  });
}

export function useSigningDetail(id: string) {
  return useQuery<Signing | undefined>({
    queryKey: ["signings", "detail", id],
    queryFn: () => fetchSigningDetail(id),
    enabled: Boolean(id),
  });
}

// Mutation Hooks

/**
 * POST /clubs/:clubId/signings
 * Creating a Signing:
 * - Creates Signing record (status: AWAITING_ACCEPTANCE)
 * - Calls createSigningContract() to create a shared Contract record
 * - Immediately creates FinancialRecord (EXPENSE, amount: signingBonus)
 */
export function useCreateSigning() {
  const queryClient = useQueryClient();
  const createFinancialRecord = useCreateFinancialRecord();

  return useMutation({
    mutationFn: async (data: {
      athleteName: string;
      athleteId?: string;
      transferId?: string;
      scoutingTargetId?: string;
      contractLengthMonths: number;
      salaryAmount: number;
      salaryPeriod: SalaryPeriod;
      signingBonus: number;
      effectiveDate: string;
      performanceAddOn?: number;
      sellOnClause?: number;
      otherFees?: OtherFeeItem[];
      registrationWindowOpen?: boolean;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const signingId = `sng-${Date.now()}`;
      // membershipId derived from athleteId for now (will be a real FK in backend)
      const membershipId = `mbr-${Date.now()}`;

      // Create shared contract via the contracts module
      const contract = createSigningContract(signingId, membershipId, {
        lengthMonths: data.contractLengthMonths,
        salaryAmount: data.salaryAmount,
        salaryPeriod: data.salaryPeriod,
        signingBonus: data.signingBonus,
        performanceAddOn: data.performanceAddOn,
        sellOnClause: data.sellOnClause,
        otherFees:
          data.otherFees && data.otherFees.length > 0
            ? data.otherFees
            : undefined,
        startDate: data.effectiveDate,
      });

      const newSigning: Signing = {
        id: signingId,
        athleteId: data.athleteId || `ath-${Date.now()}`,
        athleteName: data.athleteName,
        clubId: "club-1",
        transferId: data.transferId || null,
        scoutingTargetId: data.scoutingTargetId || null,
        status: "AWAITING_ACCEPTANCE",
        effectiveDate: data.effectiveDate,
        createdAt: new Date().toISOString().split("T")[0],
        contractId: contract.id,
        registrationWindowOpen:
          data.registrationWindowOpen !== undefined
            ? data.registrationWindowOpen
            : true,
      };

      signingsStore.unshift(newSigning);

      // Immediately log FinancialRecord (EXPENSE for signing bonus)
      if (data.signingBonus > 0) {
        try {
          createFinancialRecord.mutate({
            type: "EXPENSE",
            category: "OTHER",
            amount: data.signingBonus,
            currency: "USD",
            description: `Signing Bonus for ${data.athleteName}`,
            recordDate: new Date().toISOString().split("T")[0],
            linkedEntityName: data.athleteName,
          });
        } catch {
          // Gracefully continue
        }
      }

      return newSigning;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signings"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}

/**
 * POST /signings/:id/accept-invitation
 * Completes the signing:
 * - Checks registration window:
 *   - If window open -> REGISTERED
 *   - If window closed -> PENDING_REGISTRATION
 */
export function useAcceptSigningInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signingId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = signingsStore.find((s) => s.id === signingId);
      if (!target) throw new Error("Signing not found");

      const windowIsOpen = target.registrationWindowOpen !== false;
      const nextStatus: SigningStatus = windowIsOpen
        ? "REGISTERED"
        : "PENDING_REGISTRATION";

      signingsStore = signingsStore.map((s) =>
        s.id === signingId ? { ...s, status: nextStatus } : s
      );

      return signingsStore.find((s) => s.id === signingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signings"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

/**
 * POST /signings/:id/register
 * Manual registration trigger for PENDING_REGISTRATION signings
 */
export function useRegisterSigning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signingId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      signingsStore = signingsStore.map((s) =>
        s.id === signingId ? { ...s, status: "REGISTERED" as SigningStatus } : s
      );

      return signingsStore.find((s) => s.id === signingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signings"] });
    },
  });
}
