export type StudentRow = {
  id: string;
  fullName: string;
  dob: string;        // dd/mm/yyyy
  address: string;
  parentName: string;
  email: string;
  phone: string;      // username
  password: string;
};

export type ImportedStudent = StudentRow;
