import { useQuery } from "@tanstack/react-query";
import { MOCK_CONTRACTS } from "@/mocks/contracts.mock";
import type { Contract, SalaryPeriod, OtherFeeItem } from "@/types/contracts.types";

// In-memory store
let contractsStore: Contract[] = [...MOCK_CONTRACTS];

// ─── Pure functions (not hooks) ────────────────────────────────────────────

/**
 * The ONLY function that pushes a new contract into the store.
 * Side effects (e.g. FinancialRecord) remain in the caller's hook.
 */
export function createContract(
  input: Omit<Contract, "id" | "createdAt">
): Contract {
  const contract: Contract = {
    id: `cnt-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    ...input,
  };
  contractsStore.push(contract);
  return contract;
}

/** Thin wrapper: creates a contract that originated from a Signing. */
export function createSigningContract(
  signingId: string,
  membershipId: string,
  terms: {
    lengthMonths: number;
    salaryAmount: number;
    salaryPeriod: SalaryPeriod;
    signingBonus: number;
    performanceAddOn?: number;
    sellOnClause?: number;
    agentFee?: number;
    otherFees?: OtherFeeItem[];
    startDate?: string;
  }
): Contract {
  return createContract({ signingId, membershipId, ...terms });
}

/** Thin wrapper: creates a contract that originated from a Direct Hire. */
export function createHireContract(
  hireId: string,
  membershipId: string,
  terms: {
    lengthMonths: number;
    salaryAmount: number;
    salaryPeriod: SalaryPeriod;
    signingBonus: number;
    performanceAddOn?: number;
    sellOnClause?: number;
    startDate?: string;
  }
): Contract {
  return createContract({ hireId, membershipId, ...terms });
}

export function getContract(id: string): Contract | undefined {
  return contractsStore.find((c) => c.id === id);
}

export function getContractByMembership(
  membershipId: string
): Contract | undefined {
  return contractsStore.find((c) => c.membershipId === membershipId);
}

export function getAllContracts(): Contract[] {
  return [...contractsStore];
}

// ─── Query hooks ───────────────────────────────────────────────────────────

async function fetchContracts(): Promise<Contract[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...contractsStore];
}

async function fetchContractById(id: string): Promise<Contract | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return contractsStore.find((c) => c.id === id);
}

async function fetchContractByMembership(
  membershipId: string
): Promise<Contract | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return contractsStore.find((c) => c.membershipId === membershipId);
}

export function useContracts() {
  return useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  });
}

export function useContractDetail(id: string) {
  return useQuery<Contract | undefined>({
    queryKey: ["contracts", "detail", id],
    queryFn: () => fetchContractById(id),
    enabled: Boolean(id),
  });
}

export function useContractByMembership(membershipId: string) {
  return useQuery<Contract | undefined>({
    queryKey: ["contracts", "membership", membershipId],
    queryFn: () => fetchContractByMembership(membershipId),
    enabled: Boolean(membershipId),
  });
}
