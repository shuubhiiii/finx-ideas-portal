import Link from "next/link";
import clsx from "clsx";
import { Bookmark, Heart, MessageCircle, Lock, Sparkles } from "lucide-react";
import { formatDate, initials, avatarColor } from "@/lib/format";
import type { Idea, User } from "@/lib/db";

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

  return (
    <article className="card card-hover p-5 sm:p-6 animate-fadeUp">
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
            <div className="text-sm font-medium truncate">{author?.name || "Unknown member"}</div>
            <div className="text-xs text-ink-muted truncate">
              {formatDate(idea.createdAt)} · {idea.category}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {idea.visibility === "internal" && (
            <span className="chip"><Lock className="h-3 w-3" /> Internal</span>
          )}
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
            <span key={t} className="chip">#{t}</span>
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
    </article>
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
