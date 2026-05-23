"use client";
import { useState } from "react";

const EMOJIS = ["🔥", "💡", "🎯", "👏", "🚀"];

export default function ReactionBar({
  ideaId,
  reactions,
  currentUserId,
}: {
  ideaId: string;
  reactions: Record<string, string[]>;
  currentUserId: string;
}) {
  const [open, setOpen] = useState(false);
  const used = EMOJIS.filter((e) => (reactions[e] || []).length > 0);
  const unused = EMOJIS.filter((e) => !used.includes(e));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {used.map((e) => {
        const users = reactions[e] || [];
        const active = users.includes(currentUserId);
        return (
          <form key={e} action={`/api/ideas/${ideaId}/react`} method="POST">
            <input type="hidden" name="emoji" value={e} />
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                active
                  ? "border-royal-300 bg-royal-50 text-royal-700"
                  : "border-silver-200 bg-white hover:border-silver-300"
              }`}
              title={active ? "Remove your reaction" : `React with ${e}`}
            >
              <span className="text-sm leading-none">{e}</span>
              <span className="tabular-nums">{users.length}</span>
            </button>
          </form>
        );
      })}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-silver-300 px-2.5 py-1 text-xs text-ink-muted hover:text-ink hover:border-silver-400"
          title="Add reaction"
        >
          <span className="text-sm leading-none">＋</span> React
        </button>
        {open && (
          <div className="absolute left-0 z-20 mt-1 flex gap-1 rounded-xl border border-silver-200 bg-white p-1.5 shadow-lg">
            {(used.length === 0 ? EMOJIS : unused).map((e) => (
              <form key={e} action={`/api/ideas/${ideaId}/react`} method="POST">
                <input type="hidden" name="emoji" value={e} />
                <button
                  type="submit"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-lg hover:bg-silver-100"
                  title={`React with ${e}`}
                >
                  {e}
                </button>
              </form>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
