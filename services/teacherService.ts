import api from "@/lib/api";
import type { TeacherInfo, UpdateTeacherInfoRequest } from "@/types/teacher";

export type ChangePasswordRequest = {
  id: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const teacherService = {
    async getTeacherInfo(id: string): Promise<TeacherInfo> {
     const res = await api.get(`/teachers/info/${id}`);
     return res.data;
   },

  async updateTeacherInfo(id: string, payload: UpdateTeacherInfoRequest): Promise<void> {
    await api.put(`/teachers/info/${id}`, payload);
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await api.post("/teachers/change-password", payload);
  },
};
