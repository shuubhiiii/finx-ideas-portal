import clsx from "clsx";
import { readDB } from "@/lib/db";
import { initials, avatarColor } from "@/lib/format";
import { Users, Link2 } from "lucide-react";

export default function MembersPage() {
  const db = readDB();
  const members = db.users.filter((u) => u.status === "approved");
  const ideasByUser = db.ideas.reduce<Record<string, number>>((acc, i) => {
    acc[i.authorId] = (acc[i.authorId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-royal-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Members</h1>
      </div>
      <p className="text-sm text-ink-muted mt-1">{members.length} approved innovators in the room.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div key={m.id} className="card card-hover p-5">
            <div className="flex items-center gap-3">
              <div className={clsx("grid h-12 w-12 place-items-center rounded-full text-white text-sm font-semibold bg-gradient-to-br", avatarColor(m.id))}>
                {initials(m.name)}
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{m.name}</div>
                <div className="text-xs text-ink-muted truncate">{m.email}</div>
              </div>
              {m.role === "admin" && <span className="chip-royal ml-auto">Admin</span>}
            </div>
            {m.bio && <p className="mt-3 text-sm text-ink-muted line-clamp-2">{m.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {m.skills.split(",").slice(0, 3).map((s) => (
                <span key={s} className="chip">{s.trim()}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
              <span>{ideasByUser[m.id] || 0} ideas</span>
              {m.link && (
                <a href={m.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-royal-700">
                  <Link2 className="h-3.5 w-3.5" /> Profile
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
