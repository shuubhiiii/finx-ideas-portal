import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import IdeaCard from "@/components/IdeaCard";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const me = getCurrentUser()!;
  const db = readDB();
  const ideas = db.ideas.filter((i) => i.bookmarks.includes(me.id));
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));
  const commentCount = db.comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.ideaId] = (acc[c.ideaId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-royal-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Saved ideas</h1>
      </div>
      <p className="text-sm text-ink-muted mt-1">Your private shelf — only you see this.</p>
      <div className="mt-7 grid gap-4">
        {ideas.length === 0 && (
          <div className="card p-10 text-center text-sm text-ink-muted">You haven't saved any ideas yet.</div>
        )}
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
