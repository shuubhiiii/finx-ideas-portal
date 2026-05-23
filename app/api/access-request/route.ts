import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB, writeDB, uid } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { name, email, skills, reason, link, password } = body;
  if (!name || !email || !skills || !reason || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  const db = readDB();
  const emailNorm = String(email).toLowerCase().trim();
  if (db.users.some((u) => u.email.toLowerCase() === emailNorm)) {
    return NextResponse.json({ error: "An account already exists for this email" }, { status: 409 });
  }
  if (db.requests.some((r) => r.email.toLowerCase() === emailNorm && r.status === "pending")) {
    return NextResponse.json({ error: "A pending request already exists for this email" }, { status: 409 });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  db.requests.push({
    id: uid("req"),
    name: String(name).trim(),
    email: emailNorm,
    skills: String(skills).trim(),
    reason: String(reason).trim(),
    link: link ? String(link).trim() : undefined,
    passwordHash,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  writeDB(db);
  return NextResponse.json({ ok: true });
}
