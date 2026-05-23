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
  else return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  writeDB(db);
  const referer = _req.headers.get("referer") || new URL("/portal", _req.url).toString();
  return NextResponse.redirect(referer, { status: 303 });
}
