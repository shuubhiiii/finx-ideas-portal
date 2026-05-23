import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import IdeaCard from "@/components/IdeaCard";
import { TrendingUp } from "lucide-react";

export default function TrendingPage() {
  const me = getCurrentUser()!;
  const db = readDB();
  const score = (i: typeof db.ideas[number]) =>
    (i.upvotes?.length || 0) - (i.downvotes?.length || 0) +
    i.likes.length * 0.5 +
    i.bookmarks.length * 0.25;
  const ideas = [...db.ideas].sort((a, b) => score(b) - score(a));
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));
  const commentCount = db.comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.ideaId] = (acc[c.ideaId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-royal-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Trending</h1>
      </div>
      <p className="text-sm text-ink-muted mt-1">What the community is rallying around.</p>
      <div className="mt-7 grid gap-4">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            author={userMap[idea.authorId]}
            commentsCount={commentCount[idea.id] || 0}
            currentUserId={me.id}
          />
        ))}
      </div>
    </div>
  );
}
