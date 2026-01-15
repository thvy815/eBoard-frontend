"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import type { StudentRow } from "@/types/student";

const PRIMARY = "#518581";

type Props = {
  open: boolean;
  student: StudentRow | null;
  onClose: () => void;
  onSave: (updated: StudentRow) => void;
};

export default function StudentDetailModal({ open, student, onClose, onSave }: Props) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<StudentRow | null>(null);

  useEffect(() => {
    setEdit(false);
    setForm(student ? { ...student } : null);
  }, [student, open]);

  const canSave = useMemo(() => {
    if (!form) return false;
    return form.fullName.trim() && form.parentName.trim() && /^\d{10}$/.test(form.phone);
  }, [form]);

  if (!open || !student || !form) return null;

  function setField<K extends keyof StudentRow>(key: K, value: StudentRow[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: PRIMARY }}>
          <div className="text-white font-semibold">Thông tin chi tiết</div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center text-white"
            title="Đóng"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Section: Student */}
          <Section
            icon={<UserIcon />}
            iconBg="bg-emerald-50 text-emerald-700"
            title="Thông tin học sinh"
          >
            <TwoCol
              label1="Họ và tên"
              value1={
                edit ? (
                  <Input value={form.fullName} onChange={(v) => setField("fullName", v)} />
                ) : (
                  <TextValue value={student.fullName} />
                )
              }
              label2="Ngày sinh"
              value2={
                edit ? (
                  <Input value={form.dob} onChange={(v) => setField("dob", v)} placeholder="dd/mm/yyyy" />
                ) : (
                  <TextValue value={student.dob} />
                )
              }
            />

            <OneCol
              label="Địa chỉ"
              value={
                edit ? (
                  <Input value={form.address} onChange={(v) => setField("address", v)} />
                ) : (
                  <TextValue value={student.address} />
                )
              }
            />
          </Section>

          {/* Section: Parent */}
          <Section
            icon={<ParentIcon />}
            iconBg="bg-amber-50 text-amber-700"
            title="Thông tin phụ huynh"
          >
            <TwoCol
              label1="Họ và tên"
              value1={
                edit ? (
                  <Input value={form.parentName} onChange={(v) => setField("parentName", v)} />
                ) : (
                  <TextValue value={student.parentName} />
                )
              }
              label2="Số điện thoại"
              value2={
                edit ? (
                  <Input
                    value={form.phone}
                    onChange={(v) => setField("phone", v.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10 chữ số"
                    error={form.phone && !/^\d{10}$/.test(form.phone) ? "SĐT phải đúng 10 chữ số" : undefined}
                  />
                ) : (
                  <TextValue value={student.phone} badge />
                )
              }
            />

            <OneCol
              label="Email"
              value={
                edit ? (
                  <Input value={form.email} onChange={(v) => setField("email", v)} />
                ) : (
                  <TextValue value={student.email} />
                )
              }
            />
          </Section>

          {/* Section: Account */}
          <Section
            icon={<KeyIcon />}
            iconBg="bg-indigo-50 text-indigo-700"
            title="Thông tin tài khoản"
          >
            <TwoCol
              label1="Tên đăng nhập"
              value1={<TextValue value={form.phone} badge />}
              label2="Mật khẩu"
              value2={
                edit ? (
                  <Input value={form.password} onChange={(v) => setField("password", v)} />
                ) : (
                  <TextValue value={student.password} badge />
                )
              }
            />
          </Section>

          {/* actions */}
          <div className="pt-2 flex gap-3">
            {!edit ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl text-white font-medium shadow-sm"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={() => setEdit(true)}
                  className="h-12 px-5 rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-50"
                >
                  Chỉnh sửa
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEdit(false);
                    setForm({ ...student });
                  }}
                  className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-50"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  disabled={!canSave}
                  onClick={() => {
                    if (!form) return;
                    onSave(form);
                    setEdit(false);
                    onClose();
                  }}
                  className={clsx("flex-1 h-12 rounded-xl text-white font-medium shadow-sm", !canSave && "opacity-60")}
                  style={{ backgroundColor: PRIMARY }}
                >
                  Lưu thay đổi
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Section({
  icon,
  iconBg,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center", iconBg)}>{icon}</div>
        <div className="font-semibold text-gray-900">{title}</div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TwoCol({
  label1,
  value1,
  label2,
  value2,
}: {
  label1: string;
  value1: React.ReactNode;
  label2: string;
  value2: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label={label1}>{value1}</Field>
      <Field label={label2}>{value2}</Field>
    </div>
  );
}

function OneCol({ label, value }: { label: string; value: React.ReactNode }) {
  return <Field label={label}>{value}</Field>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      {children}
    </div>
  );
}

function TextValue({ value, badge }: { value: string; badge?: boolean }) {
  if (badge) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
        {value || "-"}
      </span>
    );
  }
  return <div className="text-sm text-gray-800">{value || "-"}</div>;
}

function Input({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          "w-full h-10 rounded-lg border px-3 outline-none focus:ring-2",
          error ? "border-red-300" : "border-gray-200"
        )}
        style={{ ["--tw-ring-color" as any]: `${PRIMARY}33` }}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
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
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ParentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 22c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 2l-2 2m-3 3-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 14a4 4 0 1 1 5.657-5.657A4 4 0 0 1 7 14Z" stroke="currentColor" strokeWidth="2" />
      <path d="M10 12l3 3 2-2 2 2 2-2-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
