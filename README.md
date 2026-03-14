# 🗂️ JobTracker

A polished **Kanban-style job application tracker** built with the modern React stack. Drag cards between columns, CRUD your applications, search & filter, toggle dark mode — all backed by **Zustand** state + optional **Supabase** persistence & auth.

> **Demo mode** — the app works instantly with `npm run dev`. No backend setup required.

---

## ✨ Features

| Feature             | Details                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| **Kanban board**    | 5 columns: Wishlist → Applied → Interview → Offer → Rejected                |
| **Drag & drop**     | Move cards between columns with `@dnd-kit`                                  |
| **Full CRUD**       | Add / Edit / Delete jobs via validated forms                                |
| **Search & filter** | Instant search across company, role, tags + status filter                   |
| **Dashboard stats** | Live counters per status in a top bar                                       |
| **Dark mode**       | System-aware + manual toggle, zero flash                                    |
| **Responsive**      | Mobile-first — columns scroll horizontally on small screens                 |
| **Auth-ready**      | Login/signup with Supabase Auth · sign-out · session management             |
| **Persistence**     | localStorage in demo mode · real-time Supabase Postgres sync when connected |

---

## 🛠️ Tech Stack

```
Next.js 16 (App Router)    ─  framework
TypeScript                 ─  type safety
Tailwind CSS v4            ─  styling via design tokens
Zustand                    ─  lightweight state management
@dnd-kit                   ─  accessible drag-and-drop
React Hook Form + Zod      ─  form handling & validation
Framer Motion              ─  layout animations
Supabase                   ─  auth + database (optional)
Lucide React               ─  icons
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

The app boots in **demo mode** with 8 sample job applications. Data lives in localStorage.

---

## 🔐 Connecting Supabase (optional)

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` → `.env.local` and fill in your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the SQL in `supabase/migrations/001_create_jobs.sql` via the Supabase SQL Editor
4. (Optional) Disable email confirmation: **Authentication → Providers → Email → Toggle off "Confirm email"**
5. Restart dev server — sign up at `/signup`, then all CRUD syncs to Postgres in real-time

---

## 📁 Project Structure

```
src/
├── app/                       # Next.js App Router pages
├── components/
│   ├── board/                 # Kanban board, columns, cards, forms
│   ├── dashboard/             # Stats bar, search & filters
│   ├── layout/                # Header (auth-aware)
│   ├── auth/                  # Auth form
│   └── ui/                    # Modal
├── hooks/                     # useTheme, useAuth
├── lib/                       # Utils, constants, validations, Supabase
├── store/                     # Zustand store (with Supabase sync)
└── types/                     # TypeScript interfaces
```

---

## 🌐 Deployment

The app auto-deploys to **GitHub Pages** on every push to `main` via GitHub Actions (demo mode, static export).

Live at: **https://sanele23.github.io/job-tracker**

For full-featured deployment (with Supabase auth + database), use [Vercel](https://vercel.com) and set the env variables in the Vercel dashboard.

---

## 📜 License

MIT
