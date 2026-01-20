"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

const PRIMARY = "#518581";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    // TODO: call API send reset link here
    setSubmitted(true);
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
            <MailIcon />
          </div>

          <h1 className="text-sm font-semibold text-gray-900">Quên mật khẩu?</h1>
          <p className="text-xs text-gray-500 mt-1">
            Nhập email của bạn để nhận link khôi phục mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-800">
              Email <span className="text-amber-600">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email đã đăng ký"
              className={clsx(
                "mt-1 w-full h-11 rounded-lg border px-4 outline-none transition focus:ring-2",
                "border-gray-200"
              )}
              style={{ ["--tw-ring-color" as any]: `${PRIMARY}33` }}
            />
          </div>

          {/* Success message (optional) */}
          {submitted && (
            <div className="text-xs rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-800">
              Nếu email tồn tại trong hệ thống, link khôi phục đã được gửi. Vui lòng kiểm tra hộp thư.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg text-white font-medium transition"
            style={{ backgroundColor: PRIMARY }}
          >
            Gửi link khôi phục
          </button>

          {/* Back to login */}
          <div className="pt-2 flex items-center justify-center">
            <Link
              href="/login"
              className="text-sm flex items-center gap-2 hover:underline"
              style={{ color: PRIMARY }}
            >
              <ArrowLeftIcon />
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ------------ Icons ------------ */

function MailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
