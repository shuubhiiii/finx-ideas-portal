import Link from "next/link";
import { readDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, initials, avatarColor } from "@/lib/format";
import clsx from "clsx";
import {
  Bell, MessageSquare, AtSign, Heart, ListChecks, Reply, CheckCheck, ArrowRight,
} from "lucide-react";

const TYPE_META: Record<string, { icon: typeof Bell; label: string; color: string }> = {
  comment_on_idea: { icon: MessageSquare, label: "commented on your idea", color: "text-royal-700 bg-royal-50" },
  reply_to_comment: { icon: Reply, label: "replied to your comment", color: "text-sky-700 bg-sky-50" },
  mention: { icon: AtSign, label: "mentioned you", color: "text-violet-700 bg-violet-50" },
  status_change: { icon: ListChecks, label: "updated status of your idea", color: "text-emerald-700 bg-emerald-50" },
  comment_like: { icon: Heart, label: "liked your comment", color: "text-rose-600 bg-rose-50" },
};

export default function NotificationsPage() {
  const me = getCurrentUser()!;
  const db = readDB();
  const all = (db.notifications || [])
    .filter((n) => n.userId === me.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));
  const unread = all.filter((n) => !n.readAt).length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-royal-600" /> Notifications
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {unread === 0 ? "You're all caught up." : `${unread} unread`}
          </p>
        </div>
        {unread > 0 && (
          <form action="/api/notifications/read-all" method="POST">
            <button type="submit" className="btn-secondary">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          </form>
        )}
      </div>

      <div className="grid gap-2">
        {all.length === 0 && (
          <div className="card p-10 text-center text-sm text-ink-muted">
            No notifications yet. Activity on your ideas and comments will appear here.
          </div>
        )}
        {all.map((n) => {
          const meta = TYPE_META[n.type] || { icon: Bell, label: n.type, color: "text-ink bg-silver-100" };
          const Icon = meta.icon;
          const from = n.fromUserId ? userMap[n.fromUserId] : undefined;
          const href = n.ideaId
            ? n.commentId
              ? `/portal/idea/${n.ideaId}#comments`
              : `/portal/idea/${n.ideaId}`
            : "/portal";
          return (
            <div
              key={n.id}
              className={clsx(
                "card p-4 flex items-start gap-3",
                !n.readAt && "border-royal-200 bg-royal-50/30"
              )}
            >
              <div className={clsx("grid h-9 w-9 place-items-center rounded-full shrink-0", meta.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  {from && (
                    <span
                      className={clsx(
                        "inline-grid h-5 w-5 align-middle place-items-center rounded-full text-white text-[10px] font-semibold bg-gradient-to-br mr-1.5",
                        avatarColor(from.id)
                      )}
                      title={from.name}
                    >
                      {initials(from.name)}
                    </span>
                  )}
                  <span className="font-medium">{from?.name || "Someone"}</span>{" "}
                  <span className="text-ink-muted">{meta.label}</span>
                  {n.text && <span className="text-ink"> — “{n.text}”</span>}
                </div>
                <div className="mt-1 text-xs text-ink-muted">{formatDate(n.createdAt)}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!n.readAt && (
                  <form action="/api/notifications/read" method="POST">
                    <input type="hidden" name="id" value={n.id} />
                    <button type="submit" className="btn-ghost p-2" title="Mark as read">
                      <CheckCheck className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}
                <Link href={href} className="btn-ghost p-2" title="Open">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
