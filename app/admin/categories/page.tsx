import { readDB } from "@/lib/db";
import { Layers } from "lucide-react";

export default function AdminCategoriesPage() {
  const db = readDB();
  const usage = db.ideas.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <Layers className="h-6 w-6 text-royal-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Categories</h1>
      </div>
      <p className="text-sm text-ink-muted mt-1">Curate the spaces the community can post into.</p>

      <form action="/api/admin/categories" method="POST" className="mt-7 card p-5 flex gap-2">
        <input name="name" required className="input" placeholder="New category name…" />
        <button className="btn-primary">Add</button>
      </form>

      <div className="mt-5 grid gap-2">
        {db.categories.map((c) => (
          <div key={c} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c}</div>
              <div className="text-xs text-ink-muted">{usage[c] || 0} ideas</div>
            </div>
            <form action={`/api/admin/categories/${encodeURIComponent(c)}/delete`} method="POST">
              <button className="btn-ghost text-rose-600 text-xs" disabled={(usage[c] || 0) > 0} title={(usage[c] || 0) > 0 ? "Has ideas — cannot delete" : "Delete"}>
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
