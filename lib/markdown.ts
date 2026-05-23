import type { User } from "./db";

export function userHandle(user: { email: string }): string {
  return user.email.split("@")[0]!.toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]!)
  );
}

/**
 * Minimal, safe markdown renderer.
 * Supports: code blocks (```), inline code (`), bold (**), italic (*),
 * links [text](http(s)://… or mailto:), headings (#, ##, ###), bullet lists (-, *),
 * ordered lists (1.), blockquotes (>), and @mentions linking to known users.
 * Everything is HTML-escaped first; only the constructs above produce tags.
 */
export function renderMarkdown(input: string, users: User[] = []): string {
  if (!input) return "";

  // 1) Extract fenced code blocks first
  const codeBlocks: string[] = [];
  let text = input.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<pre class="rounded-lg bg-silver-50 border border-silver-200 p-3 text-xs overflow-x-auto"><code>${escapeHtml(
        code.replace(/\n$/, "")
      )}</code></pre>`
    );
    return `\u0000CB${idx}\u0000`;
  });

  // 2) Escape everything else
  text = escapeHtml(text);

  // 3) Restore code blocks
  text = text.replace(/\u0000CB(\d+)\u0000/g, (_m, i) => codeBlocks[+i]);

  // 4) Inline code
  text = text.replace(
    /`([^`\n]+)`/g,
    '<code class="rounded bg-silver-100 px-1 py-0.5 text-[0.85em] border border-silver-200">$1</code>'
  );

  // 5) Headings (after escape: # is still #)
  text = text.replace(/^### (.+)$/gm, '<h3 class="font-display text-lg font-semibold mt-3">$1</h3>');
  text = text.replace(/^## (.+)$/gm, '<h2 class="font-display text-xl font-semibold mt-4">$1</h2>');
  text = text.replace(/^# (.+)$/gm, '<h1 class="font-display text-2xl font-bold mt-5">$1</h1>');

  // 6) Bold, italic
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");

  // 7) Links — only http(s) and mailto (URL is in escaped form so &amp; etc. OK; we further sanitize)
  text = text.replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (_m, label, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow" class="text-royal-700 underline-offset-2 hover:underline">${label}</a>`
  );

  // 8) Blockquotes
  text = text.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="border-l-2 border-silver-300 pl-3 text-ink-muted">$1</blockquote>'
  );

  // 9) Unordered list groups
  text = text.replace(/(?:^|\n)((?:[-*] .+(?:\n|$))+)/g, (_m, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l: string) => `<li>${l.replace(/^[-*] /, "")}</li>`)
      .join("");
    return `\n<ul class="list-disc pl-5 space-y-1">${items}</ul>`;
  });

  // 10) Ordered list groups
  text = text.replace(/(?:^|\n)((?:\d+\. .+(?:\n|$))+)/g, (_m, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l: string) => `<li>${l.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `\n<ol class="list-decimal pl-5 space-y-1">${items}</ol>`;
  });

  // 11) Mentions — @handle linked to known users
  if (users.length) {
    const byHandle = new Map<string, User>();
    for (const u of users) byHandle.set(userHandle(u), u);
    text = text.replace(/(^|\s|>)@([a-zA-Z0-9._-]+)/g, (m, pre, name) => {
      const u = byHandle.get(name.toLowerCase());
      if (!u) return m;
      return `${pre}<a href="/portal/profile?u=${u.id}" class="text-royal-700 font-medium hover:underline">@${name}</a>`;
    });
  }

  // 12) Paragraphs — wrap blocks separated by blank lines; preserve block-level tags
  const blocks = text.split(/\n{2,}/);
  const html = blocks
    .map((b) => {
      const t = b.trim();
      if (!t) return "";
      if (/^<(h\d|ul|ol|pre|blockquote|p|table)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}

/** Extract @mentions from raw text. Returns matching user ids. */
export function extractMentions(input: string, users: User[]): string[] {
  if (!input) return [];
  const byHandle = new Map<string, User>();
  for (const u of users) byHandle.set(userHandle(u), u);
  const ids = new Set<string>();
  const re = /(^|\s)@([a-zA-Z0-9._-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    const u = byHandle.get(m[2].toLowerCase());
    if (u) ids.add(u.id);
  }
  return [...ids];
}
