import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notify } from "@/lib/notifications";
import { extractMentions } from "@/lib/markdown";

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
  if (idea.locked) {
    return NextResponse.redirect(new URL(`/portal/idea/${idea.id}#comments`, req.url), { status: 303 });
  }

  // Validate parent; only allow 1-level nesting
  let validParentId: string | undefined;
  let parentAuthorId: string | undefined;
  if (parentId) {
    const parent = db.comments.find((c) => c.id === parentId && c.ideaId === idea.id);
    if (parent) {
      validParentId = parent.parentId ? parent.parentId : parent.id;
      parentAuthorId = parent.authorId;
    }
  }

  const newId = uid("cm");
  db.comments.push({
    id: newId,
    ideaId: idea.id,
    authorId: user.id,
    body: text,
    createdAt: new Date().toISOString(),
    parentId: validParentId,
    likes: [],
    reports: [],
  });

  // Auto-subscribe commenter to the idea
  if (!Array.isArray(idea.subscribers)) idea.subscribers = [];
  if (!idea.subscribers.includes(user.id)) idea.subscribers.push(user.id);

  // Notifications
  const notified = new Set<string>([user.id]);
  if (parentAuthorId) {
    notify(db, {
      userId: parentAuthorId,
      type: "reply_to_comment",
      ideaId: idea.id,
      commentId: newId,
      fromUserId: user.id,
      text: idea.title,
    });
    notified.add(parentAuthorId);
  } else {
    notify(db, {
      userId: idea.authorId,
      type: "comment_on_idea",
      ideaId: idea.id,
      commentId: newId,
      fromUserId: user.id,
      text: idea.title,
    });
    notified.add(idea.authorId);
  }
  const mentioned = extractMentions(text, db.users);
  for (const mid of mentioned) {
    if (notified.has(mid)) continue;
    notify(db, {
      userId: mid,
      type: "mention",
      ideaId: idea.id,
      commentId: newId,
      fromUserId: user.id,
      text: idea.title,
    });
    notified.add(mid);
  }
  // Notify other subscribers (not commenter, not already notified)
  for (const sid of idea.subscribers) {
    if (notified.has(sid)) continue;
    notify(db, {
      userId: sid,
      type: "subscribed_comment",
      ideaId: idea.id,
      commentId: newId,
      fromUserId: user.id,
      text: idea.title,
    });
    notified.add(sid);
  }

  writeDB(db);
  return NextResponse.redirect(new URL(`/portal/idea/${params.id}#comments`, req.url), { status: 303 });
}
