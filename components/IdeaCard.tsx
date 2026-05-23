import Link from "next/link";
import clsx from "clsx";
import { Bookmark, Heart, MessageCircle, Lock, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { formatDate, initials, avatarColor } from "@/lib/format";
import type { Idea, User } from "@/lib/db";
import StatusBadge from "./StatusBadge";

export default function IdeaCard({
  idea,
  author,
  commentsCount,
  currentUserId,
  compact = false,
}: {
  idea: Idea;
  author?: User;
  commentsCount: number;
  currentUserId: string;
  compact?: boolean;
}) {
  const liked = idea.likes.includes(currentUserId);
  const bookmarked = idea.bookmarks.includes(currentUserId);
  const upvoted = idea.upvotes?.includes(currentUserId) ?? false;
  const downvoted = idea.downvotes?.includes(currentUserId) ?? false;
  const score = (idea.upvotes?.length || 0) - (idea.downvotes?.length || 0);

  return (
    <article className="card card-hover p-5 sm:p-6 animate-fadeUp">
      <div className="flex items-start gap-4">
        <VoteStack ideaId={idea.id} score={score} upvoted={upvoted} downvoted={downvoted} />
        <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={clsx(
              "grid h-9 w-9 place-items-center rounded-full text-white text-xs font-semibold bg-gradient-to-br shrink-0",
              avatarColor(author?.id || idea.authorId)
            )}
          >
            {author ? initials(author.name) : "??"}
          </div>
          <div className="min-w-0">
            <Link href={`/portal/profile/${idea.authorId}`} className="text-sm font-medium truncate hover:text-royal-700">
              {author?.name || "Unknown member"}
            </Link>
            <div className="text-xs text-ink-muted truncate">
              {formatDate(idea.createdAt)} · {idea.category}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {idea.pinned && <span className="chip-royal"><span className="text-[10px] mr-1">📌</span> Pinned</span>}
          {idea.locked && <span className="chip"><Lock className="h-3 w-3" /> Locked</span>}
          {idea.visibility === "internal" && (
            <span className="chip"><Lock className="h-3 w-3" /> Internal</span>
          )}
          {idea.status && idea.status !== "new" && <StatusBadge status={idea.status} />}
          <span className="chip-royal">{idea.category}</span>
        </div>
      </div>

      <Link href={`/portal/idea/${idea.id}`} className="block mt-4 group">
        <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight group-hover:text-royal-700 transition">
          {idea.title}
        </h3>
        {idea.summary && (
          <div className="mt-2 flex items-start gap-2 rounded-xl border border-royal-100 bg-royal-50/60 px-3 py-2 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-royal-600 mt-0.5 shrink-0" />
            <span className="text-royal-900/80"><span className="font-medium text-royal-700">AI summary · </span>{idea.summary}</span>
          </div>
        )}
        {!compact && (
          <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-3">{idea.body}</p>
        )}
      </Link>

      {idea.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {idea.tags.map((t) => (
            <Link key={t} href={`/portal/tag/${encodeURIComponent(t)}`} className="chip hover:bg-silver-100">#{t}</Link>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-1.5">
        <ActionButton ideaId={idea.id} action="like" active={liked} count={idea.likes.length} icon={Heart} label="Like" />
        <Link href={`/portal/idea/${idea.id}`} className="btn-ghost">
          <MessageCircle className="h-4 w-4" /> {commentsCount}
        </Link>
        <ActionButton ideaId={idea.id} action="bookmark" active={bookmarked} count={idea.bookmarks.length} icon={Bookmark} label="Save" />
      </div>
        </div>
      </div>
    </article>
  );
}

function VoteStack({
  ideaId,
  score,
  upvoted,
  downvoted,
}: {
  ideaId: string;
  score: number;
  upvoted: boolean;
  downvoted: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0 -ml-1">
      <form action={`/api/ideas/${ideaId}/upvote`} method="POST">
        <button
          type="submit"
          aria-label="Upvote"
          title="Upvote"
          className={clsx(
            "grid h-8 w-8 place-items-center rounded-lg border transition",
            upvoted
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-silver-200 text-ink-muted hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/60"
          )}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </form>
      <span
        className={clsx(
          "text-sm font-semibold tabular-nums min-w-[1.5rem] text-center",
          score > 0 && "text-emerald-700",
          score < 0 && "text-rose-600",
          score === 0 && "text-ink-muted"
        )}
      >
        {score}
      </span>
      <form action={`/api/ideas/${ideaId}/downvote`} method="POST">
        <button
          type="submit"
          aria-label="Downvote"
          title="Downvote"
          className={clsx(
            "grid h-8 w-8 place-items-center rounded-lg border transition",
            downvoted
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-silver-200 text-ink-muted hover:border-rose-200 hover:text-rose-700 hover:bg-rose-50/60"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function ActionButton({
  ideaId,
  action,
  active,
  count,
  icon: Icon,
  label,
}: {
  ideaId: string;
  action: "like" | "bookmark";
  active: boolean;
  count: number;
  icon: any;
  label: string;
}) {
  return (
    <form action={`/api/ideas/${ideaId}/${action}`} method="POST" className="contents">
      <button
        type="submit"
        className={clsx(
          "btn-ghost",
          active && action === "like" && "text-rose-600 bg-rose-50/60",
          active && action === "bookmark" && "text-royal-700 bg-royal-50"
        )}
        title={label}
      >
        <Icon className={clsx("h-4 w-4", active && action === "like" && "fill-rose-500")} />
        {count}
      </button>
    </form>
  );
}
