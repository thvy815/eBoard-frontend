import api from "@/lib/api";
import type { TeacherInfo, UpdateTeacherInfoRequest } from "@/types/teacher";

export const teacherService = {
    async getTeacherInfo(id: string): Promise<TeacherInfo> {
     const res = await api.get(`/teachers/info/${id}`);
     return res.data;
   },

  async updateTeacherInfo(id: string, payload: UpdateTeacherInfoRequest): Promise<void> {
    await api.put(`/teachers/info/${id}`, payload);
  },
};
