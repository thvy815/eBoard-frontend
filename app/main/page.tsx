"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { teacherSession } from "@/services/teacherSession";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const teacherId = teacherSession.getTeacherId();

    // chưa login
    if (!teacherId) {
      router.replace("/login");
      return;
    }

    // đã login → check lớp đã chọn chưa
    const selectedClassId = localStorage.getItem(`selectedClassId_${teacherId}`);

    if (selectedClassId) {
      router.replace("/main/class/attendance"); // vào quản lý lớp luôn
    } else {
      router.replace("/main/my-classes"); // chưa chọn lớp → qua danh sách lớp
    }
  }, [router]);

  return (
    <div className="p-6 text-sm text-gray-500">
      Đang chuyển hướng...
    </div>
  );
}
