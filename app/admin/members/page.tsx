import clsx from "clsx";
import { readDB } from "@/lib/db";
import { initials, avatarColor, formatDate } from "@/lib/format";

export default function AdminMembersPage() {
  const db = readDB();
  const members = db.users;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Members</h1>
      <p className="text-sm text-ink-muted mt-1">Suspend or reinstate accounts and oversee activity.</p>

      <div className="mt-7 card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-silver-50 text-ink-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Member</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-silver-200">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={clsx("grid h-9 w-9 place-items-center rounded-full text-white text-xs font-semibold bg-gradient-to-br", avatarColor(m.id))}>
                      {initials(m.name)}
                    </div>
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-ink-muted">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 capitalize">{m.role}</td>
                <td className="px-5 py-4">
                  <span className={clsx(
                    "chip",
                    m.status === "approved" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                    m.status === "suspended" && "border-amber-200 bg-amber-50 text-amber-700",
                    m.status === "pending" && "border-silver-200",
                    m.status === "rejected" && "border-rose-200 bg-rose-50 text-rose-700"
                  )}>
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink-muted">{formatDate(m.joinedAt)}</td>
                <td className="px-5 py-4 text-right">
                  {m.role !== "admin" && (
                    <form action={`/api/admin/members/${m.id}/${m.status === "suspended" ? "reinstate" : "suspend"}`} method="POST" className="inline">
                      <button className="btn-ghost text-xs">
                        {m.status === "suspended" ? "Reinstate" : "Suspend"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
