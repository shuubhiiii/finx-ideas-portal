import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { summarizeIdea } from "@/lib/ai";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (idea.authorId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const title = String(form.get("title") || "").trim();
  const body = String(form.get("body") || "").trim();
  const category = String(form.get("category") || "").trim();
  const visibility = form.get("visibility") === "internal" ? "internal" : "community";
  const tagsRaw = String(form.get("tags") || "");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (!title || !body || !category) {
    return NextResponse.json({ error: "Title, body and category are required" }, { status: 400 });
  }
  if (!db.categories.includes(category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  const titleOrBodyChanged = title !== idea.title || body !== idea.body;

  idea.title = title;
  idea.body = body;
  idea.category = category;
  idea.tags = tags;
  idea.visibility = visibility as "community" | "internal";
  idea.updatedAt = new Date().toISOString();
  if (titleOrBodyChanged) idea.summary = summarizeIdea(title, body);

  writeDB(db);
  return NextResponse.redirect(new URL(`/portal/idea/${idea.id}`, req.url), { status: 303 });
}
