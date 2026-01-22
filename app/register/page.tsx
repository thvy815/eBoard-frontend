"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { authService } from "@/services/authService";

const PRIMARY = "#518581";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isPhoneValid = /^\d{10}$/.test(form.phone);
  const isPasswordMatch =
    form.password.length > 0 && form.password === form.confirmPassword;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword)
      return;
    if (!isPhoneValid || !isPasswordMatch) return;

    try {
      setSubmitting(true);

      await authService.registerTeacher({
        fullName: form.fullName.trim(),
        phoneNumber: form.phone,
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      // Đăng ký xong chuyển qua login
      router.push("/login");
    } catch (err: any) {
      setApiError(err?.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow border border-gray-200 p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: PRIMARY }}
          >
            <UserIcon />
          </div>
          <h1 className="text-sm font-semibold text-gray-900">
            Đăng ký tài khoản giáo viên
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tạo tài khoản để quản lý lớp học tiểu học của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và tên"
            name="fullName"
            placeholder="Nhập họ và tên đầy đủ"
            required
            value={form.fullName}
            onChange={handleChange}
            primary={PRIMARY}
            disabled={submitting}
          />

          <Input
            label="Số điện thoại"
            name="phone"
            placeholder="Nhập số điện thoại (10 chữ số)"
            required
            value={form.phone}
            onChange={e => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setForm(prev => ({ ...prev, phone: value }));
            }}
            error={
              form.phone.length > 0 && !isPhoneValid
                ? "Số điện thoại phải đúng 10 chữ số"
                : undefined
            }
            primary={PRIMARY}
            disabled={submitting}
          />

          <Input
            label="Email"
            name="email"
            placeholder="Nhập địa chỉ email"
            required
            value={form.email}
            onChange={handleChange}
            primary={PRIMARY}
            disabled={submitting}
          />

          <PasswordInput
            label="Mật khẩu"
            name="password"
            placeholder="Nhập mật khẩu"
            value={form.password}
            show={showPassword}
            toggle={() => setShowPassword(v => !v)}
            onChange={handleChange}
            primary={PRIMARY}
            disabled={submitting}
          />

          <PasswordInput
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            show={showConfirm}
            toggle={() => setShowConfirm(v => !v)}
            onChange={handleChange}
            error={
              form.confirmPassword.length > 0 && !isPasswordMatch
                ? "Mật khẩu xác nhận không khớp"
                : undefined
            }
            primary={PRIMARY}
            disabled={submitting}
          />

          {apiError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            className={clsx(
              "w-full h-12 rounded-lg text-white font-medium transition",
              submitting && "opacity-80"
            )}
            style={{ backgroundColor: PRIMARY }}
            disabled={submitting}
          >
            {submitting ? "Đang đăng ký..." : "Đăng ký tài khoản"}
          </button>

          <div className="text-center text-xs text-gray-500">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="hover:underline"
              style={{ color: PRIMARY }}
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ---------------- Components ---------------- */

function Input({
  label,
  error,
  required,
  primary,
  ...props
}: {
  label: string;
  error?: string;
  required?: boolean;
  primary: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm text-gray-800">
        {label} {required && <span className="text-amber-600">*</span>}
      </label>
      <input
        {...props}
        className={clsx(
          "mt-1 w-full h-11 rounded-lg border px-4 outline-none transition focus:ring-2",
          error ? "border-red-400" : "border-gray-200"
        )}
        style={{ ["--tw-ring-color" as any]: error ? "#fecaca" : `${primary}33` }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function PasswordInput({
  label,
  show,
  toggle,
  error,
  primary,
  ...props
}: {
  label: string;
  show: boolean;
  toggle: () => void;
  error?: string;
  primary: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm text-gray-800">
        {label} <span className="text-amber-600">*</span>
      </label>
      <div className="relative mt-1">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={clsx(
            "w-full h-11 rounded-lg border px-4 pr-12 outline-none transition focus:ring-2",
            error ? "border-red-400" : "border-gray-200"
          )}
          style={{ ["--tw-ring-color" as any]: error ? "#fecaca" : `${primary}33` }}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md"
          title={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          disabled={props.disabled}
        >
          <EyeIcon />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ---------------- Icons ---------------- */

function UserIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
