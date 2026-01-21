"use client";

import { ActivityParticipant } from "@/types/activity";
import Button from "@/components/ui/Button";
import { Trash2, Pencil } from "lucide-react";

interface Props {
  data: ActivityParticipant[];
  onEdit?: (participant: ActivityParticipant) => void;
  onDelete?: (id: string) => void;
}

export default function ParticipantTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  const hasData = data.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead className="bg-[#6B8F8B] text-white">
          <tr>
            <th className="p-4 text-left w-[60px]">STT</th>
            <th className="text-left">Họ và tên</th>
            <th>SDT phụ huynh</th>
            <th className="text-center w-[120px]">Thao tác</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {hasData ? (
            data.map((p, idx) => (
              <tr
                key={p.id}
                className="border-t text-center hover:bg-gray-50 transition"
              >
                <td className="p-4 text-left">{idx + 1}</td>

                <td className="text-left font-medium text-[#4A6F6B]">
                  {p.studentName}
                </td>

                <td>{p.parentPhoneNumber}</td>

                <td className="flex justify-center gap-2 py-2">
                  {/* EDIT */}
                  <Button
                    icon={Pencil}
                    variant="ghost"
                    className="text-[#F4A261] hover:bg-[#F4A261]/10"
                    onClick={() => onEdit?.(p)}
                  >
                    <span className="sr-only">Sửa</span>
                  </Button>

                  {/* DELETE */}
                  <Button
                    icon={Trash2}
                    variant="ghost"
                    className="text-[#E76F51] hover:bg-[#E76F51]/10"
                    onClick={() => onDelete?.(p.id)}
                  >
                    <span className="sr-only">Xóa</span>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="h-32 text-center text-gray-400 bg-gray-50"
              >
                Chưa có học sinh tham gia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
