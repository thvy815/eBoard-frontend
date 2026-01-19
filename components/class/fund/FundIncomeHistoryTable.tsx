"use client";

interface HistoryItem {
  id: string;
  content: string;
  amount: number;
  contributedAt: string;
  notes?: string;
}

export default function FundIncomeHistoryTable({
  data,
}: {
  data: HistoryItem[];
}) {
  const total = data.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th className="px-4 py-3 text-left">STT</th>
            <th className="px-4 py-3 text-left">Nội dung đóng</th>
            <th className="px-4 py-3 text-right">Số tiền</th>
            <th className="px-4 py-3 text-center">Ngày đóng</th>
            <th className="px-4 py-3 text-left">Ghi chú</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-8 text-center text-gray-500"
              >
                Chưa có lịch sử đóng tiền
              </td>
            </tr>
          ) : (
            data.map((i, idx) => (
              <tr key={i.id} className="border-t">
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{i.content}</td>
                <td className="px-4 py-3 text-right text-[#518581] font-medium">
                  {i.amount.toLocaleString()}đ
                </td>
                <td className="px-4 py-3 text-center">
                  {i.contributedAt}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {i.notes || "-"}
                </td>
              </tr>
            ))
          )}

          {/* ===== TOTAL ===== */}
          {data.length > 0 && (
            <tr className="bg-[#F1F7F3] border-t">
              <td colSpan={2} className="px-4 py-4 font-semibold text-center">
                Tổng cộng:
              </td>
              <td className="px-4 py-4 text-right font-semibold text-[#518581]">
                {total.toLocaleString()}đ
              </td>
              <td colSpan={2} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
