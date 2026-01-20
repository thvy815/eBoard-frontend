export type TeacherInfo = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
};

export type UpdateTeacherInfoRequest = {
  fullName: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
};
