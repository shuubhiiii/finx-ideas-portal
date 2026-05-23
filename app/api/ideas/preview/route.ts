import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { summarizeIdea, findDuplicates } from "@/lib/ai";

export async function POST(req: Request) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const title = String(body.title || "");
  const text = String(body.body || "");
  const db = readDB();
  return NextResponse.json({
    summary: summarizeIdea(title, text),
    duplicates: findDuplicates({ title, body: text }, db.ideas).map((d) => ({ id: d.id, title: d.title })),
  });
}
