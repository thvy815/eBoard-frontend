"use client";

import Pagination from "@/components/ui/Pagination";

interface ReportRow {
  date: string;
  content: string;
  type: "income" | "expense";
  amount: number;
  user: string;
  note?: string;
}

interface Props {
  data: ReportRow[];
  page: number;
  onPageChange: (p: number) => void;
}

export default function FundReportTable({
  data,
  page,
  onPageChange,
}: Props) {
  const hasData = data.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden print:overflow-visible print:shadow-none print:rounded-none">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-4 text-left">STT</th>
            <th className="text-left">Ngày tháng</th>
            <th className="text-left">Nội dung</th>
            <th className="text-center">Loại</th>
            <th className="text-center">Số tiền</th>
            <th className="text-center">Người thực hiện</th>
            <th className="text-left">Ghi chú</th>
          </tr>
        </thead>

        <tbody>
          {hasData ? (
            data.map((r, idx) => (
              <tr
                key={idx}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">{idx + 1}</td>
                <td>{r.date}</td>
                <td>{r.content}</td>
                <td className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        r.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                  >
                    {r.type === "income" ? "Thu" : "Chi"}
                  </span>
                </td>
                <td
                  className={`text-center font-medium ${
                    r.amount > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {r.amount > 0 ? "+" : ""}
                  {r.amount.toLocaleString("vi-VN")}đ
                </td>
                <td className="text-center">{r.user}</td>
                <td className="text-gray-400">{r.note || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="h-32 text-center text-gray-400 bg-gray-50"
              >
                Chưa có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

        <div className="print:hidden">
            <Pagination page={page} totalPages={1} onChange={onPageChange} />
        </div>
    </div>
  );
}
