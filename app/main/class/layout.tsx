"use client";

import ClassNavigation from "@/components/class/ClassNavigation";

export default function ClassLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Thanh navigation ngang */}
      <ClassNavigation />

      {/* Nội dung từng tab */}
      <div>{children}</div>
    </div>
  );
}
