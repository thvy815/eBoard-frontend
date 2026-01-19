"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { fundService } from "@/services/fundService";
import { Upload, Image as ImageIcon } from "lucide-react";
import { getCurrentUser } from "@/utils/auth";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string;
  onSuccess?: () => void;
}

const AMOUNT_PRESETS = [20000, 50000, 100000, 200000];

export default function AddFundExpenseModal({
  open,
  onClose,
  classId,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [expenseDate, setExpenseDate] = useState("");
  const [invoiceImgUrl, setInvoiceImgUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const currentUser = getCurrentUser();

    // fallback nếu chưa login
    const spenderName = currentUser?.fullName ?? "Giáo viên chủ nhiệm";


  /** Nếu nhập 100 → 100000 */
  const handleAmountBlur = () => {
    if (amount > 0 && amount < 1000) {
      setAmount(amount * 1000);
    }
  };

  /** Upload ảnh */
  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fundService.uploadImage(file);
      setInvoiceImgUrl(res.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || amount <= 0 || !spenderName || !expenseDate) return;

    setLoading(true);
    try {
      await fundService.createExpense(classId, {
        title,
        amount,
        spenderName,
        expenseDate, // yyyy-MM-dd
        invoiceImgUrl,
        notes,
      });

      onSuccess?.();
      onClose();

      // reset
      setTitle("");
      setAmount(0);
      setExpenseDate("");
      setInvoiceImgUrl("");
      setNotes("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Thêm khoản chi">
      <div className="space-y-4">
        {/* NỘI DUNG CHI */}
        <FormField label="Nội dung chi" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Mua đồ trang trí lớp"
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </FormField>

        {/* SỐ TIỀN */}
        <FormField label="Số tiền (VNĐ)" required>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              onBlur={handleAmountBlur}
              placeholder="Ví dụ: 100 → 100.000"
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
            />

            <select
              className="rounded-xl border px-3 py-2 text-sm"
              onChange={(e) => setAmount(Number(e.target.value))}
              value=""
            >
              <option value="" disabled>
                Chọn nhanh
              </option>
              {AMOUNT_PRESETS.map((v) => (
                <option key={v} value={v}>
                  {v.toLocaleString("vi-VN")}đ
                </option>
              ))}
            </select>
          </div>
        </FormField>

        {/* NGƯỜI CHI */}
        <FormField label="Người tạo khoản chi">
            <input
                value={spenderName}
                disabled
                className="w-full rounded-xl border bg-gray-100 px-3 py-2 text-sm"
            />
        </FormField>


        {/* NGÀY CHI */}
        <FormField label="Ngày chi" required>
          <input
            type="date"
            value={expenseDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </FormField>

        {/* ẢNH HÓA ĐƠN */}
        <FormField label="Ảnh hóa đơn">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600">
              <Upload size={16} />
              Chọn ảnh từ máy
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUploadImage}
              />
            </label>

            {uploading && (
              <p className="text-xs text-gray-500">Đang upload ảnh...</p>
            )}

            {invoiceImgUrl && (
              <div className="flex items-center gap-3 mt-2">
                <ImageIcon size={18} className="text-gray-500" />
                <img
                  src={invoiceImgUrl}
                  alt="Invoice"
                  className="h-16 rounded border"
                />
              </div>
            )}
          </div>
        </FormField>

        {/* GHI CHÚ */}
        <FormField label="Ghi chú">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú thêm..."
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </FormField>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            Thêm khoản chi
          </Button>
        </div>
      </div>
    </Modal>
  );
}
