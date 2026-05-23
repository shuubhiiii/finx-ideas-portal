import Link from "next/link";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import IdeaCard from "@/components/IdeaCard";
import { Sparkles, Plus } from "lucide-react";

export default function FeedPage({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const me = getCurrentUser()!;
  const db = readDB();
  const q = (searchParams.q || "").trim().toLowerCase();
  const cat = searchParams.cat || "";

  let ideas = [...db.ideas].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  if (cat) ideas = ideas.filter((i) => i.category === cat);
  if (q) {
    ideas = ideas.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.body.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const commentsByIdea = db.comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.ideaId] = (acc[c.ideaId] || 0) + 1;
    return acc;
  }, {});
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="flex items-end justify-between gap-3 mb-5">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Ideas feed</h1>
            <p className="text-sm text-ink-muted mt-1">
              {q ? `Results for “${q}”` : "Fresh thinking from the FinX community."}
            </p>
          </div>
          <Link href="/portal/new" className="btn-primary"><Plus className="h-4 w-4" /> Share an idea</Link>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <Link
            href="/portal"
            className={`chip ${!cat ? "border-royal-200 bg-royal-50 text-royal-700" : ""}`}
          >
            All
          </Link>
          {db.categories.map((c) => (
            <Link
              key={c}
              href={`/portal?cat=${encodeURIComponent(c)}`}
              className={`chip ${cat === c ? "border-royal-200 bg-royal-50 text-royal-700" : ""}`}
            >
              {c}
            </Link>
          ))}
        </div>

        {ideas.length === 0 ? (
          <EmptyState q={q} />
        ) : (
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                author={userMap[idea.authorId]}
                commentsCount={commentsByIdea[idea.id] || 0}
                currentUserId={me.id}
              />
            ))}
          </div>
        )}
      </div>

      <aside className="space-y-5">
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-royal-600" />
            <div className="font-medium">Welcome, {me.name.split(" ")[0]}</div>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            You're in a private room of {db.users.filter((u) => u.status === "approved").length} approved builders.
          </p>
          <Link href="/portal/new" className="btn-primary mt-4 w-full">
            <Plus className="h-4 w-4" /> New idea
          </Link>
        </div>

        <div className="card p-5">
          <div className="label mb-3">Trending right now</div>
          <ul className="space-y-3">
            {[...db.ideas]
              .sort(
                (a, b) =>
                  (b.upvotes?.length || 0) - (b.downvotes?.length || 0) + b.likes.length * 0.5 + b.bookmarks.length * 0.25 -
                  ((a.upvotes?.length || 0) - (a.downvotes?.length || 0) + a.likes.length * 0.5 + a.bookmarks.length * 0.25)
              )
              .slice(0, 4)
              .map((i) => {
                const s = (i.upvotes?.length || 0) - (i.downvotes?.length || 0);
                return (
                  <li key={i.id}>
                    <Link href={`/portal/idea/${i.id}`} className="block text-sm hover:text-royal-700">
                      <div className="font-medium line-clamp-1">{i.title}</div>
                      <div className="text-xs text-ink-muted">
                        {s >= 0 ? `+${s}` : s} votes · {i.likes.length} reactions · {i.category}
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>

        <div className="card p-5">
          <div className="label mb-3">Categories</div>
          <div className="flex flex-wrap gap-1.5">
            {db.categories.map((c) => (
              <Link key={c} href={`/portal?cat=${encodeURIComponent(c)}`} className="chip hover:border-royal-200 hover:bg-royal-50 hover:text-royal-700">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function EmptyState({ q }: { q: string }) {
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-royal-50 text-royal-700 border border-royal-100">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">No ideas {q ? "matched your search" : "yet"}</h3>
      <p className="mt-1 text-sm text-ink-muted">Be the spark — share what you're thinking about.</p>
      <Link href="/portal/new" className="btn-primary mt-5"><Plus className="h-4 w-4" /> Share an idea</Link>
    </div>
  );
}
