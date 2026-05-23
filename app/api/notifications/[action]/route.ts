import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { action: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const db = readDB();
  if (!db.notifications) db.notifications = [];
  const now = new Date().toISOString();

  if (params.action === "read-all") {
    for (const n of db.notifications) {
      if (n.userId === user.id && !n.readAt) n.readAt = now;
    }
  } else if (params.action === "read") {
    const form = await req.formData().catch(() => null);
    const id = String(form?.get("id") || "");
    const n = db.notifications.find((x) => x.id === id && x.userId === user.id);
    if (n && !n.readAt) n.readAt = now;
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  writeDB(db);
  const back = req.headers.get("referer") || "/portal/notifications";
  return NextResponse.redirect(back, { status: 303 });
}
