import Link from "next/link";
import { readDB } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Flag, CheckCircle, Lightbulb, MessageSquare, ExternalLink } from "lucide-react";

export default function AdminReportsPage({
  searchParams,
}: {
  searchParams: { show?: string };
}) {
  const show = searchParams.show === "all" ? "all" : "pending";
  const db = readDB();
  const userById = new Map(db.users.map((u) => [u.id, u]));

  type Row = {
    kind: "idea" | "comment";
    reportId: string;
    reason: string;
    createdAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
    reporterId: string;
    ideaId: string;
    commentId?: string;
    targetTitle: string;
    targetBody: string;
    targetAuthorId: string;
  };

  const rows: Row[] = [];
  for (const i of db.ideas) {
    for (const r of i.reports || []) {
      rows.push({
        kind: "idea",
        reportId: r.id,
        reason: r.reason,
        createdAt: r.createdAt,
        resolvedAt: r.resolvedAt,
        resolvedBy: r.resolvedBy,
        reporterId: r.reporterId,
        ideaId: i.id,
        targetTitle: i.title,
        targetBody: i.body.slice(0, 240),
        targetAuthorId: i.authorId,
      });
    }
  }
  for (const c of db.comments) {
    for (const r of c.reports || []) {
      const idea = db.ideas.find((i) => i.id === c.ideaId);
      rows.push({
        kind: "comment",
        reportId: r.id,
        reason: r.reason,
        createdAt: r.createdAt,
        resolvedAt: r.resolvedAt,
        resolvedBy: r.resolvedBy,
        reporterId: r.reporterId,
        ideaId: c.ideaId,
        commentId: c.id,
        targetTitle: idea?.title || "(deleted idea)",
        targetBody: c.body.slice(0, 240),
        targetAuthorId: c.authorId,
      });
    }
  }

  const filtered = rows.filter((r) => (show === "pending" ? !r.resolvedAt : true));
  filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const pendingCount = rows.filter((r) => !r.resolvedAt).length;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Flag className="h-6 w-6 text-rose-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Reports</h1>
      </div>
      <p className="text-sm text-ink-muted mt-1">
        {pendingCount} pending {pendingCount === 1 ? "report" : "reports"}.
      </p>

      <div className="mt-5 flex items-center gap-2">
        <Link
          href="/admin/reports"
          className={`chip ${show === "pending" ? "chip-royal" : "hover:bg-silver-100"}`}
        >
          Pending ({pendingCount})
        </Link>
        <Link
          href="/admin/reports?show=all"
          className={`chip ${show === "all" ? "chip-royal" : "hover:bg-silver-100"}`}
        >
          All ({rows.length})
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        {filtered.length === 0 && (
          <div className="card p-6 text-sm text-ink-muted">
            No reports {show === "pending" ? "to review" : "yet"}.
          </div>
        )}
        {filtered.map((r) => {
          const reporter = userById.get(r.reporterId);
          const targetAuthor = userById.get(r.targetAuthorId);
          const link = r.commentId
            ? `/portal/idea/${r.ideaId}#comments`
            : `/portal/idea/${r.ideaId}`;
          return (
            <div key={`${r.kind}-${r.reportId}`} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    {r.kind === "idea" ? (
                      <Lightbulb className="h-3.5 w-3.5" />
                    ) : (
                      <MessageSquare className="h-3.5 w-3.5" />
                    )}
                    Reported {r.kind} · {formatDate(r.createdAt)}
                    {r.resolvedAt && (
                      <span className="chip text-emerald-700 bg-emerald-50">
                        Resolved {formatDate(r.resolvedAt)}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-medium">{r.targetTitle}</div>
                  <div className="text-sm text-ink-muted mt-1 line-clamp-3 whitespace-pre-wrap">
                    {r.targetBody}
                  </div>
                  <div className="mt-3 rounded-xl bg-rose-50/70 border border-rose-100 px-3 py-2 text-sm">
                    <span className="text-rose-700 font-medium">Reason: </span>
                    <span className="text-ink">{r.reason}</span>
                  </div>
                  <div className="mt-3 text-xs text-ink-muted">
                    Reporter:{" "}
                    <Link href={`/portal/profile/${r.reporterId}`} className="hover:text-royal-700">
                      {reporter?.name || "Unknown"}
                    </Link>
                    {" · "}Author of {r.kind}:{" "}
                    <Link href={`/portal/profile/${r.targetAuthorId}`} className="hover:text-royal-700">
                      {targetAuthor?.name || "Unknown"}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link href={link} className="btn-ghost text-xs">
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Link>
                  {!r.resolvedAt && (
                    <form action={`/api/admin/reports/${r.kind}/${r.reportId}`} method="POST">
                      <button type="submit" className="btn-primary text-xs w-full">
                        <CheckCircle className="h-3.5 w-3.5" /> Resolve
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
