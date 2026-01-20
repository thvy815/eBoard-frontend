"use client";

import { useEffect, useState } from "react";
import AttendanceStats from "@/components/class/attendance/AttendanceStats";
import AttendanceTable from "@/components/class/attendance/AttendanceTable";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceInfoByClass } from "@/types/attendance";
import Button from "@/components/ui/Button";

export default function AttendancePage() {
  const classId = "27f5cded-0c8a-4aa0-a099-718ac7434a3b";
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [data, setData] = useState<AttendanceInfoByClass | null>(null);

  const load = async () => {
    try {
      const res = await attendanceService.getByClassAndDate(classId, date);
      setData(res);
    } catch {
      const created = await attendanceService.createForDate({
        classId,
        date,
      });
      setData(created);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <span className="px-3 py-1 bg-[#6BCDB1]/20 text-[#518581] rounded-full">
            {data.className}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Xuất Excel</Button>
          <Button variant="primary">Lưu danh sách</Button>
        </div>
      </div>

      <AttendanceStats data={data.attendances} />

      <AttendanceTable
        data={data.attendances}
        onChange={load}
      />
    </div>
  );
}
