"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { fundService } from "@/services/fundService";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string;
  onSuccess?: () => void;
}

const AMOUNT_PRESETS = [20000, 50000, 100000];

export default function AddFundIncomeModal({
  open,
  onClose,
  classId,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  /** Nếu người dùng nhập 100 → 100000 */
  const handleAmountBlur = () => {
    if (amount > 0 && amount < 1000) {
      setAmount(amount * 1000);
    }
  };

  const handleSubmit = async () => {
    if (!title || amount <= 0 || !endDate) return;

    setLoading(true);
    try {
      await fundService.createIncome(classId, {
        title,
        amountPerStudent: amount,
        endDate, // yyyy-MM-dd → BE DateOnly OK
        description,
      });

      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo khoản thu mới">
      <div className="space-y-4">
        {/* TIÊU ĐỀ */}
        <FormField label="Nội dung thu" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Quỹ lớp học kỳ 1"
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </FormField>

        {/* SỐ TIỀN */}
        <FormField label="Số tiền / học sinh (VNĐ)" required>
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

        {/* HẠN ĐÓNG */}
        <FormField label="Hạn đóng" required>
          <input
            type="date"
            value={endDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </FormField>

        {/* MÔ TẢ */}
        <FormField label="Mô tả chi tiết">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết về khoản thu..."
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </FormField>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            Tạo khoản thu
          </Button>
        </div>
      </div>
    </Modal>
  );
}
