"use client";

import { useMemo } from "react";
import FundReportTable from "./FundReportTable";
import { FundIncome, FundExpense } from "@/types/fund";
import { ClassInfo } from "@/types/Class";

interface Props {
  incomes: FundIncome[];
  expenses: FundExpense[];
  page: number;
  onPageChange: (p: number) => void;
  classInfo: ClassInfo,
}

export default function FundReport({
  incomes,
  expenses,
  page,
  onPageChange,
  classInfo,
}: Props) {
  const reporter = classInfo?.teacherName || "Người tạo";

  const rows = useMemo(() => {
    const incomeRows = incomes.map((i) => ({
      date: i.startDate,
      content: i.title,
      type: "income" as const,
      amount: i.collectedAmount,
      user: reporter,
    }));

    const expenseRows = expenses.map((e) => ({
      date: e.expenseDate,
      content: e.title,
      type: "expense" as const,
      amount: -e.amount,
      user: e.spenderName,
      note: e.notes,
    }));

    return [...incomeRows, ...expenseRows];
  }, [incomes, expenses]);

  const totalIncome = rows
    .filter((r) => r.amount > 0)
    .reduce((s, r) => s + r.amount, 0);

  const totalExpense = rows
    .filter((r) => r.amount < 0)
    .reduce((s, r) => s + Math.abs(r.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">      
      {/* ===== TABLE ===== */}
      <FundReportTable
        data={rows}
        page={page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
