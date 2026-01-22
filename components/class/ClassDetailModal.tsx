import type { ClassItem } from "@/types/Class";
import { ymRange } from "@/utils/date";

export default function ClassDetailModal({
  open,
  onClose,
  data,
  loading,
  error,
}: {
  open: boolean;
  onClose: () => void;
  data: ClassItem | null;
  loading: boolean;
  error: string;
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="text-lg font-semibold text-gray-900 mb-2">Chi tiết lớp học</div>

        {loading ? <div className="text-sm text-gray-500 mb-3">Đang tải chi tiết...</div> : null}

        {error ? (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        ) : null}

        <div className="text-sm text-gray-700 space-y-2">
          <div><span className="font-semibold">Tên lớp:</span> {data.name}</div>
          <div><span className="font-semibold">Khối:</span> {data.gradeLabel}</div>
          <div><span className="font-semibold">Năm học:</span> {ymRange(data.startDate, data.endDate)}</div>
          <div><span className="font-semibold">Phòng học:</span> {data.roomName}</div>
          <div><span className="font-semibold">Sĩ số:</span> {data.currentStudentCount}/{data.maxCapacity}</div>
          <div><span className="font-semibold">Mô tả:</span> {data.classDescription || "-"}</div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="h-10 px-5 rounded-lg border text-sm">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
