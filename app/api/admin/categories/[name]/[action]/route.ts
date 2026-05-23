import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { name: string; action: string } }) {
  const admin = getCurrentUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (params.action !== "delete") return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  const name = decodeURIComponent(params.name);
  const db = readDB();
  const inUse = db.ideas.some((i) => i.category === name);
  if (inUse) return NextResponse.json({ error: "Category in use" }, { status: 400 });
  db.categories = db.categories.filter((c) => c !== name);
  writeDB(db);
  return NextResponse.redirect(new URL("/admin/categories", req.url), { status: 303 });
}
