"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { authService } from "@/services/authService";

const PRIMARY = "#518581";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập email.");
      return;
    }

    try {
      setIsLoading(true);

      await authService.forgotPassword({ email: email.trim() });

      // ✅ luôn show message như BE: "Nếu email tồn tại..."
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Gửi mail thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
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
            <MailIcon />
          </div>

          <h1 className="text-sm font-semibold text-gray-900">Quên mật khẩu?</h1>
          <p className="text-xs text-gray-500 mt-1">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error */}
          {errorMsg ? (
            <div className="text-xs rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMsg}
            </div>
          ) : null}

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
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* Success message */}
          {submitted && (
            <div className="text-xs rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-800">
              Nếu email tồn tại trong hệ thống, link đặt lại mật khẩu đã được gửi.
              Vui lòng kiểm tra hộp thư (cả Spam). Link có thể có thời hạn.
            </div>
          )}

          <button
            type="submit"
            className={clsx(
              "w-full h-12 rounded-lg text-white font-medium transition",
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-95"
            )}
            style={{ backgroundColor: PRIMARY }}
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
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
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
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
