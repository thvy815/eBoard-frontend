"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import ExportListModal from "@/components/student/ExportListModal";
import ImportStudentsModal from "@/components/student/ImportStudentModal";
import ConfirmParentsModal from "@/components/student/ConfirmParentsModal";
import StudentDetailModal from "@/components/student/StudentDetailModal";
import ParentTicketModal from "@/components/student/ParentTicketModal";
import DeleteConfirmModal from "@/components/student/DeleteConfirmModal";
import type { StudentRow, ImportedStudent } from "@/types/student";

const PRIMARY = "#518581";

// Demo: đọc classId / className từ localStorage (bạn lưu ở CreateClass / MyClass)
function getSelectedClass() {
  if (typeof window === "undefined") return { classId: "", className: "Lớp" };
  const classId = localStorage.getItem("selectedClassId") || "";
  const className = localStorage.getItem("selectedClassName") || "Lớp";
  return { classId, className };
}

export default function StudentsPage() {
  const { className } = getSelectedClass();

  // --------- Demo data (sau này bạn load API theo classId) ----------
  const [students, setStudents] = useState<StudentRow[]>([
    {
      id: "1",
      fullName: "Nguyễn Văn An",
      dob: "15/03/2018",
      address: "123 Lê Lợi, Quận 1, TP. HCM",
      parentName: "Nguyễn Văn Bình",
      email: "nvbinh@gmail.com",
      phone: "0912345678",
      password: "aB3xY9",
    },
    {
      id: "2",
      fullName: "Trần Thị Bảo",
      dob: "22/07/2018",
      address: "456 Nguyễn Huệ, Quận 3, TP. HCM",
      parentName: "Trần Văn Cường",
      email: "tvcuong@gmail.com",
      phone: "0987654321",
      password: "zK8mN4",
    },
  ]);

  const [q, setQ] = useState("");

  // modals
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [imported, setImported] = useState<ImportedStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return students;
    return students.filter((s) => {
      return (
        s.fullName.toLowerCase().includes(keyword) ||
        s.parentName.toLowerCase().includes(keyword) ||
        s.phone.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        s.address.toLowerCase().includes(keyword)
      );
    });
  }, [students, q]);

  // số lượng (demo)
  const gradeLabel = "Khối lớp 1";
  const totalLabel = `Tổng số học sinh: ${students.length}`;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Quản lý học sinh - {className}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {gradeLabel} • {totalLabel}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="h-10 px-4 rounded-xl text-white font-medium shadow-sm flex items-center gap-2"
              style={{ backgroundColor: "#f59e0b" }}
            >
              <UploadIcon />
              Import Excel
            </button>

            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="h-10 px-4 rounded-xl border border-emerald-300 text-emerald-800 bg-white font-medium shadow-sm flex items-center gap-2"
            >
              <DownloadIcon />
              Xuất danh sách
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm học sinh theo tên, phụ huynh, SĐT..."
              className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as any]: `${PRIMARY}33` }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr style={{ backgroundColor: PRIMARY }} className="text-white">
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[70px]">STT</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[170px]">Họ và tên HS</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[130px]">Ngày sinh</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[240px]">Địa chỉ</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[170px]">Họ và tên PHHS</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[190px]">Email</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[160px]">SĐT / Tên đăng nhập</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[120px]">Mật khẩu</th>
                  <th className="text-left text-xs font-semibold px-5 py-4 w-[130px]">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-sm text-gray-500 py-10">
                      Không có học sinh nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filtered.map((st, idx) => (
                    <tr key={st.id} className="border-t border-gray-100">
                      <td className="px-5 py-5 text-sm text-gray-700">{idx + 1}</td>

                      <td className="px-5 py-5 text-sm text-gray-800 font-medium">
                        {st.fullName}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-700">{st.dob}</td>

                      <td className="px-5 py-5 text-sm text-gray-700">
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]" title={st.address}>
                          {st.address}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-700">{st.parentName}</td>

                      <td className="px-5 py-5 text-sm text-gray-700">
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]" title={st.email}>
                          {st.email}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                          {st.phone}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {st.password}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          {/* XÓA */}
                          <IconBtn
                            title="Xóa"
                            tone="danger"
                            onClick={() => {
                              setSelectedStudent(st);
                              setDeleteOpen(true);
                            }}
                          >
                            <TrashIcon />
                          </IconBtn>

                          {/* CHI TIẾT / SỬA */}
                          <IconBtn
                            title="Chi tiết"
                            tone="warn"
                            onClick={() => {
                              setSelectedStudent(st);
                              setDetailOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconBtn>

                          {/* PHIẾU TÀI KHOẢN */}
                          <IconBtn
                            title="Phiếu tài khoản"
                            tone="info"
                            onClick={() => {
                              setSelectedStudent(st);
                              setTicketOpen(true);
                            }}
                          >
                            <DocIcon />
                          </IconBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export */}
      <ExportListModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        students={students}
      />

      {/* Import */}
      <ImportStudentsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={(rows) => {
          setImported(rows);
          setImportOpen(false);
          setConfirmOpen(true);
        }}
      />

      {/* Confirm Parents */}
      <ConfirmParentsModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        students={imported}
        onConfirm={(selected) => {
          // demo: merge vào bảng
          const mapped: StudentRow[] = selected.map((s, i) => ({
            id: `imp-${Date.now()}-${i}`,
            fullName: s.fullName,
            dob: s.dob,
            address: s.address,
            parentName: s.parentName,
            email: s.email,
            phone: s.phone,
            password: s.password,
          }));
          setStudents((prev) => [...prev, ...mapped]);
        }}
      />

      {/* Detail / Edit */}
      <StudentDetailModal
        open={detailOpen}
        student={selectedStudent}
        onClose={() => setDetailOpen(false)}
        onSave={(updated) => {
          setStudents((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        }}
      />

      {/* Ticket */}
      <ParentTicketModal
        open={ticketOpen}
        student={selectedStudent}
        onClose={() => setTicketOpen(false)}
      />

      {/* Delete confirm */}
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (!selectedStudent) return;
          setStudents((prev) => prev.filter((x) => x.id !== selectedStudent.id));
        }}
      />
    </main>
  );
}

/* ---------------- Small components ---------------- */

function IconBtn({
  children,
  title,
  tone = "neutral",
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  tone?: "neutral" | "warn" | "info" | "danger";
  onClick?: () => void;
}) {
  const styles =
    tone === "danger"
      ? "bg-red-50 text-red-600 hover:bg-red-100"
      : tone === "warn"
      ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
      : tone === "info"
      ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100";

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={clsx(
        "w-9 h-9 rounded-lg flex items-center justify-center transition",
        styles
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- Icons ---------------- */

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v12m0-12 4 4m-4-4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 17v3h16v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 17v3h16v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M14 3v3h3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 12h8M8 16h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6l1 16h10l1-16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
