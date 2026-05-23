import Link from "next/link";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import IdeaCard from "@/components/IdeaCard";
import { Sparkles, Plus, Clock, Flame, Trophy, MessagesSquare } from "lucide-react";

type SortKey = "new" | "top_week" | "top" | "discussed";
const SORTS: { key: SortKey; label: string; icon: typeof Clock }[] = [
  { key: "new", label: "New", icon: Clock },
  { key: "top_week", label: "Top this week", icon: Flame },
  { key: "top", label: "Top all time", icon: Trophy },
  { key: "discussed", label: "Most discussed", icon: MessagesSquare },
];

export default function FeedPage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string; sort?: string };
}) {
  const me = getCurrentUser()!;
  const db = readDB();
  const q = (searchParams.q || "").trim().toLowerCase();
  const cat = searchParams.cat || "";
  const sort = (SORTS.find((s) => s.key === searchParams.sort)?.key || "new") as SortKey;

  const commentsByIdea = db.comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.ideaId] = (acc[c.ideaId] || 0) + 1;
    return acc;
  }, {});
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));
  const score = (i: (typeof db.ideas)[number]) =>
    (i.upvotes?.length || 0) - (i.downvotes?.length || 0) + i.likes.length * 0.5 + i.bookmarks.length * 0.25;

  let ideas = [...db.ideas];
  if (cat) ideas = ideas.filter((i) => i.category === cat);
  if (q) {
    ideas = ideas.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.body.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === "new") {
    ideas.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } else if (sort === "top") {
    ideas.sort((a, b) => score(b) - score(a));
  } else if (sort === "top_week") {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    ideas = ideas.filter((i) => +new Date(i.createdAt) >= weekAgo);
    ideas.sort((a, b) => score(b) - score(a));
  } else if (sort === "discussed") {
    ideas.sort((a, b) => (commentsByIdea[b.id] || 0) - (commentsByIdea[a.id] || 0));
  }

  // Pinned ideas float to the top regardless of sort
  ideas.sort((a, b) => Number(b.pinned || false) - Number(a.pinned || false));

  const buildQs = (overrides: Partial<{ sort: SortKey; cat: string; q: string }>) => {
    const params = new URLSearchParams();
    const next = { sort, cat, q, ...overrides };
    if (next.sort && next.sort !== "new") params.set("sort", next.sort);
    if (next.cat) params.set("cat", next.cat);
    if (next.q) params.set("q", next.q);
    const s = params.toString();
    return s ? `/portal?${s}` : "/portal";
  };

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

        {/* Sort tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5 border-b border-silver-200">
          {SORTS.map((s) => {
            const active = s.key === sort;
            const Icon = s.icon;
            return (
              <Link
                key={s.key}
                href={buildQs({ sort: s.key })}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 -mb-px ${
                  active
                    ? "border-royal-600 text-royal-700 font-medium"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" /> {s.label}
              </Link>
            );
          })}
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <Link
            href={buildQs({ cat: "" })}
            className={`chip ${!cat ? "border-royal-200 bg-royal-50 text-royal-700" : ""}`}
          >
            All
          </Link>
          {db.categories.map((c) => (
            <Link
              key={c}
              href={buildQs({ cat: c })}
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
              .sort((a, b) => score(b) - score(a))
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
          <div className="label mb-3">Popular tags</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(
              db.ideas.reduce<Record<string, number>>((acc, i) => {
                for (const t of i.tags) acc[t] = (acc[t] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12)
              .map(([t, n]) => (
                <Link
                  key={t}
                  href={`/portal/tag/${encodeURIComponent(t)}`}
                  className="chip hover:border-royal-200 hover:bg-royal-50 hover:text-royal-700"
                >
                  #{t} <span className="text-ink-muted">{n}</span>
                </Link>
              ))}
            {db.ideas.every((i) => i.tags.length === 0) && (
              <div className="text-xs text-ink-muted">No tags yet.</div>
            )}
          </div>
        </div>

        <div className="card p-5">
          <div className="label mb-3">Categories</div>
          <div className="flex flex-wrap gap-1.5">
            {db.categories.map((c) => (
              <Link key={c} href={buildQs({ cat: c })} className="chip hover:border-royal-200 hover:bg-royal-50 hover:text-royal-700">
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
