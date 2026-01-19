import { CheckCircle, AlertTriangle, XCircle, Wallet } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

interface Props {
  paid: number;
  partial: number;
  unpaid: number;
  totalCollected: number;
}

export default function FundIncomeStats({
  paid,
  partial,
  unpaid,
  totalCollected,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Đã đóng"
        value={paid}
        icon={CheckCircle}
        accentColor="#22C55E"
      />

      <StatCard
        title="Đã đóng một phần"
        value={partial}
        icon={AlertTriangle}
        accentColor="#EAB308"
      />

      <StatCard
        title="Chưa đóng"
        value={unpaid}
        icon={XCircle}
        accentColor="#EF4444"
      />

      <StatCard
        title="Tổng đã thu"
        value={`${totalCollected.toLocaleString()}đ`}
        icon={Wallet}
        accentColor="#3B82F6"
      />
    </div>
  );
}
