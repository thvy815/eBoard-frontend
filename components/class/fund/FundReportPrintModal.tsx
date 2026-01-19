"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import FundReportTable from "./FundReportTable";
import { FundIncome, FundExpense } from "@/types/fund";
import { ClassInfo } from "@/types/Class";
import { useMemo } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  incomes: FundIncome[];
  expenses: FundExpense[];
  classInfo?: ClassInfo;
}

export default function FundReportPrintModal({
  open,
  onClose,
  incomes,
  expenses,
  classInfo,
}: Props) {
  const reporter = classInfo?.teacherName || "Giáo viên chủ nhiệm";

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
  }, [incomes, expenses, reporter]);

  const totalIncome = rows
    .filter((r) => r.amount > 0)
    .reduce((s, r) => s + r.amount, 0);

  const totalExpense = rows
    .filter((r) => r.amount < 0)
    .reduce((s, r) => s + Math.abs(r.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
   <Modal open={open} onClose={onClose} width="700px">
        <div className=" max-h-[80vh] overflow-y-auto space-y-6 p-4 ">
            <div className="print-area print-preview space-y-6 bg-white p-6">
                {/* ===== HEADER ===== */}
                <div className="text-center space-y-1">
                <h2 className="text-xl font-bold uppercase">
                    BÁO CÁO THU - CHI QUỸ LỚP
                </h2>

                <div className="flex justify-center gap-10 text-sm text-gray-600">
                    <div>
                    Lớp: <b>{classInfo?.name}</b>
                    </div>
                    <div>
                    GVCN: <b>{reporter}</b>
                    </div>
                </div>
                </div>

                {/* ===== TABLE ===== */}
                <FundReportTable
                data={rows}
                page={1}
                onPageChange={() => {}}
                />

                {/* ===== ACTION (KHÔNG IN) ===== */}
                <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={() => window.print()}>
                    In báo cáo
                </Button>
                </div>
            </div>
        </div>
        </Modal>

  );
}
