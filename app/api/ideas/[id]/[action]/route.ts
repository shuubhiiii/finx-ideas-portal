import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_EMOJIS = ["🔥", "💡", "🎯", "👏", "🚀"];

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (params.action === "like") {
    idea.likes = toggle(idea.likes, user.id);
  } else if (params.action === "bookmark") {
    idea.bookmarks = toggle(idea.bookmarks, user.id);
  } else if (params.action === "upvote") {
    const had = idea.upvotes.includes(user.id);
    idea.downvotes = idea.downvotes.filter((x) => x !== user.id);
    idea.upvotes = had ? idea.upvotes.filter((x) => x !== user.id) : [...idea.upvotes, user.id];
  } else if (params.action === "downvote") {
    const had = idea.downvotes.includes(user.id);
    idea.upvotes = idea.upvotes.filter((x) => x !== user.id);
    idea.downvotes = had ? idea.downvotes.filter((x) => x !== user.id) : [...idea.downvotes, user.id];
  } else if (params.action === "subscribe") {
    if (!Array.isArray(idea.subscribers)) idea.subscribers = [];
    idea.subscribers = toggle(idea.subscribers, user.id);
  } else if (params.action === "react") {
    const form = await req.formData().catch(() => null);
    const emoji = String(form?.get("emoji") || "");
    if (!ALLOWED_EMOJIS.includes(emoji)) {
      return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
    }
    if (!idea.reactions) idea.reactions = {};
    const arr = idea.reactions[emoji] || [];
    idea.reactions[emoji] = toggle(arr, user.id);
    if (idea.reactions[emoji].length === 0) delete idea.reactions[emoji];
  } else if (params.action === "pin") {
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    idea.pinned = !idea.pinned;
  } else if (params.action === "lock") {
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    idea.locked = !idea.locked;
  } else if (params.action === "report") {
    if (!Array.isArray(idea.reports)) idea.reports = [];
    const form = await req.formData().catch(() => null);
    const reason = String(form?.get("reason") || "").trim().slice(0, 500);
    const already = idea.reports.find((r) => r.reporterId === user.id && !r.resolvedAt);
    if (!already) {
      idea.reports.push({
        id: uid("rep"),
        reporterId: user.id,
        reason: reason || "(no reason given)",
        createdAt: new Date().toISOString(),
      });
    }
  } else if (params.action === "delete") {
    if (idea.authorId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    db.ideas = db.ideas.filter((i) => i.id !== idea.id);
    db.comments = db.comments.filter((c) => c.ideaId !== idea.id);
    writeDB(db);
    return NextResponse.redirect(new URL("/portal", req.url), { status: 303 });
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  writeDB(db);
  const referer = req.headers.get("referer") || new URL("/portal", req.url).toString();
  return NextResponse.redirect(referer, { status: 303 });
}
