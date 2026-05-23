"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarketingNav from "@/components/MarketingNav";
import Footer from "@/components/Footer";
import { Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(fd.get("email") || ""),
          password: String(fd.get("password") || ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      router.push(data.role === "admin" ? "/admin" : "/portal");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <MarketingNav />
      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-ink-muted">Sign in to enter the FinX Ideas Portal.</p>
          </div>

          <div className="mt-10 glass-strong rounded-3xl p-7">
            <form onSubmit={onSubmit} className="grid gap-5">
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" required className="input mt-1.5" placeholder="you@company.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <input name="password" type="password" required className="input mt-1.5" placeholder="••••••••" />
              </div>
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</div>
              )}
              <button disabled={loading} className="btn-primary w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="divider my-6" />

            <div className="text-center text-sm text-ink-muted">
              No account yet? <Link href="/request-access" className="text-royal-700 hover:underline">Request access</Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-silver-200 bg-white/70 backdrop-blur p-4 text-xs text-ink-muted">
            <div className="font-medium text-ink mb-1">Demo accounts</div>
            <div>Admin · <span className="text-ink">admin@finxsystems.com</span> / <span className="text-ink">admin123</span></div>
            <div>Member · <span className="text-ink">alice@finxsystems.com</span> / <span className="text-ink">member123</span></div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
