import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { summarizeIdea } from "@/lib/ai";

export async function POST(req: Request) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const title = String(body.title || "").trim();
  const text = String(body.body || "").trim();
  const category = String(body.category || "").trim();
  const tags = Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean).slice(0, 8) : [];
  const visibility = body.visibility === "internal" ? "internal" : "community";

  if (!title || !text || !category) {
    return NextResponse.json({ error: "Title, body and category are required" }, { status: 400 });
  }

  const db = readDB();
  if (!db.categories.includes(category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const idea = {
    id: uid("idea"),
    authorId: user.id,
    title,
    body: text,
    summary: summarizeIdea(title, text),
    category,
    tags,
    visibility: visibility as "community" | "internal",
    createdAt: new Date().toISOString(),
    bookmarks: [],
    likes: [],
    upvotes: [],
    downvotes: [],
  };
  db.ideas.unshift(idea);
  writeDB(db);
  return NextResponse.json({ ok: true, id: idea.id });
}
