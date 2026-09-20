import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_HIRES } from "@/mocks/hires.mock";
import type { DirectHire, HireStatus, HireRole } from "@/types/hires.types";
import type { SalaryPeriod } from "@/types/contracts.types";
import type { Department } from "@/types/members-roles.types";
import { createHireContract } from "./use-contracts.hook";
import {
  createInvitation,
  acceptInvitation,
  getInvitationByHireId,
} from "./use-invitations.hook";
import { useCreateFinancialRecord } from "./use-finance.hook";

// In-memory store
let hiresStore: DirectHire[] = [...MOCK_HIRES];

// Helper to determine Department from HireRole
function getDepartmentForRole(role: HireRole): Department {
  switch (role) {
    case "Coach":
    case "Technical Staff":
      return "Technical";
    case "Medical Staff":
      return "Medical";
    case "Operations":
      return "Operations";
    case "Executive":
      return "Management";
    default:
      return "Technical";
  }
}

// Fetchers
async function fetchHires(
  statusFilter?: HireStatus | "ALL"
): Promise<DirectHire[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (!statusFilter || statusFilter === "ALL") {
    return [...hiresStore];
  }
  return hiresStore.filter((h) => h.status === statusFilter);
}

async function fetchHireDetail(id: string): Promise<DirectHire | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return hiresStore.find((h) => h.id === id);
}

// Query Hooks
export function useHires(statusFilter: HireStatus | "ALL" = "ALL") {
  return useQuery<DirectHire[]>({
    queryKey: ["hires", statusFilter],
    queryFn: () => fetchHires(statusFilter),
  });
}

export function useHireDetail(id: string) {
  return useQuery<DirectHire | undefined>({
    queryKey: ["hires", "detail", id],
    queryFn: () => fetchHireDetail(id),
    enabled: Boolean(id),
  });
}

// Mutation Hooks

export interface CreateHireInput {
  personName: string;
  personEmail?: string;
  role: HireRole;
  clubId?: string;
  contractLengthMonths: number;
  salaryAmount: number;
  salaryPeriod: SalaryPeriod;
  signingBonus: number;
  startDate: string;
}

/**
 * POST /direct-hires
 * Creates:
 * 1. Membership (status: "Invited", membershipType: role) + Invitation via createInvitation()
 * 2. Contract (linked via membershipId, hireId set) via createHireContract()
 * 3. DirectHire record
 * 4. Logs signing bonus financial expense
 */
export function useCreateHire() {
  const queryClient = useQueryClient();
  const createFinancialRecord = useCreateFinancialRecord();

  return useMutation({
    mutationFn: async (data: CreateHireInput) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const hireId = `hire-${Date.now()}`;
      const department = getDepartmentForRole(data.role);

      // 1. Create Invitation + Membership together
      const { invitation, membership } = createInvitation({
        name: data.personName,
        email: data.personEmail,
        role: data.role,
        membershipType: data.role,
        department,
        clubId: data.clubId || "club-1",
        hireId,
      });

      // 2. Create Contract
      const contract = createHireContract(hireId, membership.id, {
        lengthMonths: data.contractLengthMonths,
        salaryAmount: data.salaryAmount,
        salaryPeriod: data.salaryPeriod,
        signingBonus: data.signingBonus,
        startDate: data.startDate,
      });

      const newHire: DirectHire = {
        id: hireId,
        membershipId: membership.id,
        contractId: contract.id,
        invitationId: invitation.id,
        personName: data.personName,
        personEmail: data.personEmail,
        role: data.role,
        status: "INVITED",
        startDate: data.startDate,
        createdAt: new Date().toISOString().split("T")[0],
      };

      hiresStore.unshift(newHire);

      // Log financial record for bonus if applicable
      if (data.signingBonus > 0) {
        try {
          createFinancialRecord.mutate({
            type: "EXPENSE",
            category: "OTHER",
            amount: data.signingBonus,
            currency: "USD",
            description: `Signing Bonus for ${data.personName} (${data.role})`,
            recordDate: new Date().toISOString().split("T")[0],
            linkedEntityName: data.personName,
          });
        } catch {
          // Gracefully continue
        }
      }

      return newHire;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hires"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

/**
 * POST /direct-hires/:id/accept-invitation
 * Calls the shared acceptInvitation() and flips hire status to ACTIVE.
 * No transfer window check, no medical gate, no registration step!
 */
export function useAcceptHireInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hireId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const target = hiresStore.find((h) => h.id === hireId);
      if (!target) throw new Error("Direct hire record not found");

      const invId = target.invitationId || getInvitationByHireId(hireId)?.id;
      if (invId) {
        acceptInvitation(invId);
      }

      hiresStore = hiresStore.map((h) =>
        h.id === hireId ? { ...h, status: "ACTIVE" as const } : h
      );

      return hiresStore.find((h) => h.id === hireId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hires"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

/**
 * POST /direct-hires/:id/resend-invitation
 */
export function useResendHireInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hireId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const target = hiresStore.find((h) => h.id === hireId);
      if (!target) throw new Error("Direct hire record not found");

      return target;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hires"] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

/**
 * POST /direct-hires/:id/terminate
 */
export function useTerminateHire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hireId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      hiresStore = hiresStore.map((h) =>
        h.id === hireId ? { ...h, status: "TERMINATED" as const } : h
      );

      return hiresStore.find((h) => h.id === hireId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hires"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
