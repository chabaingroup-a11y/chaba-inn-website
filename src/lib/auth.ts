import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";
import type { SessionOptions } from "iron-session";

export type SessionData = {
  userId?: string;
  username?: string;
  name?: string;
  role?: "ADMIN" | "STAFF";
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || sessionSecret.length < 32) {
  // ไม่ throw ตอน build เพื่อไม่ให้ next build ล้ม แต่จะเตือนชัดเจนตอนรันจริง
  console.warn(
    "[chaba-inn] SESSION_SECRET ยังไม่ถูกตั้งค่าให้ยาวพอ (ต้องอย่างน้อย 32 ตัวอักษร) — ตั้งค่าใน .env ก่อนใช้งานจริง"
  );
}

export const sessionOptions: SessionOptions = {
  password: sessionSecret || "dev-only-insecure-secret-change-me-please-32chars",
  cookieName: "chaba_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 ชั่วโมง
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.userId) {
    return null;
  }
  return session;
}
