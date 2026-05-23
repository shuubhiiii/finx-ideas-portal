# FinX Ideas Portal

> **Where Future Ideas Become Reality.**
> A private, approval-based innovation community by **FinXSystems** for AI, fintech, automation, startups and future technologies.

This repo is a complete, self-contained Next.js 14 + Tailwind CSS frontend for the FinX Ideas Portal. It ships with a mock auth + JSON data store so it runs immediately — you can swap in PostgreSQL and Clerk/Auth0/Firebase Auth when you're ready.

---

## ✨ Highlights

- **Premium light aesthetic** — white / off-white surfaces, soft royal blue accents, warm subtle gradients, elegant glassmorphism, no neon.
- **Landing page** — animated grid/network hero, features, collaboration showcase, CTA, footer.
- **Approval-based onboarding** — public request form → admin manual review → access granted.
- **Private portal** — feed, create/edit, idea detail with discussion, search, categories/tags, bookmarks, trending, members directory, collaboration spaces, profile.
- **Admin panel** — approve/reject requests, suspend/reinstate members, delete ideas, manage categories.
- **AI helpers** — extractive summary on every idea + duplicate idea detection at compose time.
- **Visibility controls** — `community` vs `internal` per idea.
- **Sidebar dashboard layout** — SaaS-grade, responsive, smooth animations, rounded components.

---

## 🧰 Tech stack

- **Frontend:** Next.js 14 (App Router) · React 18 · Tailwind CSS · lucide-react
- **Backend:** Next.js Route Handlers (drop-in Express alternative)
- **Auth:** JWT in httpOnly cookie + bcrypt (ready to swap for Clerk/Auth0/Firebase)
- **Database:** File-backed JSON store at `data/db.json` (ready to swap for PostgreSQL — see `lib/db.ts`)
- **Hosting:** Optimised for **Vercel**

---

## 🚀 Quick start

```bash
# 1. Install
npm install

# 2. (optional) set a JWT secret
copy .env.local.example .env.local

# 3. Run
npm run dev
```

Open <http://localhost:3000>.

### Demo accounts (seeded automatically)

| Role   | Email                       | Password    |
| ------ | --------------------------- | ----------- |
| Admin  | `admin@finxsystems.com`     | `admin123`  |
| Member | `alice@finxsystems.com`     | `member123` |
| Member | `bob@finxsystems.com`       | `member123` |
| Member | `carla@finxsystems.com`     | `member123` |

A sample **pending access request** is seeded so you can try the approval flow under `/admin/requests`.

To reset all data, delete `data/db.json` — it will be regenerated from `lib/seed.ts` on next request.

---

## 🗺️ Routes

### Public
- `/` — Landing page
- `/request-access` — Request to join
- `/login` — Member sign-in

### Private (approved members)
- `/portal` — Ideas feed (with search + category filter via querystring)
- `/portal/new` — Compose new idea (with live AI summary + duplicate detection)
- `/portal/idea/[id]` — Idea detail + discussion
- `/portal/trending`, `/portal/bookmarks`, `/portal/members`, `/portal/spaces`, `/portal/profile`

### Admin only
- `/admin` — Dashboard
- `/admin/requests` — Approve / reject pending requests
- `/admin/members` — Suspend / reinstate
- `/admin/ideas` — Delete ideas
- `/admin/categories` — Add / remove categories

---

## 🔌 Swapping the mocks for real infra

| Concern        | Where it lives        | Replace with                                                                 |
| -------------- | --------------------- | ---------------------------------------------------------------------------- |
| Database       | `lib/db.ts`           | A Prisma client against PostgreSQL — keep the same `readDB/writeDB` interface or refactor route handlers. |
| Auth           | `lib/auth.ts`         | Clerk / Auth0 / Firebase Auth middleware — replace `getCurrentUser()`.       |
| AI summary     | `lib/ai.ts`           | Real LLM call (OpenAI, Anthropic, etc.).                                      |
| Email          | (none yet)            | Add transactional email on approval/rejection.                                |

---

## 📁 Structure

```
app/
  page.tsx                 # Landing
  request-access/          # Public access request
  login/                   # Sign in
  portal/                  # Private member area (layout-guarded)
  admin/                   # Admin area (role-guarded)
  api/                     # Route handlers
components/
lib/
  db.ts  seed.ts  auth.ts  ai.ts  format.ts
data/
  db.json                  # generated on first run
```

---

© FinXSystems — built for innovators.
