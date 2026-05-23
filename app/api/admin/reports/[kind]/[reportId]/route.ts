import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { kind: string; reportId: string } },
) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const db = readDB();
  const now = new Date().toISOString();
  let found = false;

  if (params.kind === "idea") {
    for (const i of db.ideas) {
      const r = (i.reports || []).find((x) => x.id === params.reportId);
      if (r) {
        r.resolvedAt = now;
        r.resolvedBy = user.id;
        found = true;
        break;
      }
    }
  } else if (params.kind === "comment") {
    for (const c of db.comments) {
      const r = (c.reports || []).find((x) => x.id === params.reportId);
      if (r) {
        r.resolvedAt = now;
        r.resolvedBy = user.id;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  writeDB(db);
  const referer = req.headers.get("referer") || new URL("/admin/reports", req.url).toString();
  return NextResponse.redirect(referer, { status: 303 });
}
