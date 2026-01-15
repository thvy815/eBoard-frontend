"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import Input from "@/components/ui/inputType/Input";
import Textarea from "@/components/ui/inputType/TextArea";
import Select from "@/components/ui/inputType/Select";

import AddStudentModal, { StudentPayload } from "@/components/class/AddStudentModal";

const PRIMARY = "#518581";
const SELECTED_CLASS_ID_KEY = "selectedClassId";
const CURRENT_TEACHER_ID_KEY = "teacherId"; // bạn đổi theo project bạn lưu teacherId lúc login

// ---- options demo (thay bằng data từ DB/API Grade sau này) ----
const GRADE_OPTIONS = [
  { value: "11111111-1111-1111-1111-111111111111", label: "Lớp 1" },
  { value: "22222222-2222-2222-2222-222222222222", label: "Lớp 2" },
  { value: "33333333-3333-3333-3333-333333333333", label: "Lớp 3" },
  { value: "44444444-4444-4444-4444-444444444444", label: "Lớp 4" },
  { value: "55555555-5555-5555-5555-555555555555", label: "Lớp 5" },
];

type CreateClassForm = {
  name: string;
  gradeId: string;
  roomName: string;

  startMonth: string; // 1..12
  startYear: string;  // 4 digits
  endMonth: string;   // 1..12
  endYear: string;    // 4 digits

  maxCapacity: string; // number string
  classDescription: string;
};

type CreatedClass = {
  id: string; // guid
  name: string;
  gradeId: string;
  teacherId: string;
  roomName: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  currentStudentCount: number;
  maxCapacity: number;
  classDescription: string;
};

function toFirstDayISO(month: string, year: string) {
  const m = String(month).padStart(2, "0");
  const y = String(year);
  return `${y}-${m}-01`;
}

function isValidMonth(m: string) {
  const n = Number(m);
  return Number.isInteger(n) && n >= 1 && n <= 12;
}

function isValidYear(y: string) {
  return /^\d{4}$/.test(y) && Number(y) >= 1900 && Number(y) <= 2100;
}

function compareYYYYMM(aY: string, aM: string, bY: string, bM: string) {
  const a = Number(aY) * 100 + Number(aM);
  const b = Number(bY) * 100 + Number(bM);
  return a - b;
}

export default function CreateClassPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateClassForm>({
    name: "",
    gradeId: "",
    roomName: "",

    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",

    maxCapacity: "",
    classDescription: "",
  });

  const [created, setCreated] = useState(false);
  const [createdClass, setCreatedClass] = useState<CreatedClass | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);

  const gradeLabel = useMemo(() => {
    const found = GRADE_OPTIONS.find((g) => g.value === form.gradeId);
    return found?.label ?? "";
  }, [form.gradeId]);

  function setField<K extends keyof CreateClassForm>(key: K, value: CreateClassForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function resetForm() {
    setForm({
      name: "",
      gradeId: "",
      roomName: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      maxCapacity: "",
      classDescription: "",
    });
  }

  function saveSelectedClassId(id: string) {
    try {
      localStorage.setItem(SELECTED_CLASS_ID_KEY, id);
    } catch {}
  }

  function getTeacherId() {
    try {
      return localStorage.getItem(CURRENT_TEACHER_ID_KEY) || "00000000-0000-0000-0000-000000000000";
    } catch {
      return "00000000-0000-0000-0000-000000000000";
    }
  }

  function fakeGuid() {
    // demo id, sau này lấy từ API
    return `cls_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function validate() {
    if (!form.name.trim()) return false;
    if (!form.gradeId) return false;
    if (!form.roomName.trim()) return false;

    if (!isValidMonth(form.startMonth) || !isValidYear(form.startYear)) return false;
    if (!isValidMonth(form.endMonth) || !isValidYear(form.endYear)) return false;

    // start <= end
    if (compareYYYYMM(form.startYear, form.startMonth, form.endYear, form.endMonth) > 0) return false;

    const max = Number(form.maxCapacity);
    if (!Number.isInteger(max) || max <= 0) return false;

    return true;
  }

  async function handleCreateClass() {
    if (!validate()) return;

    const teacherId = getTeacherId();

    // build payload theo DB
    const payload = {
      Name: form.name.trim(),
      GradeId: form.gradeId, // guid
      TeacherId: teacherId,  // guid
      RoomName: form.roomName.trim(),
      StartDate: toFirstDayISO(form.startMonth, form.startYear), // date
      EndDate: toFirstDayISO(form.endMonth, form.endYear),       // date
      CurrentStudentCount: 0,
      MaxCapacity: Number(form.maxCapacity),
      ClassDescription: form.classDescription.trim(),
    };

    // TODO: call API create class thật:
    // const res = await ClassApi.create(payload)
    // const newId = res.id

    const newId = fakeGuid();

    const createdObj: CreatedClass = {
      id: newId,
      name: payload.Name,
      gradeId: payload.GradeId,
      teacherId: payload.TeacherId,
      roomName: payload.RoomName,
      startDate: payload.StartDate,
      endDate: payload.EndDate,
      currentStudentCount: payload.CurrentStudentCount,
      maxCapacity: payload.MaxCapacity,
      classDescription: payload.ClassDescription,
    };

    setCreatedClass(createdObj);
    setCreated(true);
  }

  function handleViewClass() {
    if (!createdClass) return;
    saveSelectedClassId(createdClass.id);
    router.push("/main/class"); // route "Lớp của tôi"
  }

  return (
    <div className="w-full">
      {/* Header */}
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

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="text-sm font-semibold text-gray-900 mb-4">Thông tin lớp học</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Tên lớp học" required>
                  <Input
                    placeholder="VD: 2A3"
                    value={form.name}
                    onChange={(e: any) => setField("name", e.target.value)}
                  />
                </FormField>

                <FormField label="Khối" required>
                  <Select
                    options={GRADE_OPTIONS}
                    placeholder="Chọn khối"
                    value={form.gradeId}
                    onChange={(v: string) => setField("gradeId", v)}
                  />
                </FormField>

                <FormField label="Phòng học" required>
                  <Input
                    placeholder="VD: P14"
                    value={form.roomName}
                    onChange={(e: any) => setField("roomName", e.target.value)}
                  />
                </FormField>

                <div />

                {/* Năm học => StartDate/EndDate dạng [tháng][năm] - [tháng][năm] */}
                <div className="md:col-span-2">
                  <FormField label="Năm học" required>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="text-xs text-gray-500 mb-2">Bắt đầu</div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Tháng"
                            value={form.startMonth}
                            onChange={(e: any) =>
                              setField("startMonth", String(e.target.value).replace(/\D/g, "").slice(0, 2))
                            }
                          />
                          <Input
                            placeholder="Năm"
                            value={form.startYear}
                            onChange={(e: any) =>
                              setField("startYear", String(e.target.value).replace(/\D/g, "").slice(0, 4))
                            }
                          />
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="text-xs text-gray-500 mb-2">Kết thúc</div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Tháng"
                            value={form.endMonth}
                            onChange={(e: any) =>
                              setField("endMonth", String(e.target.value).replace(/\D/g, "").slice(0, 2))
                            }
                          />
                          <Input
                            placeholder="Năm"
                            value={form.endYear}
                            onChange={(e: any) =>
                              setField("endYear", String(e.target.value).replace(/\D/g, "").slice(0, 4))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Sĩ số tối đa" required>
                    <Input
                      placeholder="VD: 26"
                      value={form.maxCapacity}
                      onChange={(e: any) =>
                        setField("maxCapacity", String(e.target.value).replace(/\D/g, "").slice(0, 3))
                      }
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Mô tả (Tùy chọn)">
                    <Textarea
                      rows={4}
                      placeholder="Nhập mô tả về lớp học..."
                      value={form.classDescription}
                      onChange={(e: any) => setField("classDescription", e.target.value)}
                    />
                  </FormField>
                </div>
              </div>

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
          {/* Success screen */}
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

            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Tên lớp học" value={createdClass?.name || "-"} />
                <InfoItem label="Khối" value={gradeLabel || "-"} />
                <InfoItem
                  label="Năm học"
                  value={
                    createdClass
                      ? `${createdClass.startDate.slice(0, 7)} - ${createdClass.endDate.slice(0, 7)}`
                      : "-"
                  }
                />
                <InfoItem label="Phòng học" value={createdClass?.roomName || "-"} />
                <InfoItem
                  className="md:col-span-2"
                  label="Sĩ số tối đa"
                  value={createdClass ? `${createdClass.maxCapacity} học sinh` : "-"}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <Button variant="primary" className="flex-1" onClick={() => setShowAddStudent(true)}>
                Thêm học sinh vào lớp học
              </Button>

              <Button variant="outline" className="flex-1" onClick={handleViewClass}>
                Xem lớp học
              </Button>
            </div>
          </div>

          <AddStudentModal
            open={showAddStudent}
            onClose={() => setShowAddStudent(false)}
            onSubmit={(payload: StudentPayload) => {
              // TODO: add student to class createdClass?.id
              console.log("Add student payload:", payload, "classId:", createdClass?.id);
            }}
          />
        </>
      )}
    </div>
  );
}

/* ---------- small parts ---------- */

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

/* ---------- icons ---------- */

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
