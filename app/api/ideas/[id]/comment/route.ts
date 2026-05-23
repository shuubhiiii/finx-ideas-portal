import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData().catch(() => null);
  const text = String(form?.get("body") || "").trim();
  if (!text) return NextResponse.redirect(new URL(`/portal/idea/${params.id}`, req.url), { status: 303 });

  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.comments.push({
    id: uid("cm"),
    ideaId: idea.id,
    authorId: user.id,
    body: text,
    createdAt: new Date().toISOString(),
  });
  writeDB(db);
  return NextResponse.redirect(new URL(`/portal/idea/${params.id}`, req.url), { status: 303 });
}
