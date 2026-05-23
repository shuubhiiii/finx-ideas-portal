import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB } from "@/lib/db";
import { setSessionCookie, signSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email);
  if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  if (user.status === "pending") {
    return NextResponse.json({ error: "Your access request is still under review." }, { status: 403 });
  }
  if (user.status === "rejected") {
    return NextResponse.json({ error: "Your access request was not approved." }, { status: 403 });
  }
  if (user.status === "suspended") {
    return NextResponse.json({ error: "Your account has been suspended." }, { status: 403 });
  }

  const token = signSession({ sub: user.id, role: user.role });
  setSessionCookie(token);
  return NextResponse.json({ ok: true, role: user.role });
}
