import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft, Save, Globe2, Lock } from "lucide-react";

export default function EditIdeaPage({ params }: { params: { id: string } }) {
  const me = getCurrentUser();
  if (!me) redirect("/login");
  const db = readDB();
  const idea = db.ideas.find((i) => i.id === params.id);
  if (!idea) return notFound();
  if (idea.authorId !== me.id && me.role !== "admin") redirect(`/portal/idea/${idea.id}`);

  return (
    <div className="max-w-3xl">
      <Link href={`/portal/idea/${idea.id}`} className="btn-ghost -ml-2 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to idea
      </Link>

      <div className="card p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Edit idea</h1>
        <p className="text-sm text-ink-muted mt-1">Update your idea. Changes are visible to the community immediately.</p>

        <form action={`/api/ideas/${idea.id}/edit`} method="POST" className="mt-6 grid gap-5">
          <div>
            <label className="label">Title</label>
            <input name="title" required defaultValue={idea.title} className="input mt-1.5" />
          </div>

          <div>
            <label className="label">The idea</label>
            <textarea name="body" required rows={9} defaultValue={idea.body} className="input mt-1.5 resize-none" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Category</label>
              <select name="category" required defaultValue={idea.category} className="input mt-1.5">
                {db.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <input name="tags" defaultValue={idea.tags.join(", ")} className="input mt-1.5" />
            </div>
          </div>

          <fieldset>
            <legend className="label mb-2">Visibility</legend>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="card p-4 cursor-pointer has-[:checked]:border-royal-400 has-[:checked]:ring-4 has-[:checked]:ring-royal-100 transition">
                <div className="flex items-start gap-3">
                  <input type="radio" name="visibility" value="community" defaultChecked={idea.visibility === "community"} className="mt-1 accent-royal-600" />
                  <div>
                    <div className="flex items-center gap-2 font-medium"><Globe2 className="h-4 w-4 text-royal-600" /> Community</div>
                    <div className="text-xs text-ink-muted mt-1">Visible to every approved member.</div>
                  </div>
                </div>
              </label>
              <label className="card p-4 cursor-pointer has-[:checked]:border-royal-400 has-[:checked]:ring-4 has-[:checked]:ring-royal-100 transition">
                <div className="flex items-start gap-3">
                  <input type="radio" name="visibility" value="internal" defaultChecked={idea.visibility === "internal"} className="mt-1 accent-royal-600" />
                  <div>
                    <div className="flex items-center gap-2 font-medium"><Lock className="h-4 w-4 text-royal-600" /> Internal</div>
                    <div className="text-xs text-ink-muted mt-1">Marked as internal — for sensitive ideas.</div>
                  </div>
                </div>
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Link href={`/portal/idea/${idea.id}`} className="btn-secondary">Cancel</Link>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
