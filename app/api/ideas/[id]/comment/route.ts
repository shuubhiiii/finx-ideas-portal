import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData().catch(() => null);
  const text = String(form?.get("body") || "").trim();
  const parentId = String(form?.get("parentId") || "").trim() || undefined;
  if (!text) return NextResponse.redirect(new URL(`/portal/idea/${params.id}`, req.url), { status: 303 });

  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Validate parent; only allow 1-level nesting (replies to replies attach to root parent)
  let validParentId: string | undefined;
  if (parentId) {
    const parent = db.comments.find((c) => c.id === parentId && c.ideaId === idea.id);
    if (parent) validParentId = parent.parentId ? parent.parentId : parent.id;
  }

  db.comments.push({
    id: uid("cm"),
    ideaId: idea.id,
    authorId: user.id,
    body: text,
    createdAt: new Date().toISOString(),
    parentId: validParentId,
    likes: [],
  });
  writeDB(db);
  return NextResponse.redirect(new URL(`/portal/idea/${params.id}#comments`, req.url), { status: 303 });
}
