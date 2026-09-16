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

// Approximate currency conversion to USD base currency
const CURRENCY_TO_USD_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  RWF: 0.00075,
};

function convertToUSD(amount: number, currency: string = "USD"): number {
  const rate = CURRENCY_TO_USD_RATES[currency.toUpperCase()] ?? 1;
  return amount * rate;
}

// Active contract predicate checking current date bounds
function isActiveContract(contract: Contract): boolean {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (contract.startDate && contract.startDate > todayStr) return false;
  if (contract.endDate && contract.endDate < todayStr) return false;
  return true;
}

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
    .reduce((acc, r) => acc + convertToUSD(r.amount, r.currency), 0);

  const totalExpenses = recordsStore
    .filter((r) => r.type === "EXPENSE")
    .reduce((acc, r) => acc + convertToUSD(r.amount, r.currency), 0);

  const netPosition = totalIncome - totalExpenses;

  const activeContracts = contractsStore.filter(isActiveContract);

  // Monthly salaries computed from active contracts
  const totalMonthlySalaries = activeContracts.reduce((acc, c) => {
    if (c.salaryPeriod === "MONTHLY") {
      return acc + c.salaryAmount;
    }
    // Weekly to monthly conversion approx
    return acc + c.salaryAmount * 4.33;
  }, 0);

  // Monthly amortization computed from active contracts transfer fees
  const totalMonthlyAmortization = activeContracts.reduce((acc, c) => {
    if (c.transferFee && c.amortizationMonths && c.amortizationMonths > 0) {
      return acc + c.transferFee / c.amortizationMonths;
    }
    return acc;
  }, 0);

  return {
    totalIncome: Math.round(totalIncome),
    totalExpenses: Math.round(totalExpenses),
    totalMonthlySalaries: Math.round(totalMonthlySalaries),
    totalMonthlyAmortization: Math.round(totalMonthlyAmortization),
    netPosition: Math.round(netPosition),
  };
}

async function fetchContracts(): Promise<Contract[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return contractsStore.filter(isActiveContract);
}

// Query Hooks

/** Look up a single financial record by id */
export function useFinancialRecord(recordId: string) {
  return useQuery<FinancialRecord | null>({
    queryKey: ["financialRecord", recordId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return recordsStore.find((r) => r.id === recordId) ?? null;
    },
    enabled: !!recordId,
  });
}


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

      const today = new Date();
      const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const newRecord: FinancialRecord = {
        id: `fin-${Date.now()}`,
        clubId: "club-1",
        type,
        category,
        amount,
        currency,
        description,
        recordDate: recordDate || defaultDate,
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
