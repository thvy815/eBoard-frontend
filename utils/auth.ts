// src/utils/auth.ts
export interface CurrentUser {
  id: string;
  fullName: string;
  email?: string;
  role?: string;
}

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}
