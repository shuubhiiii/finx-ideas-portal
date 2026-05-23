import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { readDB, type User } from "./db";

const SECRET = process.env.JWT_SECRET || "dev-only-change-me";
const COOKIE = "finx_session";

export interface SessionPayload {
  sub: string; // user id
  role: "member" | "admin";
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}

export function getCurrentUser(): User | null {
  const token = cookies().get(COOKIE)?.value;
  const payload = verifySession(token);
  if (!payload) return null;
  const db = readDB();
  const user = db.users.find((u) => u.id === payload.sub) || null;
  if (!user) return null;
  if (user.status !== "approved") return null;
  return user;
}

export function requireUser(): User {
  const user = getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export const SESSION_COOKIE = COOKIE;
