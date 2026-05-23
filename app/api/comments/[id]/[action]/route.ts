import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const db = readDB();
  const idx = db.comments.findIndex((c) => c.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const comment = db.comments[idx];

  const isOwner = comment.authorId === user.id;
  const isAdmin = user.role === "admin";

  if (params.action === "edit") {
    if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const form = await req.formData().catch(() => null);
    const body = String(form?.get("body") || "").trim();
    if (!body) {
      return NextResponse.redirect(new URL(`/portal/idea/${comment.ideaId}`, req.url), { status: 303 });
    }
    comment.body = body;
    comment.updatedAt = new Date().toISOString();
  } else if (params.action === "delete") {
    if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    db.comments.splice(idx, 1);
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  writeDB(db);
  return NextResponse.redirect(new URL(`/portal/idea/${comment.ideaId}`, req.url), { status: 303 });
}
