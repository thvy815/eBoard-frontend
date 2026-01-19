"use client";

type FundTab = "income" | "expense" | "report";

interface Props {
  tab: FundTab;
  onChange: (v: FundTab) => void;
}

export default function FundTabs({ tab, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {/* Khoản thu */}
      <button
        onClick={() => onChange("income")}
        className={`px-4 py-2 rounded-full text-sm
          ${tab === "income" ? "bg-[#518581] text-white" : "border"}`}
      >
        Khoản thu
      </button>

      {/* Khoản chi */}
      <button
        onClick={() => onChange("expense")}
        className={`px-4 py-2 rounded-full text-sm
          ${tab === "expense" ? "bg-[#518581] text-white" : "border"}`}
      >
        Khoản chi
      </button>

      {/* Báo cáo */}
      <button
        onClick={() => onChange("report")}
        className={`px-4 py-2 rounded-full text-sm
          ${tab === "report" ? "bg-[#518581] text-white" : "border"}`}
      >
        Báo cáo thu chi
      </button>
    </div>
  );
}
