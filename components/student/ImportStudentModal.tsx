"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import * as XLSX from "xlsx";
import type { ImportedStudent } from "@/types/student";

const PRIMARY = "#518581";


type Props = {
  open: boolean;
  onClose: () => void;
  onImported: (rows: ImportedStudent[]) => void;
};

function normalizeHeader(h: string) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[._-]/g, " ");
}

function getCell(row: any, keys: string[]) {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== "") return String(row[k]).trim();
  }
  return "";
}

function randomPass(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function ImportStudentsModal({ open, onClose, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function parseFile(file: File) {
    setError(null);

    if (!file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
      setError("Chỉ hỗ trợ file .xlsx hoặc .xls");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File quá lớn (tối đa 10MB)");
      return;
    }

    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

    // map header linh hoạt (VN/EN)
    // Người dùng nhập theo mẫu mình phát, nên chỉ cần cover vài biến thể
    const rows: ImportedStudent[] = raw.map((r, idx) => {
      // build a normalized-key object
      const norm: Record<string, any> = {};
      Object.keys(r).forEach((k) => {
        norm[normalizeHeader(k)] = r[k];
      });

      const fullName = getCell(norm, ["họ và tên", "ho va ten", "full name", "fullname", "student name", "ten hoc sinh"]);
      const dob = getCell(norm, ["ngày sinh", "ngay sinh", "dob", "date of birth"]);
      const address = getCell(norm, ["địa chỉ", "dia chi", "address"]);
      const parentName = getCell(norm, ["họ tên phụ huynh", "ho ten phu huynh", "parent name", "guardian name"]);
      const email = getCell(norm, ["email", "email phụ huynh", "parent email"]);
      const phone = getCell(norm, ["sđt", "so dien thoai", "phone", "parent phone", "sdt phụ huynh", "sdt ph"]);

      return {
        id: `imp_${Date.now()}_${idx}`,
        fullName: fullName || "",
        dob: dob || "",
        address: address || "",
        parentName: parentName || "",
        email: email || "",
        phone: (phone || "").replace(/\D/g, "").slice(0, 10),
        password: randomPass(6),
      };
    });

    const cleaned = rows.filter((x) => x.fullName.trim() !== "");
    if (cleaned.length === 0) {
      setError("Không đọc được dữ liệu. Vui lòng kiểm tra file theo đúng mẫu.");
      return;
    }

    onImported(cleaned);
    onClose();
  }

  function handleDownloadTemplate() {
    const wb = XLSX.utils.book_new();
    const rows = [
      {
        "Họ và tên": "Nguyễn Văn An",
        "Ngày sinh": "15/03/2018",
        "Địa chỉ": "123 Lê Lợi, Quận 1, TP.HCM",
        "Họ tên phụ huynh": "Nguyễn Văn Bình",
        "Email": "nvbinh@gmail.com",
        "SĐT": "0912345678",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 22 },
      { wch: 14 },
      { wch: 38 },
      { wch: 22 },
      { wch: 24 },
      { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "MauImport");
    XLSX.writeFile(wb, "Mau_Import_DanhSachHocSinh.xlsx");
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 flex items-start justify-between">
          <div>
            <div className="text-xl font-semibold text-gray-900">Import danh sách học sinh</div>
            <div className="text-sm text-gray-500 mt-1">Tải lên file Excel chứa danh sách học sinh</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center"
            title="Đóng"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* download template */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: PRIMARY }}>
              <DownloadIcon />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Tải xuống file mẫu</div>
              <div className="text-sm text-gray-600 mt-1">
                Tải file Excel mẫu để nhập thông tin học sinh đúng định dạng
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="mt-3 h-10 px-4 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: PRIMARY }}
              >
                Tải file mẫu
              </button>
            </div>
          </div>

          {/* upload box */}
          <div
            className={clsx(
              "mt-6 rounded-2xl border border-gray-200 bg-white p-10 flex flex-col items-center justify-center text-center",
              dragOver && "border-emerald-300 bg-emerald-50"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
              <UploadIcon />
            </div>
            <div className="mt-4 text-gray-900 font-medium">Kéo thả file Excel vào đây</div>
            <div className="text-gray-400 text-sm mt-1">hoặc</div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-3 h-11 px-6 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: PRIMARY }}
            >
              Chọn file
            </button>

            <div className="text-xs text-gray-400 mt-3">
              Hỗ trợ định dạng: .xlsx, .xls (Tối đa 10MB)
            </div>

            {error && <div className="mt-3 text-sm text-red-500">{error}</div>}

            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) parseFile(f);
                e.currentTarget.value = "";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* icons */
function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 9l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
