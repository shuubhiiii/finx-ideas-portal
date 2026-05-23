import Link from "next/link";
import MarketingNav from "@/components/MarketingNav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HeroFX from "@/components/HeroFX";
import {
  Sparkles,
  ShieldCheck,
  Brain,
  Users,
  Bookmark,
  MessageCircle,
  Lock,
  ArrowRight,
  Workflow,
  TrendingUp,
  Wand2,
  Briefcase,
  LineChart,
  Lightbulb,
  Code2,
  Building2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      <MarketingNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <HeroFX />
        <div className="container-page relative pt-16 pb-24 sm:pt-24 sm:pb-32 text-center">
          <Reveal variant="fade">
            <span className="chip-royal mx-auto inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              Invite-only innovation community
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink">
              Where Future Ideas
              <br />
              <span className="relative inline-block">
                Become Reality
                <span aria-hidden className="absolute left-0 right-0 -bottom-2 h-3 bg-butter-200/70 -z-10 rounded-full" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-ink-muted">
              FinX Ideas Portal is a private, approval-based space by{" "}
              <span className="text-ink font-medium">FinXSystems</span> for fintech
              consultants, business strategists, product thinkers, founders, researchers
              and engineers shaping what comes next in finance, AI, automation and
              emerging technology — together.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex items-center justify-center gap-3">
              <Link href="/request-access" className="btn-primary group">
                Request Access
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link href="/login" className="btn-secondary">Member sign in</Link>
            </div>
          </Reveal>

          {/* Floating preview card */}
          <Reveal delay={320} variant="scale">
            <div className="relative mx-auto mt-16 max-w-5xl">
              <div className="absolute -inset-x-12 -inset-y-6 -z-10 bg-radial-fade" />
              <div className="glass-strong rounded-3xl p-3 sm:p-4 ring-soft gradient-border">
                <div className="rounded-2xl bg-white border border-silver-200 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-silver-200 bg-silver-50">
                    <span className="h-2.5 w-2.5 rounded-full bg-silver-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-silver-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-silver-300" />
                    <div className="ml-3 text-xs text-ink-muted">finx-ideas.app / portal</div>
                  </div>
                  <div className="grid grid-cols-12 gap-0">
                    <aside className="col-span-3 hidden md:flex flex-col gap-1.5 border-r border-silver-200 p-4">
                      {["Feed", "Trending", "Bookmarks", "Members", "Spaces", "Admin"].map((l, i) => (
                        <div key={l} className={`rounded-lg px-3 py-2 text-xs ${i === 1 ? "bg-royal-50 text-royal-700 font-medium" : "text-ink-muted"}`}>{l}</div>
                      ))}
                    </aside>
                    <div className="col-span-12 md:col-span-9 p-5 grid gap-4">
                      {[
                        { t: "Embedded-finance go-to-market for SMB banks", c: "Strategy", chip: "chip-mint", a: "Priya Shah", k: 32 },
                        { t: "Agentic credit underwriting copilot", c: "Fintech", chip: "chip-sky", a: "Alice Chen", k: 28 },
                        { t: "Zero-friction reconciliation between ledgers", c: "Automation", chip: "chip-peach", a: "Bob Martin", k: 21 },
                        { t: "Internal AI prompt library with provenance", c: "AI", chip: "chip-lavender", a: "Carla Reyes", k: 18 },
                      ].map((p, idx) => (
                        <Reveal key={p.t} delay={400 + idx * 110} variant="up">
                          <div className="card lift p-4 text-left">
                            <div className="flex items-center justify-between">
                              <span className={p.chip}>{p.c}</span>
                              <span className="text-xs text-ink-muted">2h ago</span>
                            </div>
                            <div className="mt-2 font-medium text-ink">{p.t}</div>
                            <div className="mt-1 text-xs text-ink-muted">by {p.a} · {p.k} reactions</div>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SIGNAL STRIP — marquee */}
      <section className="container-page">
        <Reveal variant="fade">
          <div className="glass rounded-2xl px-2 py-4 overflow-hidden marquee-mask">
            <div className="marquee-track flex items-center gap-10 text-xs uppercase tracking-[0.22em] text-ink-muted whitespace-nowrap">
              {Array.from({ length: 2 }).map((_, group) => (
                <div key={group} className="flex items-center gap-10 pr-10">
                  {["Invite-only", "AI-curated", "Strategy", "Consulting", "Product", "Engineering", "Private by default", "Collaboration first", "Future of finance", "Quiet by design", "Signal over noise"].map((w) => (
                    <span key={w + group} className="flex items-center gap-10">
                      <span>{w}</span>
                      <span className="h-1 w-1 rounded-full bg-silver-300" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FEATURES */}
      <section id="features" className="container-page mt-28">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="chip-lavender"><Wand2 className="h-3.5 w-3.5" /> Built for thinkers &amp; doers</span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              A premium space to think, advise, and build.
            </h2>
            <p className="mt-3 text-ink-muted">
              Whether you craft strategy decks, advise on regulation, design products or ship code — incubate
              ideas with people you trust, minus the noise of public social media.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} variant="up">
              <div className="card lift p-6 h-full">
                <div className={`grid h-10 w-10 place-items-center rounded-xl border ${f.iconBg}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-lg font-semibold">{f.title}</div>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="container-page mt-28">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="chip-peach">Who it's for</span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              One room, many disciplines.
            </h2>
            <p className="mt-3 text-ink-muted">
              FinX brings strategy, advisory, product, design and engineering minds into the same quiet room.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 70} variant="up">
              <div className={`rounded-2xl border p-5 h-full lift ${a.bg}`}>
                <div className={`grid h-9 w-9 place-items-center rounded-lg ${a.iconBg}`}>
                  <a.icon className="h-4.5 w-4.5" />
                </div>
                <div className="mt-3 font-display font-semibold">{a.title}</div>
                <p className="mt-1 text-sm text-ink-muted leading-relaxed">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COLLABORATION SHOWCASE */}
      <section id="collab" className="container-page mt-28">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <Reveal variant="left">
            <div>
              <span className="chip-royal"><Users className="h-3.5 w-3.5" /> Collaboration showcase</span>
              <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                From spark to shipped — together.
              </h2>
              <p className="mt-3 text-ink-muted">
                Form small, trusted teams in dedicated collaboration spaces. Share half-formed thoughts,
                get sharp feedback, and turn the best ones into prototypes.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  { i: Brain, t: "AI-generated summaries for fast scanning" },
                  { i: Workflow, t: "Internal vs community visibility per idea" },
                  { i: ShieldCheck, t: "Duplicate detection keeps signal high" },
                  { i: TrendingUp, t: "Trending surfaces what the room cares about" },
                ].map((x, i) => (
                  <Reveal as="li" key={x.t} delay={i * 90} variant="left" className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-royal-50 text-royal-700 border border-royal-100">
                      <x.i className="h-4 w-4" />
                    </span>
                    <span className="text-ink">{x.t}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 bg-warm-fade" />
              <div className="glass-strong rounded-3xl p-5">
                <div className="grid gap-4">
                  <div className="card lift p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name="Alice Chen" />
                        <div>
                          <div className="text-sm font-medium">Alice Chen</div>
                          <div className="text-xs text-ink-muted">posted in Agentic Finance</div>
                        </div>
                      </div>
                      <span className="chip-royal">AI</span>
                    </div>
                    <div className="mt-3 text-sm">
                      Drafted an architecture for an underwriting copilot that cites every signal.
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> 12</span>
                      <span className="inline-flex items-center gap-1"><Bookmark className="h-3.5 w-3.5" /> 8</span>
                      <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-royal-600" /> AI summary ready</span>
                    </div>
                  </div>
                  <div className="card lift p-4">
                    <div className="text-xs uppercase tracking-wider text-ink-muted">Live discussion</div>
                    <div className="mt-2 space-y-3">
                      <Message name="Bob Martin" text="Strong. Curious how you'd test against adversarial applications." />
                      <Message name="Carla Reyes" text="Pairs well with our doc-extraction pipeline — happy to collaborate." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-page mt-28">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="chip-sky">How it works</span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              Three quiet steps to get inside.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-royal-200 to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 120} variant="up">
              <div className="card lift p-6 relative h-full">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-royal-600 to-royal-800 text-white text-sm font-semibold shadow-[0_8px_24px_-10px_rgba(67,56,202,.6)]">
                  {i + 1}
                </div>
                <div className="mt-4 font-display text-lg font-semibold">{s.title}</div>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMMUNITY / CTA */}
      <section id="community" className="container-page mt-28">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-14 text-center gradient-border">
            <div className="absolute inset-0 hero-grid opacity-60 pointer-events-none" />
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-mint-200/60 blur-3xl animate-float" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-peach-200/60 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
            <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-lavender-200/50 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
            <div className="relative">
              <span className="chip-blush"><Lock className="h-3.5 w-3.5" /> Approval required</span>
              <h3 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                Join a small room of serious thinkers.
              </h3>
              <p className="mt-3 max-w-xl mx-auto text-ink-muted">
                Tell us about your work and what you'd love to explore. Admins review every request personally.
              </p>
              <div className="mt-7 flex items-center justify-center gap-3">
                <Link href="/request-access" className="btn-primary">Request Access</Link>
                <Link href="/login" className="btn-secondary">I already have access</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}

const features = [
  { icon: Sparkles,    title: "Shared ideas feed",      desc: "A clean, focused timeline of what the community is thinking about right now.", iconBg: "bg-mint-50 border-mint-200 text-mint-700" },
  { icon: Brain,       title: "AI summaries",            desc: "Every idea gets a crisp synopsis so you can scan ten in the time of one.",       iconBg: "bg-lavender-50 border-lavender-200 text-lavender-700" },
  { icon: ShieldCheck, title: "Duplicate detection",     desc: "We surface similar prior ideas before you post — to merge minds, not noise.",   iconBg: "bg-sky-50 border-sky-200 text-sky-700" },
  { icon: Users,       title: "Collaboration spaces",    desc: "Spin up small teams around an idea and move from chat to prototype.",          iconBg: "bg-peach-50 border-peach-200 text-peach-700" },
  { icon: Lock,        title: "Private by default",      desc: "Mark posts as internal-only when they're not ready for the wider room.",       iconBg: "bg-blush-50 border-blush-200 text-blush-700" },
  { icon: TrendingUp,  title: "Trending intelligence",   desc: "See what's resonating across categories and member activity.",                  iconBg: "bg-butter-50 border-butter-200 text-butter-700" },
];

const audiences = [
  { icon: Briefcase,  title: "Fintech consultants",       desc: "Bring frontline insight from banks, neobanks, insurers and regulators.",     bg: "bg-mint-50/60 border-mint-200",     iconBg: "bg-white border border-mint-200 text-mint-700" },
  { icon: LineChart,  title: "Business strategists",      desc: "Map markets, models and motions before they become inevitable.",            bg: "bg-sky-50/60 border-sky-200",       iconBg: "bg-white border border-sky-200 text-sky-700" },
  { icon: Lightbulb,  title: "Founders & operators",      desc: "Stress-test ideas with a small room of trusted, candid peers.",              bg: "bg-butter-50/70 border-butter-200", iconBg: "bg-white border border-butter-200 text-butter-700" },
  { icon: Brain,      title: "AI & ML researchers",       desc: "Translate research into pragmatic, real-world fintech experiments.",        bg: "bg-lavender-50/60 border-lavender-200", iconBg: "bg-white border border-lavender-200 text-lavender-700" },
  { icon: Code2,      title: "Engineers & designers",     desc: "Shape prototypes from raw ideas — and find collaborators to build with.",  bg: "bg-peach-50/60 border-peach-200",   iconBg: "bg-white border border-peach-200 text-peach-700" },
  { icon: Building2,  title: "Industry advisors",         desc: "Senior voices spotting patterns the room would otherwise miss.",            bg: "bg-blush-50/60 border-blush-200",   iconBg: "bg-white border border-blush-200 text-blush-700" },
];

const steps = [
  { title: "Request access",  desc: "Tell us about your work and what you'd love to explore with the community." },
  { title: "Personal review", desc: "Our team reviews each request manually to keep the room sharp and trusted." },
  { title: "Start sharing",   desc: "Post ideas, advise on others, find collaborators, and move them forward together." },
];

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-royal-500 to-royal-700 text-white text-xs font-semibold">
      {initials}
    </div>
  );
}

function Message({ name, text }: { name: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar name={name} />
      <div className="flex-1">
        <div className="text-xs text-ink-muted">{name}</div>
        <div className="mt-0.5 text-sm">{text}</div>
      </div>
    </div>
  );
}
