"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { FormField } from "../ui/FormField";
import Input from "../ui/inputType/Input";
import Textarea from "../ui/inputType/TextArea";
import Select from "../ui/inputType/Select";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SUBJECT_OPTIONS = [
  { value: "toan", label: "Toán" },
  { value: "tv", label: "Tiếng Việt" },
];

const EXAM_TYPE_OPTIONS = [
  { value: "mid", label: "Giữa kỳ" },
  { value: "final", label: "Cuối kỳ" },
];

export default function AddExamModal({ open, onClose }: Props) {
  const [subject, setSubject] = useState<string>("");
  const [examType, setExamType] = useState<string>("");
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thêm lịch thi mới"
      description="Điền thông tin chi tiết về bài thi"
    >
      <div className="space-y-4">
        {/* Môn học */}
        <FormField label="Môn học" required>
          <Select
            options={SUBJECT_OPTIONS}
            placeholder="Chọn môn học"
            value={subject}          
            onChange={setSubject}    
            allowCreate
            onCreate={(label) => {
              console.log("Tạo môn mới:", label);
              // sau này bạn gọi API + push vào options
            }}
          />
        </FormField>

        {/* Hình thức */}
        <FormField label="Hình thức thi" required>
          <Select
            options={EXAM_TYPE_OPTIONS}
            placeholder="Chọn hình thức thi"
            value={examType}
            onChange={setExamType}   
          />
        </FormField>

        {/* Ngày & giờ */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ngày thi" required>
            <Input type="date" />
          </FormField>

          <FormField label="Giờ thi" required>
            <Input type="time" />
          </FormField>
        </div>

        {/* Ghi chú */}
         <FormField label="Ghi chú">
          <Textarea rows={3} placeholder="Nhập ghi chú..." />
        </FormField>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary">
            Thêm lịch thi
          </Button>
        </div>
      </div>
    </Modal>
  );
}
