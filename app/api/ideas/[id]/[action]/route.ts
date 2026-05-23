import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export async function POST(_req: Request, { params }: { params: { id: string; action: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", _req.url));
  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (params.action === "like") idea.likes = toggle(idea.likes, user.id);
  else if (params.action === "bookmark") idea.bookmarks = toggle(idea.bookmarks, user.id);
  else if (params.action === "upvote") {
    const had = idea.upvotes.includes(user.id);
    idea.downvotes = idea.downvotes.filter((x) => x !== user.id);
    idea.upvotes = had ? idea.upvotes.filter((x) => x !== user.id) : [...idea.upvotes, user.id];
  } else if (params.action === "downvote") {
    const had = idea.downvotes.includes(user.id);
    idea.upvotes = idea.upvotes.filter((x) => x !== user.id);
    idea.downvotes = had ? idea.downvotes.filter((x) => x !== user.id) : [...idea.downvotes, user.id];
  } else if (params.action === "delete") {
    if (idea.authorId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    db.ideas = db.ideas.filter((i) => i.id !== idea.id);
    db.comments = db.comments.filter((c) => c.ideaId !== idea.id);
    writeDB(db);
    return NextResponse.redirect(new URL("/portal", _req.url), { status: 303 });
  } else return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  writeDB(db);
  const referer = _req.headers.get("referer") || new URL("/portal", _req.url).toString();
  return NextResponse.redirect(referer, { status: 303 });
}
