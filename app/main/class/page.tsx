"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const PRIMARY = "#518581";
const SELECTED_CLASS_ID_KEY = "selectedClassId";

type ClassItem = {
  id: string;
  name: string;          // Name
  gradeLabel: string;    // UI label (ví dụ: "Khối lớp 1")
  roomName: string;      // RoomName
  startDate: string;     // StartDate yyyy-mm-dd
  endDate: string;       // EndDate yyyy-mm-dd
  currentStudentCount: number; // CurrentStudentCount
  maxCapacity: number;         // MaxCapacity
  classDescription?: string;   // ClassDescription
};

function ymRange(startDate: string, endDate: string) {
  const s = startDate?.slice(0, 7) ?? "";
  const e = endDate?.slice(0, 7) ?? "";
  return s && e ? `${s} - ${e}` : "-";
}

function percent(cur: number, max: number) {
  if (!max || max <= 0) return 0;
  const p = Math.round((cur / max) * 100);
  return Math.max(0, Math.min(100, p));
}

export default function MyClassesPage() {
  const router = useRouter();

  // demo data: bạn thay bằng API load theo teacherId sau
  const [classes] = useState<ClassItem[]>([
    {
      id: "cls_1",
      name: "Lớp 1A",
      gradeLabel: "Khối lớp 1",
      roomName: "A101",
      startDate: "2025-08-01",
      endDate: "2026-05-01",
      currentStudentCount: 28,
      maxCapacity: 30,
      classDescription: "Lớp học năng khiếu",
    },
    {
      id: "cls_2",
      name: "Lớp 2B",
      gradeLabel: "Khối lớp 2",
      roomName: "A202",
      startDate: "2024-08-01",
      endDate: "2025-05-01",
      currentStudentCount: 30,
      maxCapacity: 32,
      classDescription: "",
    },
    {
      id: "cls_3",
      name: "Lớp 3C",
      gradeLabel: "Khối lớp 3",
      roomName: "B103",
      startDate: "2023-08-01",
      endDate: "2024-05-01",
      currentStudentCount: 25,
      maxCapacity: 28,
    },
    {
      id: "cls_4",
      name: "Lớp 4A",
      gradeLabel: "Khối lớp 4",
      roomName: "B204",
      startDate: "2023-08-01",
      endDate: "2024-05-01",
      currentStudentCount: 29,
      maxCapacity: 30,
    },
    {
      id: "cls_5",
      name: "Lớp 5B",
      gradeLabel: "Khối lớp 5",
      roomName: "C105",
      startDate: "2022-08-01",
      endDate: "2023-05-01",
      currentStudentCount: 32,
      maxCapacity: 35,
    },
  ]);

  const currentClass = classes[0];
  const otherClasses = useMemo(() => classes.slice(1), [classes]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailClass, setDetailClass] = useState<ClassItem | null>(null);

  function openDetail(c: ClassItem) {
    setDetailClass(c);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailClass(null);
  }

  function saveSelectedClassId(id: string) {
    try {
      localStorage.setItem(SELECTED_CLASS_ID_KEY, id);
    } catch {}
  }

  function goManageStudents(classId: string) {
    saveSelectedClassId(classId);
    router.push("/main/student"); // đổi đúng route trang học sinh của bạn
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
       
        {/* Current class card */}
        <div className="mb-10">
          <div className="text-xs text-gray-500 mb-2">Lớp hiện tại đang dạy</div>

          <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* header */}
            <div
              className="p-4 flex items-start justify-between"
              style={{ backgroundColor: PRIMARY }}
            >
              <div className="text-white">
                <div className="font-semibold">{currentClass.name}</div>
                <div className="text-xs opacity-90">{currentClass.gradeLabel}</div>
              </div>
              <div className="w-9 h-9 bg-white rounded-full" />
            </div>

            {/* body */}
            <div className="p-4">
              <div className="text-xs text-gray-400 mb-3">
                {currentClass.classDescription ? currentClass.classDescription : " "}
              </div>

              <div className="space-y-3 text-sm">
                <Row icon={<RoomIcon />} label="Phòng học" value={currentClass.roomName} />
                <Row
                  icon={<CalendarSmallIcon />}
                  label="Năm học"
                  value={ymRange(currentClass.startDate, currentClass.endDate)}
                />
                <div>
                  <Row
                    icon={<UsersIcon />}
                    label="Sĩ số"
                    value={`${currentClass.currentStudentCount}/${currentClass.maxCapacity} học sinh`}
                  />
                  <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent(
                          currentClass.currentStudentCount,
                          currentClass.maxCapacity
                        )}%`,
                        backgroundColor: PRIMARY,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => goManageStudents(currentClass.id)}
                  className="flex-1 h-10 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Quản lý HS
                </button>
                <button
                  onClick={() => openDetail(currentClass)}
                  className="flex-1 h-10 rounded-lg text-sm font-medium border"
                  style={{ borderColor: PRIMARY, color: PRIMARY }}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other classes table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 text-sm font-semibold text-gray-900">Các lớp khác</div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Tên lớp</th>
                  <th className="text-left px-6 py-3 font-medium">Khối lớp</th>
                  <th className="text-left px-6 py-3 font-medium">Phòng học</th>
                  <th className="text-left px-6 py-3 font-medium">Năm học</th>
                  <th className="text-left px-6 py-3 font-medium">Sĩ số</th>
                  <th className="text-left px-6 py-3 font-medium">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {otherClasses.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: PRIMARY }}
                        />
                        <span className="font-medium text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{c.gradeLabel}</td>
                    <td className="px-6 py-4 text-gray-700">{c.roomName}</td>
                    <td className="px-6 py-4 text-gray-700">{ymRange(c.startDate, c.endDate)}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {c.currentStudentCount}/{c.maxCapacity}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(c)}
                          className="h-9 px-4 rounded-lg text-xs font-medium text-white"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => goManageStudents(c.id)}
                          className="h-9 px-4 rounded-lg text-xs font-medium border"
                          style={{ borderColor: PRIMARY, color: PRIMARY }}
                        >
                          Quản lý
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {otherClasses.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-gray-500" colSpan={6}>
                      Chưa có lớp nào khác.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail modal */}
        <ClassDetailModal open={detailOpen} onClose={closeDetail} data={detailClass} />
      </div>
    </div>
  );
}

/* ---------------- Modal: Chi tiết lớp ---------------- */

function ClassDetailModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ClassItem | null;
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="h-14 px-6 flex items-center justify-between" style={{ backgroundColor: PRIMARY }}>
          <div className="text-white font-semibold">Chi tiết lớp học</div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center text-white"
            title="Đóng"
          >
            <XIcon />
          </button>
        </div>

        <div className="p-8">
          {/* giống màn “tạo lớp học thành công” */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: PRIMARY }}
            >
              <CheckIcon />
            </div>
            <div className="mt-4 font-semibold text-gray-900">Thông tin lớp học</div>
            <div className="text-sm text-gray-500 mt-1">Xem chi tiết thông tin lớp đã tạo</div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Tên lớp học" value={data.name} />
              <InfoItem label="Khối" value={data.gradeLabel} />
              <InfoItem label="Năm học" value={ymRange(data.startDate, data.endDate)} />
              <InfoItem label="Phòng học" value={data.roomName} />
              <InfoItem
                className="md:col-span-2"
                label="Sĩ số"
                value={`${data.currentStudentCount}/${data.maxCapacity} học sinh`}
              />
              <InfoItem
                className="md:col-span-2"
                label="Mô tả"
                value={data.classDescription?.trim() ? data.classDescription : "-"}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="h-11 px-6 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900 mt-1">{value}</div>
    </div>
  );
}

/* ---------------- Small UI ---------------- */

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 flex items-center justify-center text-gray-400">{icon}</div>
      <div className="text-gray-500 text-xs w-20">{label}</div>
      <div className="text-gray-900 text-sm font-medium">{value}</div>
    </div>
  );
}

/* ---------------- Icons ---------------- */

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserMiniIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RoomIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 10h16v10H4V10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 10V6h10v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M8 3v2M16 3v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7h16v13H4V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 11h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-white">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
