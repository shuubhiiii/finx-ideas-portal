import Link from "next/link";
import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import IdeaCard from "@/components/IdeaCard";
import { ArrowLeft, Hash } from "lucide-react";

export default function TagPage({ params }: { params: { tag: string } }) {
  const me = getCurrentUser()!;
  const db = readDB();
  const tag = decodeURIComponent(params.tag).toLowerCase();
  if (!tag) return notFound();

  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));
  const commentsByIdea = db.comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.ideaId] = (acc[c.ideaId] || 0) + 1;
    return acc;
  }, {});

  const ideas = db.ideas
    .filter((i) => i.tags.some((t) => t.toLowerCase() === tag))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  // Related tags that co-occur on these ideas
  const relatedCounts: Record<string, number> = {};
  for (const i of ideas) {
    for (const t of i.tags) {
      if (t.toLowerCase() === tag) continue;
      relatedCounts[t] = (relatedCounts[t] || 0) + 1;
    }
  }
  const related = Object.entries(relatedCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="max-w-3xl">
      <Link href="/portal" className="btn-ghost -ml-2 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </Link>

      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-royal-50 text-royal-700 border border-royal-100">
          <Hash className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">#{tag}</h1>
          <p className="text-sm text-ink-muted">{ideas.length} {ideas.length === 1 ? "idea" : "ideas"} tagged.</p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          <span className="text-xs text-ink-muted mr-1 self-center">Related:</span>
          {related.map(([t, n]) => (
            <Link key={t} href={`/portal/tag/${encodeURIComponent(t)}`} className="chip hover:border-royal-200 hover:bg-royal-50 hover:text-royal-700">
              #{t} <span className="text-ink-muted">{n}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {ideas.length === 0 ? (
          <div className="card p-8 text-center text-sm text-ink-muted">No ideas tagged with #{tag}.</div>
        ) : (
          ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              author={userMap[idea.authorId]}
              commentsCount={commentsByIdea[idea.id] || 0}
              currentUserId={me.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
