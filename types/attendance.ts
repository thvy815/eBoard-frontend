// types/attendance.ts

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT_UNEXCUSED"
  | "ABSENT_EXCUSED";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  absenceReason: string;
  pickupPerson: string;
  notes: string;
}

export interface AttendanceInfoByClass {
  classId: string;
  className: string;
  date: string; // yyyy-MM-dd
  attendances: AttendanceRecord[];
}

export interface CreateAttendanceDto {
  classId: string;
  date: string;
}

export interface PatchAttendanceDto {
  status?: AttendanceStatus;
  absenceReason?: string;
  pickupPerson?: string;
  notes?: string;
}
