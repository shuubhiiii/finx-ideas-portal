"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./MarketingNav";
import { initials, avatarColor } from "@/lib/format";
import clsx from "clsx";
import {
  Home,
  TrendingUp,
  Bookmark,
  Users,
  Layers,
  Plus,
  Search,
  LogOut,
  Shield,
  Settings,
  Sparkles,
  Bell,
} from "lucide-react";

interface PortalShellProps {
  user: { id: string; name: string; email: string; role: "admin" | "member" };
  unreadNotifications?: number;
  children: React.ReactNode;
}

export default function PortalShell({ user, unreadNotifications = 0, children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const nav = [
    { href: "/portal", label: "Feed", icon: Home },
    { href: "/portal/trending", label: "Trending", icon: TrendingUp },
    { href: "/portal/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/portal/members", label: "Members", icon: Users },
    { href: "/portal/spaces", label: "Spaces", icon: Layers },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col border-r border-silver-200 bg-white/60 backdrop-blur-xl">
        <div className="px-5 h-16 flex items-center gap-2.5 border-b border-silver-200">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold">FinX Ideas</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">portal</div>
          </div>
        </div>
        <div className="p-4">
          <Link href="/portal/new" className="btn-primary w-full">
            <Plus className="h-4 w-4" /> New idea
          </Link>
        </div>
        <nav className="px-3 flex-1 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/portal" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-royal-50 text-royal-700 font-medium border border-royal-100"
                    : "text-ink-muted hover:bg-silver-100 hover:text-ink"
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
          {user.role === "admin" && (
            <Link
              href="/admin"
              className={clsx(
                "mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                pathname?.startsWith("/admin")
                  ? "bg-gradient-to-r from-royal-50 to-pink-50 text-royal-700 font-medium border border-royal-100"
                  : "text-ink-muted hover:bg-silver-100 hover:text-ink"
              )}
            >
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-silver-200">
          <div className="flex items-center gap-3">
            <div className={clsx("grid h-9 w-9 place-items-center rounded-full text-white text-xs font-semibold bg-gradient-to-br", avatarColor(user.id))}>
              {initials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-ink-muted truncate">{user.email}</div>
            </div>
            <button onClick={logout} className="btn-ghost p-2" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-silver-200">
          <div className="flex items-center gap-3 px-5 sm:px-8 h-16">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/portal?q=${encodeURIComponent(q)}`);
              }}
              className="flex-1 max-w-xl"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search ideas, tags, members…"
                  className="input pl-9"
                />
              </div>
            </form>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline-flex chip-royal">
                <Sparkles className="h-3.5 w-3.5" /> Private community
              </span>
              <Link
                href="/portal/notifications"
                className="btn-secondary relative"
                title="Notifications"
                aria-label={`Notifications${unreadNotifications ? ` (${unreadNotifications} unread)` : ""}`}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white shadow-sm">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </Link>
              <Link href="/portal/profile" className="btn-secondary" title="Profile">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="p-5 sm:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
