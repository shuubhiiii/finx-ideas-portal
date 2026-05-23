import clsx from "clsx";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { initials, avatarColor, formatDate } from "@/lib/format";
import Link from "next/link";

export default function ProfilePage() {
  const me = getCurrentUser()!;
  const db = readDB();
  const myIdeas = db.ideas.filter((i) => i.authorId === me.id);

  return (
    <div className="max-w-3xl">
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className={clsx("grid h-16 w-16 place-items-center rounded-2xl text-white text-lg font-semibold bg-gradient-to-br", avatarColor(me.id))}>
            {initials(me.name)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{me.name}</h1>
            <div className="text-sm text-ink-muted">{me.email}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="chip-royal">{me.role === "admin" ? "Admin" : "Member"}</span>
              <span className="chip">Joined {formatDate(me.joinedAt)}</span>
            </div>
          </div>
        </div>
        {me.bio && <p className="mt-5 text-sm text-ink-muted">{me.bio}</p>}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {me.skills.split(",").map((s) => <span key={s} className="chip">{s.trim()}</span>)}
        </div>
      </div>

      <h2 className="font-display text-xl font-semibold mt-10">Your ideas ({myIdeas.length})</h2>
      <div className="mt-4 grid gap-3">
        {myIdeas.length === 0 && <div className="card p-6 text-sm text-ink-muted">You haven't posted yet.</div>}
        {myIdeas.map((i) => (
          <Link key={i.id} href={`/portal/idea/${i.id}`} className="card card-hover p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{i.title}</div>
              <span className="chip-royal">{i.category}</span>
            </div>
            <div className="text-xs text-ink-muted mt-1">{formatDate(i.createdAt)} · {i.likes.length} reactions</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
