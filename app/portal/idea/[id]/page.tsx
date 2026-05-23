import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, initials, avatarColor } from "@/lib/format";
import {
  Bookmark, Heart, Lock, Sparkles, ArrowLeft, Send, ChevronUp, ChevronDown,
  Pencil, Trash2, Shield, Bell, BellOff, Pin, LockIcon, Unlock,
} from "lucide-react";
import StatusBadge, { IDEA_STATUSES, statusLabel } from "@/components/StatusBadge";
import CommentItem, { type CommentItemProps } from "@/components/CommentItem";
import ReactionBar from "@/components/ReactionBar";
import { renderMarkdown } from "@/lib/markdown";

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  const me = getCurrentUser()!;
  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return notFound();
  const author = db.users.find((u) => u.id === idea.authorId);
  const allComments = db.comments
    .filter((c) => c.ideaId === idea.id)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));

  const liked = idea.likes.includes(me.id);
  const bookmarked = idea.bookmarks.includes(me.id);
  const upvoted = idea.upvotes?.includes(me.id) ?? false;
  const downvoted = idea.downvotes?.includes(me.id) ?? false;
  const score = (idea.upvotes?.length || 0) - (idea.downvotes?.length || 0);
  const isOwner = idea.authorId === me.id;
  const isAdmin = me.role === "admin";
  const subscribed = (idea.subscribers || []).includes(me.id);

  // Build threaded comment props
  const topLevel = allComments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, typeof allComments>();
  for (const c of allComments) {
    if (c.parentId) {
      const arr = repliesByParent.get(c.parentId) || [];
      arr.push(c);
      repliesByParent.set(c.parentId, arr);
    }
  }
  const toProps = (c: (typeof allComments)[number]): CommentItemProps => ({
    id: c.id,
    ideaId: idea.id,
    authorId: c.authorId,
    authorName: userMap[c.authorId]?.name,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    bodyHtml: renderMarkdown(c.body, db.users),
    rawBody: c.body,
    likes: c.likes?.length || 0,
    likedByMe: c.likes?.includes(me.id) || false,
    canEdit: c.authorId === me.id,
    canDelete: c.authorId === me.id || isAdmin,
  });
  const threaded = topLevel.map((c) => ({
    ...toProps(c),
    replies: (repliesByParent.get(c.id) || []).map(toProps),
  }));

  const bodyHtml = renderMarkdown(idea.body, db.users);

  // Similar ideas — tag overlap + same category boost
  const tagSet = new Set(idea.tags.map((t) => t.toLowerCase()));
  const similar = db.ideas
    .filter((i) => i.id !== idea.id)
    .map((i) => {
      const overlap = i.tags.reduce((n, t) => (tagSet.has(t.toLowerCase()) ? n + 1 : n), 0);
      const sameCat = i.category === idea.category ? 1 : 0;
      return { idea: i, score: overlap * 2 + sameCat };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.idea);

  return (
    <div className="max-w-3xl">
      <Link href="/portal" className="btn-ghost -ml-2 mb-4"><ArrowLeft className="h-4 w-4" /> Back to feed</Link>

      <article className="card p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={clsx("grid h-10 w-10 place-items-center rounded-full text-white text-sm font-semibold bg-gradient-to-br", avatarColor(author?.id || idea.authorId))}>
              {author ? initials(author.name) : "??"}
            </div>
            <div>
              <Link href={`/portal/profile/${idea.authorId}`} className="text-sm font-medium hover:text-royal-700">
                {author?.name || "Unknown"}
              </Link>
              <div className="text-xs text-ink-muted">
                {formatDate(idea.createdAt)} · {idea.category}
                {idea.updatedAt && idea.updatedAt !== idea.createdAt && (
                  <span title={`Edited ${formatDate(idea.updatedAt)}`}> · edited</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {idea.pinned && (
              <span className="chip-royal" title="Pinned"><Pin className="h-3 w-3" /> Pinned</span>
            )}
            {idea.locked && (
              <span className="chip" title="Discussion locked"><LockIcon className="h-3 w-3" /> Locked</span>
            )}
            {idea.visibility === "internal" && (
              <span className="chip"><Lock className="h-3 w-3" /> Internal</span>
            )}
            {idea.status && <StatusBadge status={idea.status} />}
            <span className="chip-royal">{idea.category}</span>
          </div>
        </div>

        <h1 className="font-display mt-5 text-3xl sm:text-4xl font-bold tracking-tight">{idea.title}</h1>

        {idea.summary && (
          <div className="mt-4 rounded-xl border border-royal-100 bg-royal-50/60 p-4">
            <div className="flex items-center gap-2 text-royal-700 text-sm font-medium">
              <Sparkles className="h-4 w-4" /> AI summary
            </div>
            <div className="mt-1 text-sm text-royal-900/80">{idea.summary}</div>
          </div>
        )}

        {idea.statusNote && (
          <div className="mt-4 rounded-xl border border-silver-200 bg-silver-50/70 p-4 text-sm">
            <div className="font-medium text-ink">Status note</div>
            <div className="mt-1 text-ink-muted whitespace-pre-wrap">{idea.statusNote}</div>
          </div>
        )}

        <div
          className="prose-idea mt-6 text-[15px] leading-relaxed text-ink space-y-3"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {idea.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {idea.tags.map((t) => (
              <Link key={t} href={`/portal/tag/${encodeURIComponent(t)}`} className="chip hover:bg-silver-100">
                #{t}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-5">
          <ReactionBar
            ideaId={idea.id}
            reactions={idea.reactions || {}}
            currentUserId={me.id}
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2 pt-5 border-t border-silver-200">
          <form action={`/api/ideas/${idea.id}/upvote`} method="POST">
            <button
              type="submit"
              className={clsx("btn-ghost", upvoted && "text-emerald-700 bg-emerald-50")}
              title="Upvote"
            >
              <ChevronUp className="h-4 w-4" /> {idea.upvotes?.length || 0}
            </button>
          </form>
          <form action={`/api/ideas/${idea.id}/downvote`} method="POST">
            <button
              type="submit"
              className={clsx("btn-ghost", downvoted && "text-rose-700 bg-rose-50")}
              title="Downvote"
            >
              <ChevronDown className="h-4 w-4" /> {idea.downvotes?.length || 0}
            </button>
          </form>
          <span
            className={clsx(
              "text-sm font-semibold tabular-nums px-2",
              score > 0 && "text-emerald-700",
              score < 0 && "text-rose-600",
              score === 0 && "text-ink-muted"
            )}
            title="Score"
          >
            score {score >= 0 ? `+${score}` : score}
          </span>
          <form action={`/api/ideas/${idea.id}/like`} method="POST">
            <button className={clsx("btn-ghost", liked && "text-rose-600 bg-rose-50/60")} type="submit">
              <Heart className={clsx("h-4 w-4", liked && "fill-rose-500")} /> {idea.likes.length} reactions
            </button>
          </form>
          <form action={`/api/ideas/${idea.id}/bookmark`} method="POST">
            <button className={clsx("btn-ghost", bookmarked && "text-royal-700 bg-royal-50")} type="submit">
              <Bookmark className="h-4 w-4" /> {bookmarked ? "Saved" : "Save"}
            </button>
          </form>
          <form action={`/api/ideas/${idea.id}/subscribe`} method="POST">
            <button
              className={clsx("btn-ghost", subscribed && "text-royal-700 bg-royal-50")}
              type="submit"
              title={subscribed ? "Unsubscribe from updates" : "Subscribe to updates"}
            >
              {subscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </form>

          <div className="flex-1" />

          {isAdmin && (
            <>
              <form action={`/api/ideas/${idea.id}/pin`} method="POST">
                <button type="submit" className={clsx("btn-ghost", idea.pinned && "text-royal-700 bg-royal-50")} title={idea.pinned ? "Unpin" : "Pin"}>
                  <Pin className="h-4 w-4" /> {idea.pinned ? "Unpin" : "Pin"}
                </button>
              </form>
              <form action={`/api/ideas/${idea.id}/lock`} method="POST">
                <button type="submit" className={clsx("btn-ghost", idea.locked && "text-amber-700 bg-amber-50")} title={idea.locked ? "Unlock" : "Lock discussion"}>
                  {idea.locked ? <Unlock className="h-4 w-4" /> : <LockIcon className="h-4 w-4" />}
                  {idea.locked ? "Unlock" : "Lock"}
                </button>
              </form>
            </>
          )}

          {(isOwner || isAdmin) && (
            <>
              <Link href={`/portal/idea/${idea.id}/edit`} className="btn-ghost" title="Edit">
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              <form action={`/api/ideas/${idea.id}/delete`} method="POST">
                <button
                  type="submit"
                  className="btn-ghost text-rose-600 hover:bg-rose-50"
                  title="Delete idea"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </form>
            </>
          )}
        </div>

        {isAdmin && (
          <form
            action={`/api/ideas/${idea.id}/status`}
            method="POST"
            className="mt-5 rounded-xl border border-silver-200 bg-silver-50/60 p-4"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-royal-600" /> Admin controls
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr_auto] sm:items-end">
              <div>
                <label className="label">Status</label>
                <select name="status" defaultValue={idea.status} className="input mt-1.5">
                  {IDEA_STATUSES.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Note (optional)</label>
                <input
                  name="note"
                  defaultValue={idea.statusNote || ""}
                  placeholder="Why this status?"
                  className="input mt-1.5"
                />
              </div>
              <button type="submit" className="btn-primary">Update</button>
            </div>
          </form>
        )}
      </article>

      {/* Similar ideas */}
      {similar.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold">Similar ideas</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {similar.map((s) => (
              <Link
                key={s.id}
                href={`/portal/idea/${s.id}`}
                className="card p-4 card-hover block"
              >
                <div className="text-xs text-ink-muted">{s.category}</div>
                <div className="mt-1 font-medium line-clamp-2">{s.title}</div>
                <div className="mt-2 text-xs text-ink-muted">
                  {(s.upvotes?.length || 0) - (s.downvotes?.length || 0) >= 0 ? "+" : ""}
                  {(s.upvotes?.length || 0) - (s.downvotes?.length || 0)} votes · {s.likes.length} reactions
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comments */}
      <section id="comments" className="mt-8">
        <h2 className="font-display text-xl font-semibold">Discussion ({allComments.length})</h2>
        {idea.locked ? (
          <div className="mt-4 card p-4 text-sm text-ink-muted flex items-center gap-2">
            <LockIcon className="h-4 w-4" /> Discussion is locked. No new comments can be posted.
          </div>
        ) : (
          <form action={`/api/ideas/${idea.id}/comment`} method="POST" className="mt-4 card p-4">
            <textarea name="body" required rows={3} className="input resize-none" placeholder="Share a thought, a critique, or a build idea…" />
            <div className="mt-1 text-xs text-ink-muted">
              Tip: supports **bold**, *italic*, `code`, [links](https://), lists, and @mentions.
            </div>
            <div className="mt-3 flex justify-end">
              <button className="btn-primary" type="submit"><Send className="h-4 w-4" /> Post</button>
            </div>
          </form>
        )}

        <div className="mt-5 grid gap-3">
          {threaded.length === 0 && <div className="text-sm text-ink-muted">No comments yet — be the first.</div>}
          {threaded.map((c) => (
            <CommentItem key={c.id} {...c} />
          ))}
        </div>
      </section>
    </div>
  );
}
