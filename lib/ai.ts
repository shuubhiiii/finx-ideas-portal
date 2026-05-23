import type { Idea } from "./db";

/**
 * Lightweight extractive "AI" summary stub.
 * In production swap with a real LLM call.
 */
export function summarizeIdea(title: string, body: string): string {
  const text = body.replace(/\s+/g, " ").trim();
  if (!text) return title;
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const pick = sentences.slice(0, 2).join(" ");
  const trimmed = pick.length > 220 ? pick.slice(0, 217) + "…" : pick;
  return trimmed || title;
}

/**
 * Naive duplicate detector: token overlap on title + first 200 chars of body.
 */
export function findDuplicates(target: { title: string; body: string }, ideas: Idea[]): Idea[] {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const targetTokens = new Set([...norm(target.title), ...norm(target.body.slice(0, 200))]);
  if (targetTokens.size === 0) return [];

  const scored = ideas.map((i) => {
    const tokens = new Set([...norm(i.title), ...norm(i.body.slice(0, 200))]);
    let overlap = 0;
    targetTokens.forEach((t) => tokens.has(t) && overlap++);
    const score = overlap / Math.max(targetTokens.size, 1);
    return { idea: i, score };
  });

  return scored
    .filter((s) => s.score >= 0.35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.idea);
}
