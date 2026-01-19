export interface ClassFund {
  id: string;
  className: string;
  academicYear: string;
  currentBalance: number;
  totalContributions: number;
  totalExpenses: number;
}

export interface FundIncome {
  id: string;
  title: string;
  expectedAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
}

export interface FundExpense {
  id: string; // ⭐ thêm
  title: string;
  amount: number;
  spenderName: string;
  expenseDate: string;
  invoiceImgUrl: string;
  notes: string;
}

// types/fund.ts
export interface FundIncomeDetail {
  studentId: string;
  studentName: string;
  expectedAmount: number;
  paidAmount: number;
  status: "Chưa đóng" | "Đóng một phần" | "Đã đóng";
  paidDate?: string;
  note?: string;
}

export interface FundIncomeStudent {
  studentId: string;
  studentName: string;
  expectedAmount: number;
  paidAmount: number;
  status: "Đã đóng" | "Đóng một phần" | "Chưa đóng";
  paidDate?: string;
  note?: string;
}

export interface FundIncomeSummary {
  studentId: string;
  fullName: string;
  expectedAmount: number;
  totalContributedAmount: number;
  latestContributedAt?: string;
  latestNotes: string;
}


