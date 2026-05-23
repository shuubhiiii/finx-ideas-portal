import Link from "next/link";
import { Logo } from "./MarketingNav";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-silver-200 bg-white/60 backdrop-blur-xl">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-tight">
              <div className="font-display text-[15px] font-bold">FinX Ideas Portal</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">by FinXSystems</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-ink-muted">
            A private, approval-based innovation community for fintech consultants,
            business strategists, founders, researchers and engineers shaping the
            future of finance, AI and automation.
          </p>
        </div>
        <div>
          <div className="label mb-3">Platform</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/request-access" className="hover:text-ink">Request Access</Link></li>
            <li><Link href="/login" className="hover:text-ink">Sign in</Link></li>
            <li><a href="#features" className="hover:text-ink">Features</a></li>
            <li><a href="#community" className="hover:text-ink">Community</a></li>
          </ul>
        </div>
        <div>
          <div className="label mb-3">Company</div>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><a href="#" className="hover:text-ink">About FinXSystems</a></li>
            <li><a href="#" className="hover:text-ink">Privacy</a></li>
            <li><a href="#" className="hover:text-ink">Terms</a></li>
            <li><a href="#" className="hover:text-ink">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-silver-200">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <div>© {new Date().getFullYear()} FinXSystems. All rights reserved.</div>
          <div>Built for thinkers and doers. Crafted with care.</div>
        </div>
      </div>
    </footer>
  );
}
