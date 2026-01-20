import api from "@/lib/api";
import type { UpdateParentInfoRequest } from "@/types/parent";

export const parentService = {
  async updateParentInfo(id: string, payload: UpdateParentInfoRequest): Promise<void> {
    await api.put(`/parents/info/${id}`, payload);
  },
};
