"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import Input from "@/components/ui/inputType/Input";
import Textarea from "@/components/ui/inputType/TextArea";

// ĐỔI path này theo đúng nơi bạn đặt file AddStudentModal
import AddStudentModal, { StudentPayload } from "@/components/class/AddStudentModal";

const PRIMARY = "#518581";

// key lưu classId để các trang sau lấy
const SELECTED_CLASS_ID_KEY = "selectedClassId";

type CreateClassForm = {
  className: string;    // VD: 2A3
  grade: string;        // VD: 2
  schoolYear: string;   // VD: 2025-2026
  room: string;         // VD: P14
  maxStudents: string;  // VD: 26
  description: string;
};

export default function CreateClassPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateClassForm>({
    className: "",
    grade: "",
    schoolYear: "",
    room: "",
    maxStudents: "",
    description: "",
  });

  const [created, setCreated] = useState(false);
  const [createdClassId, setCreatedClassId] = useState<string>("");
  const [showAddStudent, setShowAddStudent] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function resetForm() {
    setForm({
      className: "",
      grade: "",
      schoolYear: "",
      room: "",
      maxStudents: "",
      description: "",
    });
  }

  function gradeDisplay() {
    const g = form.grade.trim();
    if (!g) return "";
    return g.toLowerCase().includes("lớp") ? g : `Lớp ${g}`;
  }

  function saveSelectedClassId(id: string) {
    try {
      localStorage.setItem(SELECTED_CLASS_ID_KEY, id);
    } catch {
      // ignore
    }
  }

  function fakeGenerateId() {
    // id giả lập (sau này thay bằng id trả về từ API)
    return `cls_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  async function handleCreateClass() {
    // validate theo dấu *
    if (!form.className.trim()) return;
    if (!form.grade.trim()) return;
    if (!form.schoolYear.trim()) return;
    if (!form.room.trim()) return;
    if (!form.maxStudents.trim()) return;

    // TODO: GỌI API TẠO LỚP HỌC THẬT
    // const res = await ClassApi.create(form)
    // const newId = res.id

    const newId = fakeGenerateId();

    setCreatedClassId(newId);
    setCreated(true);
  }

  function handleViewClass() {
    // lưu id lớp để các trang sau lấy
    saveSelectedClassId(createdClassId);

    // chuyển sang "Lớp của tôi" (đổi route theo project bạn)
    router.push("/main/class");
  }

  return (
    <div className="w-full">
      {/* Header giống main */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Chào mừng trở lại!</h1>
        <p className="text-gray-500">Quản lý lớp học của bạn một cách hiệu quả</p>
      </div>

      {!created ? (
        <>
          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: PRIMARY }}
            >
              <PlusIcon />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Tạo lớp học mới</h2>
              <p className="text-sm text-gray-500">Điền thông tin để tạo lớp học tiểu học</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="text-sm font-semibold text-gray-900 mb-4">Thông tin lớp học</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Tên lớp học" required>
                  <Input
                    name="className"
                    placeholder="VD: Lớp 1A"
                    value={form.className}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Khối" required>
                  <Input
                    name="grade"
                    placeholder="VD: 1"
                    value={form.grade}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Năm học" required>
                  <Input
                    name="schoolYear"
                    placeholder="VD: 2024-2025"
                    value={form.schoolYear}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Phòng học" required>
                  <Input
                    name="room"
                    placeholder="VD: A101"
                    value={form.room}
                    onChange={handleChange}
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Sĩ số tối đa" required>
                    <Input
                      name="maxStudents"
                      placeholder="VD: 30"
                      value={form.maxStudents}
                      onChange={(e: any) => {
                        const onlyNumber = String(e.target.value).replace(/\D/g, "");
                        setForm((p) => ({ ...p, maxStudents: onlyNumber }));
                      }}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Mô tả (Tùy chọn)">
                    <Textarea
                      name="description"
                      rows={4}
                      placeholder="Nhập mô tả về lớp học..."
                      value={form.description}
                      onChange={handleChange}
                    />
                  </FormField>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <Button variant="primary" className="flex-1" onClick={handleCreateClass}>
                  + Tạo lớp học
                </Button>

                <Button variant="outline" onClick={resetForm}>
                  Đặt lại
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* SUCCESS SCREEN */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: PRIMARY }}
              >
                <CheckIcon />
              </div>

              <div className="mt-4 font-semibold text-gray-900">Tạo lớp học thành công!</div>
              <div className="text-sm text-gray-500 mt-1">
                Lớp học đã được tạo và sẵn sàng để sử dụng
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Tên lớp học" value={form.className || "-"} />
                <InfoItem label="Khối" value={gradeDisplay() || "-"} />
                <InfoItem label="Năm học" value={form.schoolYear || "-"} />
                <InfoItem label="Phòng học" value={form.room || "-"} />
                <InfoItem
                  className="md:col-span-2"
                  label="Sĩ số tối đa"
                  value={form.maxStudents ? `${form.maxStudents} học sinh` : "-"}
                />

                {/* (optional) show classId để debug */}
                <div className="md:col-span-2 text-xs text-gray-400">
                  Class ID: <span className="font-mono">{createdClassId}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <Button variant="primary" className="flex-1" onClick={() => setShowAddStudent(true)}>
                Thêm học sinh vào lớp học
              </Button>

              <Button
                variant="outline"
                className={clsx("flex-1", "border-[1.5px]")}
                onClick={handleViewClass}
              >
                Xem lớp học
              </Button>
            </div>
          </div>

          {/* Popup thêm học sinh */}
          <AddStudentModal
            open={showAddStudent}
            onClose={() => setShowAddStudent(false)}
            onSubmit={(payload: StudentPayload) => {
              // TODO: gọi API add student vào lớp createdClassId
              // StudentApi.addToClass(createdClassId, payload)
              console.log("Add student to class:", createdClassId, payload);
            }}
          />
        </>
      )}
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

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

/* ---------------- Icons ---------------- */

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
