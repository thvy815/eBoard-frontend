import api from "@/lib/api";
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LoginResponseDto,
  RegisterTeacherRequest,
  TeacherLoginRequest,
} from "@/types/auth";

export const authService = {
  async teacherLogin(payload: TeacherLoginRequest): Promise<LoginResponseDto> {
    const res = await api.post("/auth/teacher/login", payload);
    return res.data;
  },

  async registerTeacher(payload: RegisterTeacherRequest): Promise<void> {
    await api.post("/auth/teacher/register", payload);
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<string> {
    const res = await api.post("/auth/forgot-password", payload);
    // BE trả string message
    return res.data;
  },

  // ✅ BE chỉ cần token + newPassword + confirmPassword
  async resetPassword(payload: ResetPasswordRequest): Promise<string> {
    const res = await api.post("/auth/reset-password", payload);
    return res.data;
  },
};
