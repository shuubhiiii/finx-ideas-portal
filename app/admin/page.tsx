import Link from "next/link";
import { readDB } from "@/lib/db";
import { Shield, Users, Inbox, Sparkles, Layers, Flag } from "lucide-react";

export default function AdminDashboard() {
  const db = readDB();
  const pending = db.requests.filter((r) => r.status === "pending").length;
  const approvedUsers = db.users.filter((u) => u.status === "approved").length;
  const suspended = db.users.filter((u) => u.status === "suspended").length;
  const pendingReports =
    db.ideas.reduce((n, i) => n + (i.reports || []).filter((r) => !r.resolvedAt).length, 0) +
    db.comments.reduce((n, c) => n + (c.reports || []).filter((r) => !r.resolvedAt).length, 0);

  const cards = [
    { href: "/admin/requests", label: "Pending requests", value: pending, icon: Inbox, accent: "from-royal-500 to-royal-700" },
    { href: "/admin/reports", label: "Open reports", value: pendingReports, icon: Flag, accent: "from-rose-500 to-rose-700" },
    { href: "/admin/members", label: "Approved members", value: approvedUsers, icon: Users, accent: "from-emerald-500 to-teal-600" },
    { href: "/admin/ideas", label: "Total ideas", value: db.ideas.length, icon: Sparkles, accent: "from-pink-500 to-rose-600" },
    { href: "/admin/categories", label: "Categories", value: db.categories.length, icon: Layers, accent: "from-amber-500 to-orange-600" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-royal-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Admin overview</h1>
      </div>
      <p className="text-sm text-ink-muted mt-1">Quiet, decisive moderation tools for FinXSystems.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card card-hover p-5">
            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.accent} text-white`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-3xl font-display font-bold">{c.value}</div>
            <div className="text-xs text-ink-muted uppercase tracking-wide mt-0.5">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Link href="/admin/requests" className="card card-hover p-6">
          <div className="font-display text-lg font-semibold">Review pending requests</div>
          <p className="mt-1 text-sm text-ink-muted">
            {pending > 0 ? `${pending} ${pending === 1 ? "person is" : "people are"} waiting for a decision.` : "All clear — no requests waiting."}
          </p>
        </Link>
        <Link href="/admin/members" className="card card-hover p-6">
          <div className="font-display text-lg font-semibold">Manage members</div>
          <p className="mt-1 text-sm text-ink-muted">
            Suspend, reinstate, or change roles. {suspended} currently suspended.
          </p>
        </Link>
      </div>
    </div>
  );
}
