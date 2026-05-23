import clsx from "clsx";
import type { IdeaStatus } from "@/lib/db";

const META: Record<IdeaStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "border-silver-200 bg-white text-ink-muted" },
  under_review: { label: "Under review", cls: "border-butter-200 bg-butter-50 text-butter-700" },
  in_progress: { label: "In progress", cls: "border-sky-200 bg-sky-50 text-sky-700" },
  shipped: { label: "Shipped", cls: "border-mint-200 bg-mint-50 text-mint-700" },
  declined: { label: "Declined", cls: "border-blush-200 bg-blush-50 text-blush-700" },
};

export const IDEA_STATUSES: IdeaStatus[] = ["new", "under_review", "in_progress", "shipped", "declined"];

export function statusLabel(s: IdeaStatus) {
  return META[s]?.label ?? s;
}

export default function StatusBadge({ status, className }: { status: IdeaStatus; className?: string }) {
  const m = META[status] ?? META.new;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        m.cls,
        className
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {m.label}
    </span>
  );
}
