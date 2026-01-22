// src/utils/jwt.ts

export type JwtPayload = {
  sub?: string;
  nameid?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
};

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
