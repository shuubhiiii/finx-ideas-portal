import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  const admin = getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const db = readDB();
  const r = db.requests.find((x) => x.id === params.id);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (params.action === "approve") {
    r.status = "approved";
    // Create user from request
    if (!db.users.some((u) => u.email.toLowerCase() === r.email.toLowerCase())) {
      db.users.push({
        id: uid("usr"),
        name: r.name,
        email: r.email,
        passwordHash: r.passwordHash || "",
        role: "member",
        status: "approved",
        skills: r.skills,
        bio: r.reason.slice(0, 140),
        link: r.link,
        joinedAt: new Date().toISOString(),
      });
    }
  } else if (params.action === "reject") {
    r.status = "rejected";
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  writeDB(db);
  return NextResponse.redirect(new URL("/admin/requests", req.url), { status: 303 });
}
