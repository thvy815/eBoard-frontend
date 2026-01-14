"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { FormField } from "../ui/FormField";
import Input from "../ui/inputType/Input";
import Textarea from "../ui/inputType/TextArea";
import Select from "../ui/inputType/Select";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: StudentPayload) => void;
}

export type StudentPayload = {
  studentName: string;
  dob: string; // yyyy-mm-dd
  province: string;
  district: string;
  ward: string;
  street: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  healthStatus?: string;
};

const PROVINCE_OPTIONS = [
  { value: "hcm", label: "TP. Hồ Chí Minh" },
  { value: "hn", label: "Hà Nội" },
  { value: "dn", label: "Đà Nẵng" },
];

const DISTRICT_OPTIONS = [
  { value: "q1", label: "Quận 1" },
  { value: "q3", label: "Quận 3" },
  { value: "td", label: "TP. Thủ Đức" },
];

const WARD_OPTIONS = [
  { value: "p1", label: "Phường 1" },
  { value: "p2", label: "Phường 2" },
  { value: "p3", label: "Phường 3" },
];

export default function AddStudentModal({ open, onClose, onSubmit }: Props) {
  const [studentName, setStudentName] = useState("");
  const [dob, setDob] = useState("");

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");

  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [healthStatus, setHealthStatus] = useState("");

  function resetForm() {
    setStudentName("");
    setDob("");
    setProvince("");
    setDistrict("");
    setWard("");
    setStreet("");
    setParentName("");
    setParentPhone("");
    setParentEmail("");
    setHealthStatus("");
  }

  function handleSubmit() {
    // validate theo dấu * trong UI
    if (!studentName.trim()) return;
    if (!dob) return;

    if (!province) return;
    if (!district) return;
    if (!ward) return;
    if (!street.trim()) return;

    if (!parentName.trim()) return;
    if (!parentPhone.trim()) return;

    const payload: StudentPayload = {
      studentName: studentName.trim(),
      dob,
      province,
      district,
      ward,
      street: street.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim() || undefined,
      healthStatus: healthStatus.trim() || undefined,
    };

    onSubmit?.(payload);
    resetForm();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Thêm học sinh mới">
      <div className="space-y-5">
        {/* Thông tin học sinh */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-900">Thông tin học sinh</div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Họ và tên học sinh" required>
              <Input
                placeholder="Nhập họ và tên"
                value={studentName}
                onChange={(e: any) => setStudentName(e.target.value)}
              />
            </FormField>

            <FormField label="Ngày sinh" required>
              <Input
                type="date"
                value={dob}
                onChange={(e: any) => setDob(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-900">Địa chỉ</div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Tỉnh/Thành phố" required>
              <Select
                options={PROVINCE_OPTIONS}
                placeholder="Chọn tỉnh/thành"
                value={province}
                onChange={(v: string) => {
                  setProvince(v);
                  // nếu sau này bạn làm lọc phụ thuộc
                  // setDistrict(""); setWard("");
                }}
              />
            </FormField>

            <FormField label="Quận/Huyện" required>
              <Select
                options={DISTRICT_OPTIONS}
                placeholder="Chọn quận/huyện"
                value={district}
                onChange={(v: string) => {
                  setDistrict(v);
                  // setWard("");
                }}
              />
            </FormField>

            <FormField label="Phường/Xã" required>
              <Select
                options={WARD_OPTIONS}
                placeholder="Chọn phường/xã"
                value={ward}
                onChange={(v: string) => setWard(v)}
              />
            </FormField>
          </div>

          <FormField label="Số nhà, tên đường" required>
            <Input
              placeholder="VD: 123 Lê Lợi"
              value={street}
              onChange={(e: any) => setStreet(e.target.value)}
            />
          </FormField>
        </div>

        {/* Thông tin phụ huynh */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-900">Thông tin phụ huynh</div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Họ và tên phụ huynh" required>
              <Input
                placeholder="Nhập họ và tên phụ huynh"
                value={parentName}
                onChange={(e: any) => setParentName(e.target.value)}
              />
            </FormField>

            <FormField label="Số điện thoại" required>
              <Input
                placeholder="Nhập số điện thoại"
                value={parentPhone}
                onChange={(e: any) =>
                  setParentPhone(String(e.target.value).replace(/\D/g, "").slice(0, 11))
                }
              />
            </FormField>

            <FormField label="Email phụ huynh">
              <Input
                placeholder="email@example.com"
                value={parentEmail}
                onChange={(e: any) => setParentEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Tình trạng sức khỏe">
              <Input
                placeholder="VD: Tốt, Khỏe mạnh"
                value={healthStatus}
                onChange={(e: any) => setHealthStatus(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => { resetForm(); onClose(); }}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Lưu thông tin
          </Button>
        </div>
      </div>
    </Modal>
  );
}
