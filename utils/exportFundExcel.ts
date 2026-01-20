import * as XLSX from "xlsx";
import { FundIncome, FundExpense } from "@/types/fund";

/* ===== BORDER ===== */
const allBorder = {
  top: { style: "thin" },
  bottom: { style: "thin" },
  left: { style: "thin" },
  right: { style: "thin" },
};

interface ExportFundMeta {
  className: string;
  schoolYear?: string;
}

/* ===================================================== */
/* ================== EXPORT KHOẢN THU ================= */
/* ===================================================== */
export function exportFundIncomeExcel(
  incomes: FundIncome[],
  meta: ExportFundMeta
) {
  if (!incomes || incomes.length === 0) return;

  const titleRow = [`DANH SÁCH KHOẢN THU - LỚP ${meta.className}`];
  const yearRow = meta.schoolYear ? [`Năm học: ${meta.schoolYear}`] : [""];
  const emptyRow: never[] = [];

  const headerRow = [
    "STT",
    "Nội dung thu",
    "Số tiền cần thu",
    "Số tiền đã thu",
    "Bắt đầu",
    "Kết thúc",
    "Trạng thái",
  ];

  const bodyRows = incomes.map((i, index) => [
    index + 1,
    i.title,
    i.expectedAmount,
    i.collectedAmount,
    i.startDate,
    i.endDate,
    i.status,
  ]);

  const sheetData = [titleRow, yearRow, emptyRow, headerRow, ...bodyRows];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  /* MERGE TITLE */
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
  ];

  /* TITLE STYLE */
  ["A1", "A2"].forEach((cellRef, idx) => {
    const cell = ws[cellRef];
    if (!cell) return;
    cell.s = {
      font: { bold: idx === 0, sz: idx === 0 ? 16 : 12 },
      alignment: { horizontal: "center", vertical: "center" },
    };
  });

  /* HEADER STYLE */
  const headerRowIndex = 3;
  ["A", "B", "C", "D", "E", "F", "G"].forEach((col) => {
    const cell = ws[`${col}${headerRowIndex + 1}`];
    if (!cell) return;
    cell.s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: allBorder,
    };
  });

  /* BODY STYLE */
  const startBodyRow = headerRowIndex + 2;
  const endBodyRow = startBodyRow + bodyRows.length - 1;

  for (let r = startBodyRow; r <= endBodyRow; r++) {
    ["A", "B", "C", "D", "E", "F", "G"].forEach((col, idx) => {
      const cell = ws[`${col}${r}`];
      if (!cell) return;
      cell.s = {
        alignment: {
          horizontal: idx === 1 ? "left" : "center",
          vertical: "center",
        },
        border: allBorder,
      };
    });
  }

  ws["!cols"] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "KhoanThu");
  XLSX.writeFile(wb, `Khoan_thu_${meta.className}.xlsx`);
}

/* ===================================================== */
/* ================== EXPORT KHOẢN CHI ================= */
/* ===================================================== */
export function exportFundExpenseExcel(
  expenses: FundExpense[],
  meta: ExportFundMeta
) {
  if (!expenses || expenses.length === 0) return;

  const titleRow = [`DANH SÁCH KHOẢN CHI - LỚP ${meta.className}`];
  const yearRow = meta.schoolYear ? [`Năm học: ${meta.schoolYear}`] : [""];
  const emptyRow: never[] = [];

  const headerRow = [
    "STT",
    "Nội dung chi",
    "Số tiền (VNĐ)",
    "Người chi",
    "Ngày chi",
  ];

  const bodyRows = expenses.map((e, index) => [
    index + 1,
    e.title,
    e.amount,
    e.spenderName,
    e.expenseDate,
  ]);

  const sheetData = [titleRow, yearRow, emptyRow, headerRow, ...bodyRows];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
  ];

  ["A1", "A2"].forEach((cellRef, idx) => {
    const cell = ws[cellRef];
    if (!cell) return;
    cell.s = {
      font: { bold: idx === 0, sz: idx === 0 ? 16 : 12 },
      alignment: { horizontal: "center", vertical: "center" },
    };
  });

  const headerRowIndex = 3;
  ["A", "B", "C", "D", "E"].forEach((col) => {
    const cell = ws[`${col}${headerRowIndex + 1}`];
    if (!cell) return;
    cell.s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: allBorder,
    };
  });

  const startBodyRow = headerRowIndex + 2;
  const endBodyRow = startBodyRow + bodyRows.length - 1;

  for (let r = startBodyRow; r <= endBodyRow; r++) {
    ["A", "B", "C", "D", "E"].forEach((col, idx) => {
      const cell = ws[`${col}${r}`];
      if (!cell) return;
      cell.s = {
        alignment: {
          horizontal: idx === 1 || idx === 3 ? "left" : "center",
          vertical: "center",
        },
        border: allBorder,
      };
    });
  }

  ws["!cols"] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 18 },
    { wch: 20 },
    { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "KhoanChi");
  XLSX.writeFile(wb, `Khoan_chi_${meta.className}.xlsx`);
}

/* ===================================================== */
/* ============ EXPORT BÁO CÁO THU - CHI ================ */
/* ===================================================== */
export function exportFundReportExcel(
  incomes: FundIncome[],
  expenses: FundExpense[],
  meta: ExportFundMeta & { reporter?: string }
) {
  const rows: any[] = [];

  incomes.forEach((i) => {
    rows.push({
      date: i.startDate,
      content: i.title,
      type: "Thu",
      amount: i.collectedAmount,
      user: meta.reporter ?? "",
      note: "",
    });
  });

  expenses.forEach((e) => {
    rows.push({
      date: e.expenseDate,
      content: e.title,
      type: "Chi",
      amount: -e.amount,
      user: e.spenderName,
      note: e.notes ?? "",
    });
  });

  if (rows.length === 0) return;

  /* ===== TITLE ===== */
  const titleRow = [`BÁO CÁO THU - CHI QUỸ LỚP ${meta.className}`];
  const yearRow = meta.schoolYear ? [`Năm học: ${meta.schoolYear}`] : [""];
  const reporterRow = meta.reporter ? [`Người lập báo cáo: ${meta.reporter}`] : [""];
  const emptyRow: never[] = [];

  const headerRow = [
    "STT",
    "Ngày",
    "Nội dung",
    "Loại giao dịch",
    "Số tiền (VNĐ)",
    "Người thực hiện",
    "Ghi chú",
  ];

  const bodyRows = rows.map((r, index) => [
    index + 1,
    r.date,
    r.content,
    r.type,
    r.amount,
    r.user,
    r.note,
  ]);

  const total = rows.reduce((s, r) => s + r.amount, 0);

  const totalRow = [
    "",
    "",
    "",
    "Tổng cộng",
    total,
    "",
    "",
  ];

  const sheetData = [
    titleRow,
    yearRow,
    reporterRow,
    emptyRow,
    headerRow,
    ...bodyRows,
    totalRow,
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  /* ===== MERGE TITLE ===== */
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
  ];

  /* ===== TITLE STYLE ===== */
  ["A1", "A2", "A3"].forEach((cellRef, idx) => {
    const cell = ws[cellRef];
    if (!cell) return;
    cell.s = {
      font: { bold: idx === 0, sz: idx === 0 ? 16 : 12 },
      alignment: { horizontal: "center", vertical: "center" },
    };
  });

  /* ===== HEADER STYLE ===== */
  const headerRowIndex = 4;
  ["A", "B", "C", "D", "E", "F", "G"].forEach((col) => {
    const cell = ws[`${col}${headerRowIndex + 1}`];
    if (!cell) return;
    cell.s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: allBorder,
    };
  });

  /* ===== BODY STYLE ===== */
  const startBodyRow = headerRowIndex + 2;
  const endBodyRow = startBodyRow + bodyRows.length;

  for (let r = startBodyRow; r <= endBodyRow; r++) {
    ["A", "B", "C", "D", "E", "F", "G"].forEach((col, idx) => {
      const cell = ws[`${col}${r}`];
      if (!cell) return;
      cell.s = {
        alignment: {
          horizontal: idx === 2 || idx === 6 ? "left" : "center",
          vertical: "center",
        },
        border: allBorder,
      };
    });
  }

  /* ===== TOTAL ROW STYLE ===== */
  const totalRowIndex = endBodyRow + 1;
  ["D", "E"].forEach((col) => {
    const cell = ws[`${col}${totalRowIndex}`];
    if (!cell) return;
    cell.s = {
      font: { bold: true },
      alignment: { horizontal: "center" },
      border: allBorder,
    };
  });

  ws["!cols"] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 36 },
    { wch: 16 },
    { wch: 18 },
    { wch: 20 },
    { wch: 28 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BaoCaoThuChi");
  XLSX.writeFile(wb, `Bao_cao_thu_chi_${meta.className}.xlsx`);
}
