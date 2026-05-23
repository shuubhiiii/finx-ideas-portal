import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  const admin = getCurrentUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = readDB();
  const u = db.users.find((x) => x.id === params.id);
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (u.role === "admin") return NextResponse.json({ error: "Cannot modify admin" }, { status: 400 });

  if (params.action === "suspend") u.status = "suspended";
  else if (params.action === "reinstate") u.status = "approved";
  else return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  writeDB(db);
  return NextResponse.redirect(new URL("/admin/members", req.url), { status: 303 });
}
