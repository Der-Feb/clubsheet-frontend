export type FinancialRecordType = "INCOME" | "EXPENSE";

export type FinancialCategory =
  | "TRANSFER_FEE"
  | "SALARY"
  | "SPONSORSHIP"
  | "TICKET_SALES"
  | "MERCHANDISE"
  | "FACILITY"
  | "OTHER";

export interface FinancialRecord {
  id: string;
  clubId: string;
  type: FinancialRecordType;
  category: FinancialCategory;
  amount: number;
  currency: string;
  description: string;
  recordDate: string;
  relatedTransferId?: string | null;
  relatedMembershipId?: string | null;
  linkedEntityName?: string;
  createdAt: string;
}

export type SalaryPeriod = "MONTHLY" | "WEEKLY";

export interface Contract {
  id: string;
  membershipId: string;
  memberName: string;
  salaryAmount: number;
  salaryPeriod: SalaryPeriod;
  startDate: string;
  endDate: string;
  transferFee?: number;
  amortizationMonths?: number;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  totalMonthlySalaries: number;
  totalMonthlyAmortization: number;
  netPosition: number;
}
