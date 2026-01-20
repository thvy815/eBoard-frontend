import api from "@/lib/api";
import {
  AttendanceInfoByClass,
  CreateAttendanceDto,
  PatchAttendanceDto,
} from "@/types/attendance";

/* ================= SERVICE ================= */

export const attendanceService = {
  /* ====== Lấy điểm danh theo lớp + ngày ====== */
  async getByClassAndDate(
    classId: string,
    date: string
  ): Promise<AttendanceInfoByClass> {
    const res = await api.get(
      `/attendance/class/${classId}/date/${date}`
    );

    return res.data;
  },

  /* ====== Tạo điểm danh cho ngày ====== */
  async createForDate(
    dto: CreateAttendanceDto
  ): Promise<AttendanceInfoByClass> {
    const res = await api.post(
      `/attendance`,
      dto
    );

    return res.data;
  },

  /* ====== Cập nhật 1 dòng điểm danh ====== */
  async patchAttendance(
    attendanceId: string,
    dto: PatchAttendanceDto
  ): Promise<void> {
    await api.patch(
      `/attendance/${attendanceId}`,
      dto
    );
  },
};
