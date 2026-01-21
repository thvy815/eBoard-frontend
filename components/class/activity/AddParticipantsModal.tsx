"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/inputType/Input";
import { X } from "lucide-react";
import { StudentOptionDto } from "@/services/studentService";

interface Student {
  id: string;
  fullName: string;
  parentPhone: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  students: StudentOptionDto[]; 
  onSubmit: (data: {
    studentId: string;
    note?: string;
    comment?: string;
    parentPhone: string;
  }[]) => void;
}

export default function AddParticipantsModal({
  open,
  onClose,
  students,
  onSubmit,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [comment, setComment] = useState("");

  if (!open) return null;

  const selectedStudents = students.filter(s =>
    selectedIds.includes(s.id)
  );

  const handleSubmit = () => {
    const payload = selectedStudents.map(s => ({
      studentId: s.id,
      parentPhone: "",
      note,
      comment,
    }));

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[700px] max-h-[90vh] rounded-2xl shadow-lg overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Thêm học sinh tham gia</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* CHỌN HỌC SINH */}
          <div>
            <label className="text-sm font-medium">
              Học sinh <span className="text-red-500">*</span>
            </label>

            <select
              multiple
              value={selectedIds}
              onChange={e =>
                setSelectedIds(
                  Array.from(e.target.selectedOptions, o => o.value)
                )
              }
              className="
                w-full rounded-xl border px-3 py-2 text-sm min-h-[120px]
                focus:outline-none focus:ring-2 focus:ring-[#518581]/40
              "
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500 mt-1">
              Có thể chọn nhiều học sinh
            </p>
          </div>

          {/* HIỂN THỊ SĐT TỰ ĐỘNG
          {selectedStudents.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="font-medium mb-2">SĐT phụ huynh</p>
              <ul className="space-y-1">
                {selectedStudents.map(s => (
                  <li key={s.id} className="flex justify-between">
                    <span>{s.fullName}</span>
                    <span className="font-medium">
                      {s.parentPhone}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          {/* NHẬN XÉT */}
          <div>
            <label className="text-sm font-medium">Nhận xét</label>
            <Input
              placeholder="Nhận xét về học sinh"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>

          {/* GHI CHÚ */}
          <div>
            <label className="text-sm font-medium">Ghi chú</label>
            <Input
              placeholder="Ghi chú thêm"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex gap-3">
          <Button
            variant="primary"
            className="flex-1 flex justify-center"
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
          >
            Thêm vào danh sách
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex justify-center"
            onClick={onClose}
          >
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
}
