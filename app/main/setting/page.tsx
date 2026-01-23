"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import Button from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import Input from "@/components/ui/inputType/Input";

import { teacherService } from "@/services/teacherService";
import type { TeacherInfo } from "@/types/teacher";
import { teacherSession } from "@/services/teacherSession";

const PRIMARY = "#518581";

type TeacherForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
};

function normalizeTeacherForm(x: any): TeacherForm {
  return {
    fullName: String(x?.fullName ?? "").trim(),
    email: String(x?.email ?? "").trim(),
    phoneNumber: String(x?.phoneNumber ?? "").trim(),
    qualifications: String(x?.qualifications ?? "").trim(),
  };
}

function buildMergedPayload(
  original: TeacherForm,
  current: TeacherForm,
  dirty: Record<keyof TeacherForm, boolean>
) {
  const payload: TeacherForm = { ...original };
  (Object.keys(dirty) as (keyof TeacherForm)[]).forEach((k) => {
    if (dirty[k]) payload[k] = current[k];
  });
  return payload;
}

export default function SettingsPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [edit, setEdit] = useState(false);

  const [original, setOriginal] = useState<TeacherForm | null>(null);

  const [form, setForm] = useState<TeacherForm>({
    fullName: "",
    email: "",
    phoneNumber: "",
    qualifications: "",
  });

  const [dirty, setDirty] = useState<Record<keyof TeacherForm, boolean>>({
    fullName: false,
    email: false,
    phoneNumber: false,
    qualifications: false,
  });

  // ======= Change password states =======
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState("");

  useEffect(() => {
    const id = teacherSession.getTeacherId();
    if (!id) {
      window.location.href = "/login";
      return;
    }
    setTeacherId(id);
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setLoadError("");

        const data: TeacherInfo = await teacherService.getTeacherInfo(teacherId);
        const normalized = normalizeTeacherForm(data);

        if (!mounted) return;
        setOriginal(normalized);
        setForm(normalized);
        setDirty({
          fullName: false,
          email: false,
          phoneNumber: false,
          qualifications: false,
        });
      } catch (e: any) {
        if (!mounted) return;
        setLoadError(e?.message ?? "Không tải được thông tin giáo viên.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [teacherId]);

  function setField<K extends keyof TeacherForm>(key: K, value: TeacherForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setDirty((p) => ({ ...p, [key]: true }));
  }

  const canSave = useMemo(() => {
    if (!edit) return false;
    return Object.values(dirty).some(Boolean);
  }, [dirty, edit]);

  async function handleSave() {
    if (!original) return;
    if (!canSave) return;
    if (!teacherId) return;

    try {
      setSaving(true);
      setSaveError("");

      const payload = buildMergedPayload(original, form, dirty);
      await teacherService.updateTeacherInfo(teacherId, payload);

      setOriginal(payload);
      setForm(payload);
      setDirty({
        fullName: false,
        email: false,
        phoneNumber: false,
        qualifications: false,
      });
      setEdit(false);
    } catch (e: any) {
      setSaveError(e?.message ?? "Lưu thông tin thất bại.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    if (!original) return;
    setForm(original);
    setDirty({
      fullName: false,
      email: false,
      phoneNumber: false,
      qualifications: false,
    });
    setEdit(false);
    setSaveError("");
  }

  // ======= Change password handler =======
  const canSavePassword = useMemo(() => {
    if (!teacherId) return false;
    if (!oldPassword || !newPassword || !confirmPassword) return false;
    if (newPassword !== confirmPassword) return false;
    if (newPassword.length < 6) return false; // rule mềm, BE sẽ validate lại
    return true;
  }, [teacherId, oldPassword, newPassword, confirmPassword]);

  async function handleChangePassword() {
    if (!teacherId) return;
    if (!canSavePassword) return;

    try {
      setPwSaving(true);
      setPwError("");
      setPwOk("");

      await teacherService.changePassword({
        id: teacherId,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      setPwOk("Đổi mật khẩu thành công.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      setPwError(e?.message ?? "Đổi mật khẩu thất bại.");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-7">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Thông tin tài khoản</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>

        {/* Card: Teacher Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">Thông tin cá nhân</div>
            </div>

            {!edit ? (
              <Button variant="outline" onClick={() => setEdit(true)} disabled={loading || !!loadError || !teacherId}>
                Sửa
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleCancelEdit} disabled={saving}>
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!canSave || saving}
                  className={clsx("bg-[#518581] hover:bg-[#3f6f67]", saving && "opacity-70 cursor-not-allowed")}
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            {loadError ? (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {loadError}
              </div>
            ) : null}

            {saveError ? (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {saveError}
              </div>
            ) : null}

            {loading ? <div className="text-sm text-gray-500">Đang tải thông tin...</div> : null}

            {!loading && !loadError ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Họ tên giáo viên">
                  <Input
                    value={form.fullName}
                    onChange={(e: any) => setField("fullName", e.target.value)}
                    disabled={!edit}
                    className="text-sm"
                  />
                </FormField>

                <FormField label="Trình độ chuyên môn">
                  <Input
                    value={form.qualifications}
                    onChange={(e: any) => setField("qualifications", e.target.value)}
                    disabled={!edit}
                    className="text-sm"
                  />
                </FormField>

                <FormField label="Email">
                  <Input
                    value={form.email}
                    onChange={(e: any) => setField("email", e.target.value)}
                    disabled={!edit}
                    className="text-sm"
                  />
                </FormField>

                <FormField label="SĐT">
                  <Input
                    value={form.phoneNumber}
                    onChange={(e: any) =>
                      setField("phoneNumber", String(e.target.value).replace(/\D/g, "").slice(0, 11))
                    }
                    disabled={!edit}
                    className="text-sm"
                  />
                </FormField>
              </div>
            ) : null}
          </div>
        </div>

        {/* Card: Security */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-5">
            <div className="text-lg font-semibold text-gray-900">Bảo mật</div>
            <div className="text-sm text-gray-500 mt-1">Đổi mật khẩu đăng nhập</div>
          </div>

          <div className="px-6 pb-6">
            {pwError ? (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {pwError}
              </div>
            ) : null}

            {pwOk ? (
              <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {pwOk}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Mật khẩu hiện tại">
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e: any) => {
                    setPwError("");
                    setPwOk("");
                    setOldPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  className="text-sm"
                />
              </FormField>
              <div />

              <FormField label="Mật khẩu mới">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e: any) => {
                    setPwError("");
                    setPwOk("");
                    setNewPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  className="text-sm"
                />
              </FormField>

              <FormField label="Nhập lại mật khẩu mới">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e: any) => {
                    setPwError("");
                    setPwOk("");
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  className="text-sm"
                />
              </FormField>
            </div>

            {/* inline validation */}
            {newPassword && confirmPassword && newPassword !== confirmPassword ? (
              <div className="mt-3 text-xs text-red-600">Mật khẩu mới và xác nhận mật khẩu không khớp.</div>
            ) : null}

            <div className="mt-5">
              <Button
                variant="outline"
                onClick={handleChangePassword}
                disabled={!canSavePassword || pwSaving}
                className={clsx(pwSaving && "opacity-70 cursor-not-allowed")}
              >
                {pwSaving ? "Đang lưu..." : "Lưu mật khẩu"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
