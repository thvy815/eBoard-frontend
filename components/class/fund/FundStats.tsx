"use client";

import StatCard from "@/components/ui/StatCard";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { ClassFund } from "@/types/fund";

export default function FundStats({ data }: { data: ClassFund }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Tổng thu"
        value={`${data.totalContributions.toLocaleString()}đ`}
        icon={ArrowDownCircle}
        accentColor="#6BCDB1"
      />
      <StatCard
        title="Tổng chi"
        value={`${data.totalExpenses.toLocaleString()}đ`}
        icon={ArrowUpCircle}
        accentColor="#F87171"
      />
      <StatCard
        title="Số dư"
        value={`${data.currentBalance.toLocaleString()}đ`}
        icon={Wallet}
        accentColor="#518581"
      />
    </div>
  );
}
