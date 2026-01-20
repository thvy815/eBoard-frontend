"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { scoreService } from "@/services/scoreService";
import {
  SubjectScore,
  ScoreDetailSummary,
} from "@/types/score";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  schoolYear: string;
  semester: number;
  student: {
    id: string;
    name: string;
  };
}

export default function SingleScorePrintModal({
  open,
  onClose,
  classId,
  className,
  schoolYear,
  semester,
  student,
}: Props) {
  const [subjects, setSubjects] = useState<SubjectScore[]>([]);
  const [summary, setSummary] =
    useState<ScoreDetailSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);

      const [subjectScores, summaryData] =
        await Promise.all([
          scoreService.getSubjectScores({
            classId,
            semester,
            studentId: student.id,
          }),
          scoreService.getScoreDetailSummary({
            classId,
            semester,
            studentId: student.id,
          }),
        ]);

      setSubjects(subjectScores);
      setSummary(summaryData);
      setLoading(false);
    };

    fetchData();
  }, [open, classId, semester, student.id]);

  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[900px] max-h-[90vh] rounded-xl shadow-lg overflow-hidden flex flex-col">

        {/* ===== HEADER (KHÔNG IN) ===== */}
        <div className="px-6 py-4 border-b text-center print:hidden">
          <h2 className="text-xl font-semibold uppercase">
            In bảng điểm cá nhân
          </h2>
        </div>

        {/* ===== CONTENT (IN) ===== */}
        <div className="px-6 py-6 overflow-auto space-y-6 print-area">
          {loading ? (
            <div className="text-center">Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* ===== TITLE ===== */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold uppercase">
                  BẢNG ĐIỂM CÁ NHÂN
                </h1>
                <div className="text-sm">
                  Học sinh: <strong>{student.name}</strong>
                </div>
                <div className="text-sm">
                  Lớp: <strong>{className}</strong>
                </div>
                <div className="text-sm">
                  Năm học: <strong>{schoolYear}</strong> – Học kỳ{" "}
                  <strong>{semester}</strong>
                </div>
              </div>

              {/* ===== TABLE ===== */}
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Môn học</th>
                    <th className="border p-2">Giữa kỳ</th>
                    <th className="border p-2">Cuối kỳ</th>
                    <th className="border p-2">TB</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.subjectId}>
                      <td className="border p-2">
                        {s.subjectName}
                      </td>
                      <td className="border p-2 text-center">
                        {s.midTermScore ?? "-"}
                      </td>
                      <td className="border p-2 text-center">
                        {s.finalTermScore ?? "-"}
                      </td>
                      <td className="border p-2 text-center">
                        {s.averageScore ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ===== SUMMARY ===== */}
              {summary && (
                <div className="flex justify-end gap-8 text-sm font-medium mt-4">
                  <div>
                    Điểm TB:{" "}
                    <span className="font-bold">
                      {summary.averageScore}
                    </span>
                  </div>
                  <div>
                    Xếp loại:{" "}
                    <span className="font-bold">
                      {summary.grade}
                    </span>
                  </div>
                  <div>
                    Hạng:{" "}
                    <span className="font-bold">
                      {summary.rank}
                    </span>
                  </div>
                </div>
              )}

              {/* ===== SIGNATURE ===== */}
              <div className="grid grid-cols-2 gap-8 mt-16 text-center text-sm">
                <div>
                  <div className="font-medium">
                    Giáo viên chủ nhiệm
                  </div>
                  <div className="italic mt-20">
                    (Ký, ghi rõ họ tên)
                  </div>
                </div>

                <div>
                  <div className="font-medium">
                    Xác nhận Ban Giám Hiệu
                  </div>
                  <div className="italic mt-20">
                    (Ký, đóng dấu)
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== ACTION (KHÔNG IN) ===== */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button onClick={handlePrint}>
            In bảng điểm
          </Button>
        </div>
      </div>
    </div>
  );
}
