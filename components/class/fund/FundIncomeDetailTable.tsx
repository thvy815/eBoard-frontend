"use client";

import { FundIncomeSummary } from "@/types/fund";
import Button from "@/components/ui/Button";
import { Clock, Pencil } from "lucide-react";
import { useState } from "react";
import FundIncomeHistoryModal from "./FundIncomeHistoryModal";

interface Props {
  data: FundIncomeSummary[];
  fundIncomeId: string | undefined;  
  incomeTitle: string; 
  onViewHistory?: (studentId: string) => void;
  onEdit?: (studentId: string) => void;
}

export default function FundIncomeDetailTable({
  data,
  fundIncomeId,
  incomeTitle,
  onViewHistory,
  onEdit,
}: Props) {
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
  }>();

  return (
    <div className="bg-white rounded-xl border flex flex-col overflow-hidden">
      {/* ===== TABLE SCROLL ===== */}
      <div className="overflow-y-auto max-h-[65vh]">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="bg-[#518581] text-white sticky top-0 z-10">
            <tr>
              <th className="w-[60px] px-3 py-3 text-center">STT</th>
              <th className="px-4 py-3 text-left">Học sinh</th>
              <th className="w-[160px] px-3 py-3 text-right">
                Số tiền cần đóng
              </th>
              <th className="w-[160px] px-3 py-3 text-right">Đã đóng</th>
              <th className="w-[180px] px-3 py-3 text-center">
                Ngày đóng gần nhất
              </th>
              <th className="px-4 py-3 text-left">Trạng thái / Ghi chú</th>
              <th className="w-[140px] px-3 py-3 text-center">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((s, idx) => {
                const status =
                  s.totalContributedAmount === 0
                    ? "Chưa đóng"
                    : s.totalContributedAmount < s.expectedAmount
                    ? "Đóng một phần"
                    : "Đã đóng";

                return (
                  <tr
                    key={s.studentId}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-3 py-3 text-center">
                      {idx + 1}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {s.fullName}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {s.expectedAmount.toLocaleString()} ₫
                    </td>

                    <td className="px-3 py-3 text-right font-semibold">
                      {s.totalContributedAmount.toLocaleString()} ₫
                    </td>

                    <td className="px-3 py-3 text-center">
                      {s.latestContributedAt ?? "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`font-medium ${
                          status === "Đã đóng"
                            ? "text-green-600"
                            : status === "Đóng một phần"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {status}
                      </span>

                      {s.latestNotes && (
                        <div className="text-xs text-gray-500 mt-1">
                          {s.latestNotes}
                        </div>
                      )}
                    </td>

                    {/* ===== ACTIONS ===== */}
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          icon={Clock}
                          onClick={() => {
                            setSelectedStudent({
                              id: s.studentId,
                              name: s.fullName,
                            });
                            setOpenHistory(true);
                          }}
                        >
                          <span className="sr-only">Xem lịch sử</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {selectedStudent && (
        <FundIncomeHistoryModal
            open={openHistory}
            onClose={() => setOpenHistory(false)}
            incomeId={fundIncomeId || "undefined"} // truyền từ modal cha
            studentId={selectedStudent.id}
            studentName={selectedStudent.name}
            incomeTitle={incomeTitle} // truyền từ modal cha
          />
        )}

      </div>
    </div>
  );
}
