import Link from "next/link";
import { readDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Trash2 } from "lucide-react";

export default function AdminIdeasPage() {
  const db = readDB();
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));
  const ideas = [...db.ideas].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Ideas</h1>
      <p className="text-sm text-ink-muted mt-1">Moderate content posted across the portal.</p>

      <div className="mt-7 card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-silver-50 text-ink-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-left px-5 py-3">Author</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Visibility</th>
              <th className="text-left px-5 py-3">Posted</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((i) => (
              <tr key={i.id} className="border-t border-silver-200">
                <td className="px-5 py-4 max-w-md">
                  <Link href={`/portal/idea/${i.id}`} className="font-medium hover:text-royal-700">{i.title}</Link>
                </td>
                <td className="px-5 py-4 text-ink-muted">{userMap[i.authorId]?.name || "—"}</td>
                <td className="px-5 py-4"><span className="chip-royal">{i.category}</span></td>
                <td className="px-5 py-4 capitalize text-ink-muted">{i.visibility}</td>
                <td className="px-5 py-4 text-ink-muted">{formatDate(i.createdAt)}</td>
                <td className="px-5 py-4 text-right">
                  <form action={`/api/admin/ideas/${i.id}/delete`} method="POST" className="inline">
                    <button className="btn-ghost text-rose-600 text-xs"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
