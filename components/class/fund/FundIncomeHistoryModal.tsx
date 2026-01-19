"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { fundService } from "@/services/fundService";
import FundIncomeHistoryTable from "./FundIncomeHistoryTable";

interface HistoryItem {
  id: string;
  content: string;
  amount: number;
  contributedAt: string;
  notes?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  incomeId: string;
  studentId: string;
  studentName: string;
  incomeTitle: string;
}

export default function FundIncomeHistoryModal({
  open,
  onClose,
  incomeId,
  studentId,
  studentName,
  incomeTitle,
}: Props) {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    fundService
      .getIncomeDetailsByStudent(incomeId, studentId)
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [open, incomeId, studentId]);

  const total = useMemo(
    () => data.reduce((sum, i) => sum + i.amount, 0),
    [data]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="LỊCH SỬ ĐÓNG TIỀN"
      width="max-w-none w-[900px]"
    >
      <div className="flex flex-col gap-6">
        {/* ===== INFO BAR ===== */}
        <div className="bg-[#F1F7F3] rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Học sinh</p>
            <p className="font-medium">{studentName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Khoản thu</p>
            <p className="font-medium">{incomeTitle}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Tổng đã đóng</p>
            <p className="font-semibold text-[#518581]">
              {total.toLocaleString()}đ
            </p>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        {loading ? (
          <div className="p-10 text-center">Đang tải...</div>
        ) : (
          <FundIncomeHistoryTable data={data} />
        )}

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
