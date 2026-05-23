import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  const admin = getCurrentUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (params.action !== "delete") return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  const db = readDB();
  db.ideas = db.ideas.filter((i) => i.id !== params.id);
  db.comments = db.comments.filter((c) => c.ideaId !== params.id);
  writeDB(db);
  return NextResponse.redirect(new URL("/admin/ideas", req.url), { status: 303 });
}
