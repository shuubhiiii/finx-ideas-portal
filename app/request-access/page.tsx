"use client";
import { useState } from "react";
import Link from "next/link";
import MarketingNav from "@/components/MarketingNav";
import Footer from "@/components/Footer";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export default function RequestAccessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      skills: String(fd.get("skills") || ""),
      reason: String(fd.get("reason") || ""),
      link: String(fd.get("link") || ""),
      password: String(fd.get("password") || ""),
    };
    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
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
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="chip-lavender">Step 1 of 2 · Tell us about you</span>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">Request access</h1>
            <p className="mt-2 text-ink-muted">
              Membership is invite-only. An admin will personally review your request.
            </p>
          </div>

          <div className="mt-10 glass-strong rounded-3xl p-6 sm:p-8">
            {submitted ? (
              <SuccessPanel />
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5">
                <Field label="Full name" name="name" placeholder="Jane Doe" required />
                <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
                <Field label="Choose a password" name="password" type="password" placeholder="At least 8 characters" required minLength={8} />
                <Field label="Role / expertise" name="skills" placeholder="e.g. Fintech Consultant, Business Strategist, Product, AI Research, Engineering" required />
                <div>
                  <label className="label">Why do you want to join?</label>
                  <textarea
                    name="reason"
                    rows={5}
                    required
                    className="input mt-1.5 resize-none"
                    placeholder="Share what you're advising on, building, exploring, or curious about."
                  />
                </div>
                <Field label="LinkedIn / GitHub (optional)" name="link" placeholder="https://…" />

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? "Submitting…" : "Submit request"}
                </button>
                <p className="text-center text-xs text-ink-muted">
                  By submitting you agree to be contacted by FinXSystems regarding your request.
                </p>
              </form>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-ink-muted">
            Already approved? <Link href="/login" className="text-royal-700 hover:underline">Sign in</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-rose-500"> *</span>}</label>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="input mt-1.5"
      />
    </div>
  );
}

function SuccessPanel() {
  return (
    <div className="text-center py-6">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-royal-50 to-white border border-royal-100 text-royal-700">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="font-display mt-5 text-2xl font-bold">Your request is under review by FinXSystems.</h2>
      <p className="mt-2 text-ink-muted">
        We'll email you as soon as a decision is made. In the meantime, keep thinking and building.
      </p>
      <div className="mt-7 flex items-center justify-center gap-3">
        <Link href="/" className="btn-secondary">Back to home</Link>
        <Link href="/login" className="btn-primary">Go to sign in</Link>
      </div>
    </div>
  );
}
