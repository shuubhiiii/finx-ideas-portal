import clsx from "clsx";
import { readDB } from "@/lib/db";
import { initials, avatarColor } from "@/lib/format";
import { Layers, Users } from "lucide-react";

export default function SpacesPage() {
  const db = readDB();
  const userMap = Object.fromEntries(db.users.map((u) => [u.id, u]));

  return (
    <div>
      <div className="flex items-center gap-3">
        <Layers className="h-6 w-6 text-royal-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Collaboration spaces</h1>
      </div>
      <p className="text-sm text-ink-muted mt-1">Small, focused teams turning ideas into prototypes.</p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {db.spaces.map((s) => (
          <div key={s.id} className="card card-hover p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{s.name}</h3>
              <span className="chip-royal"><Users className="h-3.5 w-3.5" /> {s.members.length}</span>
            </div>
            <p className="mt-2 text-sm text-ink-muted">{s.description}</p>
            <div className="mt-5 flex -space-x-2">
              {s.members.map((id) => {
                const u = userMap[id];
                return (
                  <div
                    key={id}
                    title={u?.name}
                    className={clsx(
                      "grid h-8 w-8 place-items-center rounded-full text-white text-xs font-semibold bg-gradient-to-br ring-2 ring-white",
                      avatarColor(id)
                    )}
                  >
                    {u ? initials(u.name) : "??"}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button className="btn-secondary">Request to join</button>
              <button className="btn-ghost">View posts</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
