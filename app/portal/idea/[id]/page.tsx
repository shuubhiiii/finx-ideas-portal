import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, initials, avatarColor } from "@/lib/format";
import { Bookmark, Heart, Lock, Sparkles, ArrowLeft, Send } from "lucide-react";

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  const me = getCurrentUser()!;
  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return notFound();
  const author = db.users.find((u) => u.id === idea.authorId);
  const comments = db.comments
    .filter((c) => c.ideaId === idea.id)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));
  const liked = idea.likes.includes(me.id);
  const bookmarked = idea.bookmarks.includes(me.id);

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
              <div className="text-sm font-medium">{author?.name || "Unknown"}</div>
              <div className="text-xs text-ink-muted">{formatDate(idea.createdAt)} · {idea.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {idea.visibility === "internal" && (
              <span className="chip"><Lock className="h-3 w-3" /> Internal</span>
            )}
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

        <div className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{idea.body}</div>

        {idea.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {idea.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
          </div>
        )}

        <div className="mt-7 flex items-center gap-2 pt-5 border-t border-silver-200">
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
        </div>
      </article>

      {/* Comments */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Discussion ({comments.length})</h2>
        <form action={`/api/ideas/${idea.id}/comment`} method="POST" className="mt-4 card p-4">
          <textarea name="body" required rows={3} className="input resize-none" placeholder="Share a thought, a critique, or a build idea…" />
          <div className="mt-3 flex justify-end">
            <button className="btn-primary" type="submit"><Send className="h-4 w-4" /> Post</button>
          </div>
        </form>

        <div className="mt-5 grid gap-3">
          {comments.length === 0 && <div className="text-sm text-ink-muted">No comments yet — be the first.</div>}
          {comments.map((c) => {
            const u = userMap[c.authorId];
            return (
              <div key={c.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <div className={clsx("grid h-8 w-8 place-items-center rounded-full text-white text-xs font-semibold bg-gradient-to-br", avatarColor(c.authorId))}>
                    {u ? initials(u.name) : "??"}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{u?.name || "Unknown"}</div>
                    <div className="text-xs text-ink-muted">{formatDate(c.createdAt)}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm whitespace-pre-wrap">{c.body}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
