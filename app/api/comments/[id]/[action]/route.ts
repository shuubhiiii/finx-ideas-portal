import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notify } from "@/lib/notifications";

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
      return NextResponse.redirect(new URL(`/portal/idea/${comment.ideaId}#comments`, req.url), { status: 303 });
    }
    comment.body = body;
    comment.updatedAt = new Date().toISOString();
  } else if (params.action === "delete") {
    if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    db.comments = db.comments.filter((c) => c.id !== comment.id && c.parentId !== comment.id);
  } else if (params.action === "like") {
    if (!Array.isArray(comment.likes)) comment.likes = [];
    const i = comment.likes.indexOf(user.id);
    if (i >= 0) {
      comment.likes.splice(i, 1);
    } else {
      comment.likes.push(user.id);
      notify(db, {
        userId: comment.authorId,
        type: "comment_like",
        ideaId: comment.ideaId,
        commentId: comment.id,
        fromUserId: user.id,
      });
    }
  } else if (params.action === "report") {
    if (!Array.isArray(comment.reports)) comment.reports = [];
    const form = await req.formData().catch(() => null);
    const reason = String(form?.get("reason") || "").trim().slice(0, 500);
    const already = comment.reports.find((r) => r.reporterId === user.id && !r.resolvedAt);
    if (!already) {
      comment.reports.push({
        id: uid("rep"),
        reporterId: user.id,
        reason: reason || "(no reason given)",
        createdAt: new Date().toISOString(),
      });
    }
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  writeDB(db);
  return NextResponse.redirect(new URL(`/portal/idea/${comment.ideaId}#comments`, req.url), { status: 303 });
}
