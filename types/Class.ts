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

export type Option = { value: string; label: string };

export type CreateClassForm = {
  name: string;
  gradeId: string;
  roomName: string;

  startMonth: string; // 1..12
  startYear: string; // 4 digits
  endMonth: string; // 1..12
  endYear: string; // 4 digits

  maxCapacity: string; // number string
  classDescription: string; // UI dùng field này, POST map -> description
};

export type CreatedClass = {
  id: string;
  name: string;
  gradeId: string;
  teacherId: string;
  roomName: string;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  currentStudentCount: number;
  maxCapacity: number;
  classDescription: string;
};

export type ClassItem = {
  id: string;
  name: string;
  gradeLabel: string;
  roomName: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  currentStudentCount: number;
  maxCapacity: number;
  classDescription?: string;
};

export type ClassesPagedResponse<T> = {
  data: T[];
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
};
