import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notify } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  if (user.id === params.id) {
    const back = req.headers.get("referer") || "/portal";
    return NextResponse.redirect(back, { status: 303 });
  }

  const db = readDB();
  const target = db.users.find((u) => u.id === params.id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const me = db.users.find((u) => u.id === user.id);
  if (!me) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!Array.isArray(me.following)) me.following = [];

  const idx = me.following.indexOf(target.id);
  if (idx >= 0) {
    me.following.splice(idx, 1);
  } else {
    me.following.push(target.id);
    notify(db, {
      userId: target.id,
      type: "new_follower",
      fromUserId: me.id,
    });
  }

  writeDB(db);
  const back = req.headers.get("referer") || `/portal/profile/${target.id}`;
  return NextResponse.redirect(back, { status: 303 });
}
