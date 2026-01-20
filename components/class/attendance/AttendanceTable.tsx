"use client";

import { AttendanceRecord, AttendanceStatus } from "@/types/attendance";
import { attendanceService } from "@/services/attendanceService";

interface Props {
  data: AttendanceRecord[];
  onChange: () => void;
}

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "PRESENT", label: "Có mặt" },
  { value: "ABSENT_UNEXCUSED", label: "Vắng không phép" },
  { value: "ABSENT_EXCUSED", label: "Vắng có phép" },
];

export default function AttendanceTable({ data, onChange }: Props) {
  const update = async (
    id: string,
    patch: Partial<AttendanceRecord>
  ) => {
    await attendanceService.patchAttendance(id, patch);
    onChange();
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">STT</th>
            <th className="p-3 text-left">Họ tên học sinh</th>
            <th className="p-3">Tình trạng</th>
            <th className="p-3">Lí do vắng</th>
            <th className="p-3">Người đón/trả</th>
            <th className="p-3">Ghi chú</th>
          </tr>
        </thead>

        <tbody>
          {data.map((s, i) => (
            <tr key={s.id} className="border-t">
              <td className="p-3">{i + 1}</td>
              <td className="p-3 font-medium">{s.studentName}</td>

              <td className="p-3">
                <select
                  value={s.status}
                  onChange={e =>
                    update(s.id, { status: e.target.value as AttendanceStatus })
                  }
                  className="border rounded px-2 py-1"
                >
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-3">
                <input
                  defaultValue={s.absenceReason}
                  onBlur={e =>
                    update(s.id, { absenceReason: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Nhập lý do..."
                />
              </td>

              <td className="p-3">
                <input
                  defaultValue={s.pickupPerson}
                  onBlur={e =>
                    update(s.id, { pickupPerson: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Người đón/trả..."
                />
              </td>

              <td className="p-3">
                <input
                  defaultValue={s.notes}
                  onBlur={e =>
                    update(s.id, { notes: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Ghi chú..."
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
