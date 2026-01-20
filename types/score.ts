/* ================= ENUM ================= */

export type Grade =
  | "Xuất sắc"
  | "Giỏi"
  | "Khá"
  | "Trung bình"
  | "Yếu";

/* ================= THỐNG KÊ LỚP ================= */

/**
 * FE dùng để render card thống kê
 * Map từ ClassScoreSummaryDto
 */
export interface ScoreStat {
  label: Grade;
  value: number;
  type: "excellent" | "good" | "average" | "weak";
}

/**
 * Map từ StudentScoreSummaryDto
 */
export interface StudentScore {
  studentId: string;      // Guid
  studentName: string;
  averageScore: number;
  grade: Grade;
}

/**
 * Map từ ClassScoreSummaryDto
 */
export interface ClassScoreSummary {
  stats: ScoreStat[];
  studentScores: StudentScore[];
}

/* ================= BẢNG ĐIỂM HỌC SINH ================= */

/**
 * Map từ SubjectScoreDto
 */
export interface SubjectScore {
  subjectId: string;      // Guid
  subjectName: string;
  midTermScore: number | null;
  finalTermScore: number | null;
  averageScore: number | null;
}

/**
 * Map từ StudentScoreSheetDto
 */
export interface StudentScoreSheet {
  studentId: string;
  studentName: string;

  className: string;
  academicYear: string;
  semester: number;

  rank: number;
  rankInClass: string;

  averageScore: number;
  grade: Grade;

  subjectScores: SubjectScore[];
}

/**
 * FE chỉ cần phần tổng kết
 */
export interface ScoreDetailSummary {
  averageScore: number;
  grade: Grade;
  rank: number;
}

/* ================= UPDATE SCORE ================= */

/**
 * Map từ UpdateSubjectScoreDto
 */
export interface UpdateSubjectScore {
  subjectId: string;
  midtermScore: number;
  finalScore: number;
}

/**
 * Map từ UpdateIndividualStudentScoreSheetDto
 */
export interface UpdateStudentScoreSheetPayload {
  subjectScores: UpdateSubjectScore[];
}

/* ================= SUBJECT ================= */

/**
 * Map từ SubjectDto
 */
export interface Subject {
  id: string;     // Guid
  name: string;
}

/* ================= SCORE BY SUBJECT (OPTIONAL) ================= */
/**
 * FE-only type (nếu sau này có API riêng)
 */
export interface ScoreBySubject {
  studentId: string;
  studentName: string;

  midtermScore: number | null;
  finalScore: number | null;

  averageScore: number | null;
  grade: Grade | null;

  note?: string;
}
