export interface Class {
  id: string;
  name: string;
  grade: string;
  room: string;
  schoolYear: string;
  totalStudents: number;
  currentStudents: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  teacherName: string;
  roomName: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;
  currentStudentCount: number;
  maxCapacity: number;
  description: string;
}
