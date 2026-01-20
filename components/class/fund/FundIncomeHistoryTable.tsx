"use client";

import Button from "@/components/ui/Button";
import { Pencil } from "lucide-react";

interface HistoryItem {
  id: string;
  content: string;
  amount: number;
  contributedAt: string;
  notes?: string;
}

interface Props {
  data: HistoryItem[];
  onEdit?: (item: HistoryItem) => void;
}

export default function FundIncomeHistoryTable({
  data,
  onEdit,
}: Props) {
  const total = data.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th className="px-4 py-3 text-left w-[60px]">STT</th>
            <th className="px-4 py-3 text-left w-[180px]">Nội dung đóng</th>
            <th className="px-4 py-3 text-right w-[140px]">Số tiền</th>
            <th className="px-4 py-3 text-center w-[140px]">Ngày đóng</th>

            {/* 👇 GHI CHÚ NHỎ LẠI */}
            <th className="px-4 py-3 text-left w-[180px]">Ghi chú</th>

            {onEdit && (
              <th className="px-4 py-3 text-left w-[100px]">
                Thao tác
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={onEdit ? 6 : 5}
                className="py-8 text-center text-gray-500"
              >
                Chưa có lịch sử đóng tiền
              </td>
            </tr>
          ) : (
            data.map((i, idx) => (
              <tr
                key={i.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">{idx + 1}</td>

                <td className="px-4 py-3">{i.content}</td>

                <td className="px-4 py-3 text-right text-[#518581] font-medium">
                  {i.amount.toLocaleString()}đ
                </td>

                <td className="px-4 py-3 text-center">
                  {i.contributedAt}
                </td>

                <td
                  className="px-4 py-3 text-gray-500 truncate"
                  title={i.notes}
                >
                  {i.notes || "-"}
                </td>

                {onEdit && (
                  <td className="px-4 py-3 text-left">
                    <Button
                      icon={Pencil}
                      onClick={() => onEdit(i)}
                    >
                      <span className="sr-only">Sửa</span>
                    </Button>
                  </td>
                )}
              </tr>
            ))
          )}

          {/* ===== TOTAL ===== */}
          {data.length > 0 && (
            <tr className="bg-[#F1F7F3] border-t">
              <td
                colSpan={2}
                className="px-4 py-4 font-semibold text-center"
              >
                Tổng cộng:
              </td>

              <td className="px-4 py-4 text-right font-semibold text-[#518581]">
                {total.toLocaleString()}đ
              </td>

              <td colSpan={onEdit ? 3 : 2} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
