import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import ScoreDetailTable from "./ScoreDetailTable";
import { ScoreDetailSummary, SubjectScore } from "@/types/score";
import { scoreService } from "@/services/scoreService";
// import scoreService from "...";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string;
  semester: number;
  studentId?: string;
}

export default function ScoreDetailModal({
  open,
  onClose,
  classId,
  semester,
  studentId,
}: Props) {
  const [data, setScores] = useState<SubjectScore[]>([]);
  const [summary, setSummary] = useState<ScoreDetailSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    setLoading(true);

    Promise.all([
      scoreService.getSubjects(classId),
      scoreService.getSubjectScores({ classId, studentId, semester }).catch(() => []),
      scoreService.getScoreDetailSummary({ classId, semester, studentId }) // ✅ thêm
    ])
      .then(([subjects, subjectScores, summary]) => {
        const scoreMap = new Map(subjectScores.map(s => [s.subjectId, s]));

        const merged = subjects.map(subj => {
          const found = scoreMap.get(subj.id);
          return {
            subjectId: subj.id,
            subjectName: subj.name,
            midTermScore: found?.midTermScore ?? null,
            finalTermScore: found?.finalTermScore ?? null,
            averageScore: found?.averageScore ?? null,
          };
        });

        setScores(merged);
        setSummary(summary); // ✅ set summary
      })
      .finally(() => setLoading(false));
  }, [studentId, classId, semester]);
  
  return (
    <Modal open={open} onClose={onClose} title="Chi tiết điểm">
      {loading ? (
        <div className="p-4 text-center">Đang tải...</div>
      ) : (
        <ScoreDetailTable data={data} summary={summary} />
      )}
    </Modal>
  );
}
