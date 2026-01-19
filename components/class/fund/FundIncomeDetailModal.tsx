"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import FundIncomeDetailTable from "./FundIncomeDetailTable";
import FundIncomeInfoHeader from "./FundIncomeInfoHeader";
import FundIncomeStats from "./FundIncomeStats";
import { FundIncomeSummary } from "@/types/fund";
import { fundService } from "@/services/fundService";
import { ClassInfo } from "@/types/Class";
interface Props {
  open: boolean;
  onClose: () => void;
  fundIncomeId?: string;
  title: string;
  classInfo?: ClassInfo;
}

export default function FundIncomeDetailModal({
  open,
  onClose,
  fundIncomeId,
  title,
  classInfo,
}: Props) {
  const [data, setData] = useState<FundIncomeSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !fundIncomeId) return;

    setLoading(true);
    fundService
      .getIncomeSummary(fundIncomeId)
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [open, fundIncomeId]);

  const stats = useMemo(() => {
    let paid = 0,
      partial = 0,
      unpaid = 0,
      totalCollected = 0;

    data.forEach((s) => {
      totalCollected += s.totalContributedAmount;

      if (s.totalContributedAmount === 0) unpaid++;
      else if (s.totalContributedAmount < s.expectedAmount) partial++;
      else paid++;
    });

    return { paid, partial, unpaid, totalCollected };
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="THÔNG TIN CHI TIẾT KHOẢN THU"
      width="max-w-none w-[95vw]"
    >
      <div className="max-h-[85vh] flex flex-col gap-6">
        <FundIncomeInfoHeader
          className={classInfo?.name || "undefine"}
          title={title}
        />

        <FundIncomeStats {...stats} />

        {loading ? (
          <div className="p-10 text-center">Đang tải...</div>
        ) : (
          <FundIncomeDetailTable data={data} fundIncomeId={fundIncomeId} incomeTitle={title} />
        )}
      </div>
    </Modal>
  );
}
