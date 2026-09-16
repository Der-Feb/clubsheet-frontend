import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MOCK_FINANCIAL_RECORDS,
  MOCK_CONTRACTS,
} from "@/mocks/finance.mock";
import type {
  FinancialRecord,
  FinancialRecordType,
  FinancialCategory,
  Contract,
  FinanceSummary,
} from "@/types/finance.types";

let recordsStore: FinancialRecord[] = [...MOCK_FINANCIAL_RECORDS];
let contractsStore: Contract[] = [...MOCK_CONTRACTS];

// Fetchers
async function fetchFinancialRecords(filters?: {
  type?: FinancialRecordType | "ALL";
  category?: FinancialCategory | "ALL";
  from?: string;
  to?: string;
}): Promise<FinancialRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  let result = [...recordsStore];

  if (filters?.type && filters.type !== "ALL") {
    result = result.filter((r) => r.type === filters.type);
  }

  if (filters?.category && filters.category !== "ALL") {
    result = result.filter((r) => r.category === filters.category);
  }

  if (filters?.from) {
    result = result.filter((r) => r.recordDate >= filters.from!);
  }

  if (filters?.to) {
    result = result.filter((r) => r.recordDate <= filters.to!);
  }

  // Sort descending by recordDate
  return result.sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );
}

async function fetchFinanceSummary(): Promise<FinanceSummary> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const totalIncome = recordsStore
    .filter((r) => r.type === "INCOME")
    .reduce((acc, r) => acc + r.amount, 0);

  const totalExpenses = recordsStore
    .filter((r) => r.type === "EXPENSE")
    .reduce((acc, r) => acc + r.amount, 0);

  const netPosition = totalIncome - totalExpenses;

  // Monthly salaries computed from active contracts
  const totalMonthlySalaries = contractsStore.reduce((acc, c) => {
    if (c.salaryPeriod === "MONTHLY") {
      return acc + c.salaryAmount;
    }
    // Weekly to monthly conversion approx
    return acc + c.salaryAmount * 4.33;
  }, 0);

  // Monthly amortization computed from contracts transfer fees
  const totalMonthlyAmortization = contractsStore.reduce((acc, c) => {
    if (c.transferFee && c.amortizationMonths && c.amortizationMonths > 0) {
      return acc + c.transferFee / c.amortizationMonths;
    }
    return acc;
  }, 0);

  return {
    totalIncome,
    totalExpenses,
    totalMonthlySalaries: Math.round(totalMonthlySalaries),
    totalMonthlyAmortization: Math.round(totalMonthlyAmortization),
    netPosition,
  };
}

async function fetchContracts(): Promise<Contract[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...contractsStore];
}

// Query Hooks
export function useFinancialRecords(filters?: {
  type?: FinancialRecordType | "ALL";
  category?: FinancialCategory | "ALL";
  from?: string;
  to?: string;
}) {
  return useQuery<FinancialRecord[]>({
    queryKey: [
      "financialRecords",
      filters?.type || "ALL",
      filters?.category || "ALL",
      filters?.from || "",
      filters?.to || "",
    ],
    queryFn: () => fetchFinancialRecords(filters),
  });
}

export function useFinanceSummary() {
  return useQuery<FinanceSummary>({
    queryKey: ["financeSummary"],
    queryFn: fetchFinanceSummary,
  });
}

export function useContracts() {
  return useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  });
}

// Mutation Hooks

/** POST /clubs/:clubId/finance/records */
export function useCreateFinancialRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      category,
      amount,
      currency = "USD",
      description,
      recordDate,
      linkedEntityName,
    }: {
      type: FinancialRecordType;
      category: FinancialCategory;
      amount: number;
      currency?: string;
      description: string;
      recordDate: string;
      linkedEntityName?: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const newRecord: FinancialRecord = {
        id: `fin-${Date.now()}`,
        clubId: "club-1",
        type,
        category,
        amount,
        currency,
        description,
        recordDate: recordDate || new Date().toISOString().split("T")[0],
        linkedEntityName: linkedEntityName || undefined,
        createdAt: new Date().toISOString(),
      };

      recordsStore = [newRecord, ...recordsStore];
      return newRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialRecords"] });
      queryClient.invalidateQueries({ queryKey: ["financeSummary"] });
    },
  });
}

/** DELETE /clubs/:clubId/finance/records/:id */
export function useDeleteFinancialRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      recordsStore = recordsStore.filter((r) => r.id !== recordId);
      return recordId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialRecords"] });
      queryClient.invalidateQueries({ queryKey: ["financeSummary"] });
    },
  });
}
