import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { initials, avatarColor, formatDate } from "@/lib/format";
import IdeaCard from "@/components/IdeaCard";
import { renderMarkdown } from "@/lib/markdown";
import {
  User as UserIcon, UserPlus, UserCheck, Link2, Lightbulb, MessageSquare,
  Heart, Bookmark, Sparkles, Calendar,
} from "lucide-react";

export default function PublicProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const db = readDB();
  const me = getCurrentUser()!;
  const user = db.users.find((u) => u.id === params.id);
  if (!user || user.status !== "approved") notFound();

  const isMe = user.id === me.id;
  const tab = searchParams.tab || "ideas";

  const visibleIdeas = db.ideas.filter(
    (i) => i.authorId === user.id && (i.visibility !== "internal" || me.id),
  );
  const myComments = db.comments.filter((c) => c.authorId === user.id);
  const commentsByIdea = db.comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.ideaId] = (acc[c.ideaId] || 0) + 1;
    return acc;
  }, {});

  const totalScore = visibleIdeas.reduce(
    (sum, i) => sum + ((i.upvotes?.length || 0) - (i.downvotes?.length || 0)),
    0,
  );
  const followers = db.users.filter((u) => (u.following || []).includes(user.id)).length;
  const followingCount = (user.following || []).length;
  const iFollow = (me.following || []).includes(user.id);

  const savedIdeas = isMe
    ? db.ideas.filter((i) => i.bookmarks.includes(me.id))
    : [];

  return (
    <div className="max-w-4xl">
      <div className="card p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <div className={clsx(
            "grid h-20 w-20 place-items-center rounded-2xl text-white text-xl font-semibold bg-gradient-to-br shrink-0",
            avatarColor(user.id),
          )}>
            {initials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="font-display text-2xl font-bold">{user.name}</h1>
                <div className="text-sm text-ink-muted">{user.email}</div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="chip-royal">{user.role === "admin" ? "Admin" : "Member"}</span>
                  <span className="chip inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined {formatDate(user.joinedAt)}
                  </span>
                  {user.link && (
                    <a href={user.link} target="_blank" rel="noreferrer" className="chip hover:bg-silver-100 inline-flex items-center gap-1">
                      <Link2 className="h-3 w-3" /> Link
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isMe ? (
                  <Link href="/portal/profile" className="btn-ghost">
                    <UserIcon className="h-4 w-4" /> Edit profile
                  </Link>
                ) : (
                  <form action={`/api/users/${user.id}/follow`} method="POST">
                    <button
                      type="submit"
                      className={clsx(
                        "btn-primary",
                        iFollow && "!bg-white !text-royal-700 !border !border-royal-200",
                      )}
                    >
                      {iFollow ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      {iFollow ? "Following" : "Follow"}
                    </button>
                  </form>
                )}
              </div>
            </div>
            {user.bio && <p className="mt-4 text-sm text-ink-muted">{user.bio}</p>}
            {user.skills && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {user.skills.split(",").map((s) => (
                  <span key={s} className="chip">{s.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon={Lightbulb} label="Ideas" value={visibleIdeas.length} />
          <Stat icon={Sparkles} label="Total score" value={totalScore} />
          <Stat icon={UserCheck} label="Followers" value={followers} />
          <Stat icon={UserPlus} label="Following" value={followingCount} />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 border-b border-silver-200">
        <TabLink id={user.id} tab={tab} target="ideas" label={`Ideas (${visibleIdeas.length})`} />
        <TabLink id={user.id} tab={tab} target="comments" label={`Comments (${myComments.length})`} />
        {isMe && (
          <TabLink id={user.id} tab={tab} target="saved" label={`Saved (${savedIdeas.length})`} />
        )}
      </div>

      <div className="mt-5">
        {tab === "comments" ? (
          <div className="grid gap-3">
            {myComments.length === 0 && (
              <div className="card p-6 text-sm text-ink-muted">No comments yet.</div>
            )}
            {myComments
              .slice()
              .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
              .map((c) => {
                const idea = db.ideas.find((i) => i.id === c.ideaId);
                return (
                  <Link
                    key={c.id}
                    href={`/portal/idea/${c.ideaId}#comments`}
                    className="card card-hover p-4"
                  >
                    <div className="text-xs text-ink-muted">
                      <MessageSquare className="h-3 w-3 inline mr-1" />
                      on <span className="font-medium text-ink">{idea?.title || "(deleted idea)"}</span>{" "}
                      · {formatDate(c.createdAt)}
                    </div>
                    <div
                      className="prose-soft mt-2 text-sm"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(c.body, db.users) }}
                    />
                  </Link>
                );
              })}
          </div>
        ) : tab === "saved" && isMe ? (
          <div className="grid gap-4">
            {savedIdeas.length === 0 && (
              <div className="card p-6 text-sm text-ink-muted">No saved ideas yet.</div>
            )}
            {savedIdeas.map((i) => (
              <IdeaCard
                key={i.id}
                idea={i}
                author={db.users.find((u) => u.id === i.authorId)}
                commentsCount={commentsByIdea[i.id] || 0}
                currentUserId={me.id}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleIdeas.length === 0 && (
              <div className="card p-6 text-sm text-ink-muted">No ideas yet.</div>
            )}
            {visibleIdeas
              .slice()
              .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
              .map((i) => (
                <IdeaCard
                  key={i.id}
                  idea={i}
                  author={user}
                  commentsCount={commentsByIdea[i.id] || 0}
                  currentUserId={me.id}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon, label, value,
}: { icon: any; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-silver-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-xl font-display font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function TabLink({
  id, tab, target, label,
}: { id: string; tab: string; target: string; label: string }) {
  const active = tab === target;
  return (
    <Link
      href={`/portal/profile/${id}${target === "ideas" ? "" : `?tab=${target}`}`}
      className={clsx(
        "px-3 py-2 text-sm border-b-2 -mb-px transition",
        active
          ? "border-royal-600 text-royal-700 font-medium"
          : "border-transparent text-ink-muted hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}
