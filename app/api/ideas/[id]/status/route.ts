import { NextResponse } from "next/server";
import { readDB, writeDB, type IdeaStatus } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const VALID: IdeaStatus[] = ["new", "under_review", "in_progress", "shipped", "declined"];

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData().catch(() => null);
  const status = String(form?.get("status") || "") as IdeaStatus;
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const note = String(form?.get("note") || "").trim();

  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

  idea.status = status;
  idea.statusNote = note || undefined;
  idea.updatedAt = new Date().toISOString();
  writeDB(db);

  return NextResponse.redirect(new URL(`/portal/idea/${idea.id}`, req.url), { status: 303 });
}
