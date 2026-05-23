import Link from "next/link";
import { readDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Check, X, Link2 } from "lucide-react";

export default function AdminRequestsPage() {
  const db = readDB();
  const pending = db.requests.filter((r) => r.status === "pending");
  const processed = db.requests.filter((r) => r.status !== "pending").slice(-10).reverse();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Access requests</h1>
      <p className="text-sm text-ink-muted mt-1">Manually approve or reject each applicant.</p>

      <h2 className="font-display text-lg font-semibold mt-8">Pending ({pending.length})</h2>
      <div className="mt-3 grid gap-3">
        {pending.length === 0 && <div className="card p-6 text-sm text-ink-muted">No pending requests.</div>}
        {pending.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-ink-muted">{r.email} · {formatDate(r.createdAt)}</div>
                <div className="mt-3 text-sm"><span className="label">Skills:</span> {r.skills}</div>
                <div className="mt-2 text-sm"><span className="label">Why:</span> {r.reason}</div>
                {r.link && (
                  <a href={r.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-royal-700 hover:underline">
                    <Link2 className="h-3.5 w-3.5" /> {r.link}
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <form action={`/api/admin/requests/${r.id}/approve`} method="POST">
                  <button className="btn-primary"><Check className="h-4 w-4" /> Approve</button>
                </form>
                <form action={`/api/admin/requests/${r.id}/reject`} method="POST">
                  <button className="btn-secondary text-rose-700 border-rose-200 hover:bg-rose-50"><X className="h-4 w-4" /> Reject</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold mt-10">Recently processed</h2>
      <div className="mt-3 grid gap-2">
        {processed.length === 0 && <div className="text-sm text-ink-muted">Nothing processed yet.</div>}
        {processed.map((r) => (
          <div key={r.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{r.name} · <span className="text-ink-muted">{r.email}</span></div>
              <div className="text-xs text-ink-muted">{formatDate(r.createdAt)}</div>
            </div>
            <span className={`chip ${r.status === "approved" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
