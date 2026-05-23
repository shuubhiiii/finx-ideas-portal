"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertTriangle, Lock, Globe2, FileText, Trash2 } from "lucide-react";

const DRAFT_KEY = "finx-idea-draft-v1";

export default function NewIdeaForm({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<{ id: string; title: string }[]>([]);
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Restore draft on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      const f = formRef.current;
      if (!f) return;
      const setVal = (name: string, v: string) => {
        const el = f.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | RadioNodeList | null;
        if (!el) return;
        if (el instanceof RadioNodeList) {
          for (const node of Array.from(el)) {
            const r = node as HTMLInputElement;
            r.checked = r.value === v;
          }
        } else {
          (el as HTMLInputElement).value = v;
        }
      };
      if (d.title || d.body) {
        setVal("title", d.title || "");
        setVal("body", d.body || "");
        if (d.category) setVal("category", d.category);
        if (d.tags) setVal("tags", d.tags);
        if (d.visibility) setVal("visibility", d.visibility);
        setDraftRestored(true);
      }
    } catch {}
  }, []);

  function saveDraft() {
    const f = formRef.current;
    if (!f) return;
    const fd = new FormData(f);
    const data = {
      title: String(fd.get("title") || ""),
      body: String(fd.get("body") || ""),
      category: String(fd.get("category") || ""),
      tags: String(fd.get("tags") || ""),
      visibility: String(fd.get("visibility") || "community"),
    };
    if (!data.title && !data.body) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {}
  }

  function discardDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    const f = formRef.current;
    if (f) f.reset();
    setDraftRestored(false);
    setSummary(null);
    setDuplicates([]);
  }

  async function generateAI(title: string, body: string) {
    if (!title || !body) return;
    setAiBusy(true);
    try {
      const res = await fetch("/api/ideas/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      setSummary(data.summary);
      setDuplicates(data.duplicates || []);
    } finally {
      setAiBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") || ""),
      body: String(fd.get("body") || ""),
      category: String(fd.get("category") || ""),
      tags: String(fd.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      visibility: String(fd.get("visibility") || "community"),
    };
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not publish");
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      router.push(`/portal/idea/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} onChange={saveDraft} className="grid gap-5">
      {draftRestored && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Restored an unfinished draft.
          </div>
          <button type="button" onClick={discardDraft} className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-900 text-xs font-medium">
            <Trash2 className="h-3.5 w-3.5" /> Discard
          </button>
        </div>
      )}
      <div>
        <label className="label">Title</label>
        <input
          name="title"
          required
          className="input mt-1.5"
          placeholder="Give your idea a clear, intriguing title"
          onBlur={(e) => {
            const body = (document.querySelector('[name="body"]') as HTMLTextAreaElement)?.value || "";
            if (e.target.value && body) generateAI(e.target.value, body);
          }}
        />
      </div>

      <div>
        <label className="label">The idea</label>
        <textarea
          name="body"
          required
          rows={9}
          className="input mt-1.5 resize-none"
          placeholder="Describe the idea, the why, the risks, what you'd want from collaborators…"
          onBlur={(e) => {
            const title = (document.querySelector('[name="title"]') as HTMLInputElement)?.value || "";
            if (title && e.target.value) generateAI(title, e.target.value);
          }}
        />
      </div>

      {(aiBusy || summary) && (
        <div className="rounded-xl border border-royal-100 bg-royal-50/60 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-royal-700 font-medium">
            <Sparkles className="h-4 w-4" />
            AI summary
          </div>
          <div className="mt-1 text-royal-900/80">{aiBusy ? "Summarising…" : summary}</div>
        </div>
      )}

      {duplicates.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-amber-800 font-medium">
            <AlertTriangle className="h-4 w-4" />
            Similar ideas exist
          </div>
          <ul className="mt-2 space-y-1.5">
            {duplicates.map((d) => (
              <li key={d.id}>
                <a href={`/portal/idea/${d.id}`} className="underline-offset-2 hover:underline text-amber-900">
                  • {d.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-xs text-amber-700">Consider joining the discussion there, or publish a new angle here.</div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Category</label>
          <select name="category" required className="input mt-1.5" defaultValue={categories[0]}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tags (comma separated)</label>
          <input name="tags" className="input mt-1.5" placeholder="agents, underwriting, ops" />
        </div>
      </div>

      <fieldset>
        <legend className="label mb-2">Visibility</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="card p-4 cursor-pointer has-[:checked]:border-royal-400 has-[:checked]:ring-4 has-[:checked]:ring-royal-100 transition">
            <div className="flex items-start gap-3">
              <input type="radio" name="visibility" value="community" defaultChecked className="mt-1 accent-royal-600" />
              <div>
                <div className="flex items-center gap-2 font-medium"><Globe2 className="h-4 w-4 text-royal-600" /> Community</div>
                <div className="text-xs text-ink-muted mt-1">Visible to every approved member.</div>
              </div>
            </div>
          </label>
          <label className="card p-4 cursor-pointer has-[:checked]:border-royal-400 has-[:checked]:ring-4 has-[:checked]:ring-royal-100 transition">
            <div className="flex items-start gap-3">
              <input type="radio" name="visibility" value="internal" className="mt-1 accent-royal-600" />
              <div>
                <div className="flex items-center gap-2 font-medium"><Lock className="h-4 w-4 text-royal-600" /> Internal</div>
                <div className="text-xs text-ink-muted mt-1">Marked as internal — for sensitive ideas.</div>
              </div>
            </div>
          </label>
        </div>
      </fieldset>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={() => history.back()} className="btn-secondary">Cancel</button>
        <button disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Publishing…" : "Publish idea"}
        </button>
      </div>
    </form>
  );
}
