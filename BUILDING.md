# 🛠️ How This App Was Built — A Junior Developer's Guide

This document walks you through **every step** taken to build the **JobTracker** application — from an empty folder to a fully deployed Kanban board with authentication and a database.

If you're a junior developer, read this top-to-bottom. Every decision is explained in plain English.

---

## Table of Contents

1. [What We're Building](#1-what-were-building)
2. [Tech Stack — What & Why](#2-tech-stack--what--why)
3. [Step 1: Scaffold the Next.js Project](#step-1-scaffold-the-nextjs-project)
4. [Step 2: Install Dependencies](#step-2-install-dependencies)
5. [Step 3: Define TypeScript Types](#step-3-define-typescript-types)
6. [Step 4: Build Utility Functions & Constants](#step-4-build-utility-functions--constants)
7. [Step 5: Create the Zustand Store (State Management)](#step-5-create-the-zustand-store-state-management)
8. [Step 6: Set Up Theming (Dark Mode)](#step-6-set-up-theming-dark-mode)
9. [Step 7: Create the Global CSS & Design Tokens](#step-7-create-the-global-css--design-tokens)
10. [Step 8: Build the Layout Shell](#step-8-build-the-layout-shell)
11. [Step 9: Build the UI Components](#step-9-build-the-ui-components)
12. [Step 10: Build the Kanban Board with Drag & Drop](#step-10-build-the-kanban-board-with-drag--drop)
13. [Step 11: Build the Job Form with Validation](#step-11-build-the-job-form-with-validation)
14. [Step 12: Set Up Supabase (Database & Auth)](#step-12-set-up-supabase-database--auth)
15. [Step 13: Wire the Store to Supabase](#step-13-wire-the-store-to-supabase)
16. [Step 14: Build the Auth System](#step-14-build-the-auth-system)
17. [Step 15: Deploy to GitHub Pages](#step-15-deploy-to-github-pages)
18. [Final File Structure](#final-file-structure)
19. [Concepts You Should Learn More About](#concepts-you-should-learn-more-about)

---

## 1. What We're Building

A **Kanban-style job application tracker**. Think of it like a Trello board specifically for tracking your job applications. It has 5 columns:

```
Wishlist → Applied → Interview → Offer → Rejected
```

You can:

- **Add** a new job (company, role, salary, notes, tags, etc.)
- **Edit** or **delete** existing jobs
- **Drag and drop** job cards between columns
- **Search** across all jobs
- **Filter** by status
- **Toggle dark mode**
- **Sign up / log in** (with Supabase)

The app works in two modes:

- **Demo mode** — no setup needed, data saved to your browser's localStorage
- **Supabase mode** — real database, user accounts, data persists across devices

---

## 2. Tech Stack — What & Why

| Tool                | What It Does                            | Why We Chose It                                           |
| ------------------- | --------------------------------------- | --------------------------------------------------------- |
| **Next.js 16**      | React framework with routing, SSR, etc. | Industry standard. App Router gives us file-based routing |
| **TypeScript**      | JavaScript with types                   | Catches bugs at compile time, better autocomplete         |
| **Tailwind CSS v4** | Utility-first CSS framework             | Fast styling, no separate CSS files, built-in dark mode   |
| **Zustand**         | State management library                | Way simpler than Redux. One file, no boilerplate          |
| **@dnd-kit**        | Drag-and-drop library                   | Accessible, modern, built for React                       |
| **React Hook Form** | Form handling                           | Minimal re-renders, easy validation                       |
| **Zod**             | Schema validation                       | Type-safe validation, integrates with React Hook Form     |
| **Framer Motion**   | Animations                              | Declarative animations, layout transitions                |
| **Supabase**        | Backend-as-a-Service                    | Free Postgres database + auth, no server needed           |
| **Lucide React**    | Icons                                   | Clean, consistent icon set                                |

---

## Step 1: Scaffold the Next.js Project

We started with the standard Next.js scaffolding command:

```bash
npx create-next-app@latest job-tracker --typescript --tailwind --eslint --app --src-dir
```

This creates the project with:

- **TypeScript** enabled
- **Tailwind CSS** configured
- **ESLint** for code quality
- **App Router** (the modern `app/` directory approach)
- **`src/` directory** to keep source code separate from config files

### What the initial structure looks like:

```
job-tracker/
├── src/
│   └── app/
│       ├── layout.tsx      ← root layout (wraps every page)
│       ├── page.tsx         ← home page
│       └── globals.css      ← global styles
├── public/                  ← static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

### Key concept: App Router

In Next.js App Router, **every folder inside `app/` becomes a URL route**. A file called `page.tsx` inside a folder is the page component for that route:

- `app/page.tsx` → `localhost:3000/`
- `app/login/page.tsx` → `localhost:3000/login`
- `app/auth/callback/route.ts` → API route at `localhost:3000/auth/callback`

---

## Step 2: Install Dependencies

```bash
npm install zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
  react-hook-form @hookform/resolvers zod framer-motion lucide-react date-fns \
  @supabase/ssr @supabase/supabase-js
```

Here's what each package does:

- `zustand` — our state management (stores all job data)
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag-and-drop
- `react-hook-form`, `@hookform/resolvers` — form handling
- `zod` — form validation schemas
- `framer-motion` — animations
- `lucide-react` — icon components
- `date-fns` — date formatting utilities
- `@supabase/ssr`, `@supabase/supabase-js` — Supabase client for auth & database

---

## Step 3: Define TypeScript Types

**File: `src/types/index.ts`**

Before writing any logic, we define the **shape of our data**. This is like drawing a blueprint before building a house.

```typescript
// The 5 possible statuses a job can have
export type JobStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

// A single job application
export interface Job {
  id: string;
  user_id?: string; // links to Supabase auth user
  company: string;
  role: string;
  salary_min?: number | null;
  salary_max?: number | null;
  status: JobStatus;
  date_applied?: string | null;
  notes?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  url?: string | null;
  tags: string[];
  position: number; // order within a column
  created_at: string;
  updated_at: string;
}

// Defines how each Kanban column looks
export interface ColumnDef {
  id: JobStatus;
  title: string;
  color: string;
  icon: string;
}
```

### Why this matters

Every component that touches a job will import this `Job` interface. TypeScript will then:

- Tell you if you misspell a property name
- Tell you if you pass the wrong type
- Give you autocomplete in VS Code

---

## Step 4: Build Utility Functions & Constants

### Constants: `src/lib/constants.ts`

This file defines two important things:

**1. Column definitions** — the 5 Kanban columns with their colors and icons:

```typescript
export const COLUMNS: ColumnDef[] = [
  { id: "wishlist", title: "Wishlist", color: "#64748b", icon: "✨" },
  { id: "applied", title: "Applied", color: "#3b82f6", icon: "📨" },
  { id: "interview", title: "Interview", color: "#f59e0b", icon: "🎤" },
  { id: "offer", title: "Offer", color: "#22c55e", icon: "🎉" },
  { id: "rejected", title: "Rejected", color: "#ef4444", icon: "❌" },
];
```

**2. Demo data** — 8 sample job applications (Stripe, Vercel, Linear, etc.) so the app isn't empty on first run.

### Utilities: `src/lib/utils.ts`

Small helper functions used across the app:

```typescript
// Join CSS class names (skips falsy values)
export function cn(...classes) { return classes.filter(Boolean).join(' '); }

// Format salary: 150000 → "$150k"
export function formatSalary(min, max) { ... }

// Format date: "2026-03-14" → "Mar 14, 2026"
export function formatDate(dateStr) { ... }

// Generate unique IDs: "1710412345678-abc123d"
export function generateId() { ... }
```

### Why constants and utils are separate

This is a common pattern: keep reusable data and functions in a `lib/` folder. Components stay small and focused — they import what they need.

---

## Step 5: Create the Zustand Store (State Management)

**File: `src/store/job-store.ts`**

This is the **brain** of the app. It holds all job data and every action you can perform on it.

### What is Zustand?

Zustand is a state management library. Think of it as a **global variable** that any component can read from or write to, and when it changes, the components automatically re-render.

### The store has two parts:

**1. State** — the data:

```typescript
interface JobState {
  jobs: Job[]; // all job applications
  searchQuery: string; // current search text
  statusFilter: JobStatus | "all"; // current filter
  isInitialized: boolean; // has the store loaded?
}
```

**2. Actions** — functions that change the data:

```typescript
interface JobActions {
  initialize: () => void; // load demo data or skip for Supabase
  loadFromSupabase: (userId) => void; // fetch jobs from database
  addJob: (job, userId?) => void; // create a new job
  updateJob: (id, updates) => void; // edit an existing job
  deleteJob: (id) => void; // remove a job
  moveJob: (id, status, pos?) => void; // drag-and-drop between columns
  setSearchQuery: (query) => void; // update search
  setStatusFilter: (filter) => void; // update filter
  getFilteredJobs: () => Job[]; // jobs matching search + filter
  getJobsByStatus: (status) => Job[]; // jobs for one column
  getStats: () => Record; // count per status
  seedDemoData: () => void; // reset to demo data
  clearJobs: () => void; // empty everything
}
```

### How persistence works

The store uses Zustand's `persist` middleware to automatically save to `localStorage`:

```typescript
export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: "job-tracker-storage", // localStorage key
      partialize: (state) => ({
        // only save jobs + initialized flag
        jobs: state.jobs,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
```

Every time jobs change → Zustand serializes them to JSON → saves to `localStorage`. On page reload → Zustand reads from `localStorage` → restores the state.

### Supabase sync

When Supabase is configured, every CRUD action also writes to the database:

```typescript
addJob: (jobData, userId) => {
  // 1. Immediately update local state (fast UI)
  set({ jobs: [...get().jobs, newJob] });

  // 2. Async sync to Supabase (background)
  if (isSupabaseConfigured() && userId) {
    getSupabase().then((sb) =>
      sb
        .from("jobs")
        .insert({ ...newJob })
        .select()
        .single(),
    );
  }
};
```

This pattern is called **optimistic updates** — the UI updates instantly, and the database catches up in the background.

---

## Step 6: Set Up Theming (Dark Mode)

**File: `src/hooks/use-theme.ts`**

```typescript
export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');

    setThemeState(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => { ... };

  return { theme, setTheme, toggleTheme };
}
```

### How it works

1. On first load, check if the user previously picked a theme (saved in `localStorage`)
2. If not, check their OS preference (System Settings → Dark Mode)
3. Add/remove the `dark` class on the `<html>` element
4. Tailwind CSS then applies dark styles based on that class

---

## Step 7: Create the Global CSS & Design Tokens

**File: `src/app/globals.css`**

Instead of hard-coding colors everywhere, we define **CSS custom properties** (design tokens):

```css
@import "tailwindcss";

/* Tell Tailwind to use .dark class for dark mode */
@variant dark (&:where(.dark, .dark *));

/* Map our tokens to Tailwind color names */
@theme inline {
  --color-background: var(--bg);
  --color-foreground: var(--fg);
  --color-primary: var(--primary);
  /* ... etc */
}

/* Light palette */
:root {
  --bg: #fafafa;
  --fg: #0a0a0a;
  --primary: #6366f1; /* indigo */
  /* ... */
}

/* Dark palette — just override the same variables */
.dark {
  --bg: #09090b;
  --fg: #fafafa;
  --primary: #818cf8; /* lighter indigo */
  /* ... */
}
```

### Why design tokens?

- Change a color in **one place** → it updates **everywhere**
- Dark mode is just swapping the token values
- Tailwind picks them up as `bg-background`, `text-foreground`, `bg-primary`, etc.

---

## Step 8: Build the Layout Shell

### Root Layout: `src/app/layout.tsx`

Every page in the app is wrapped by this layout. It:

1. Loads Google Fonts (Geist Sans + Geist Mono)
2. Sets up metadata (page title, description)
3. Wraps everything in `<Providers>`

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="... bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Providers: `src/components/providers.tsx`

This component handles initialization:

1. Wraps the app with `AuthProvider` (tracks who's logged in)
2. On load, either seeds demo data OR fetches from Supabase

```tsx
export function Providers({ children }) {
  return (
    <AuthProvider>
      <StoreInitializer>{children}</StoreInitializer>
    </AuthProvider>
  );
}

function StoreInitializer({ children }) {
  const { user, isSupabase, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (isSupabase && user) {
      loadFromSupabase(user.id); // fetch from database
    } else {
      initialize(); // load demo data
    }
  }, [loading, isSupabase, user]);

  return <>{children}</>;
}
```

### Home Page: `src/app/page.tsx`

The main page composes all the dashboard pieces:

```tsx
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <StatsBar /> {/* live counters */}
        <SearchFilter /> {/* search + filter + "Add Job" button */}
        <KanbanBoard /> {/* the 5-column board */}
      </main>
      <Modal>
        {" "}
        {/* "Add Job" modal from the top button */}
        <JobForm />
      </Modal>
    </div>
  );
}
```

---

## Step 9: Build the UI Components

### Header: `src/components/layout/header.tsx`

The sticky top bar with:

- Logo + "JobTracker" branding
- "Demo" badge (only in demo mode)
- Reset button (only in demo mode)
- Sign In link (only when Supabase is configured and not logged in)
- Sign Out button (only when logged in)
- Dark mode toggle

The header is **auth-aware** — it uses `useAuth()` to know whether to show demo controls or auth buttons.

### Stats Bar: `src/components/dashboard/stats-bar.tsx`

A row of animated badges showing: Total, Wishlist (2), Applied (3), Interview (1), etc. Uses Framer Motion for staggered entrance animations.

### Search & Filter: `src/components/dashboard/search-filter.tsx`

A search input + status dropdown + "Add Job" button. The search instantly filters across company name, role, and tags using the store's `setSearchQuery`.

### Modal: `src/components/ui/modal.tsx`

A reusable modal overlay with:

- Backdrop blur
- Spring animation (Framer Motion)
- Close on Escape key
- Close on backdrop click
- Scroll lock when open

---

## Step 10: Build the Kanban Board with Drag & Drop

This is the most complex part. It involves 3 components:

### KanbanBoard: `src/components/board/kanban-board.tsx`

The parent that sets up the drag-and-drop context:

```tsx
export function KanbanBoard() {
  return (
    <DndContext
      sensors={sensors}                         // mouse + keyboard
      collisionDetection={closestCorners}       // algorithm for detecting drops
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto">
        {COLUMNS.map((column) => (
          <KanbanColumn key={column.id} column={column} jobs={...} />
        ))}
      </div>

      {/* Ghost card that follows your cursor while dragging */}
      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### How drag-and-drop works:

1. User grabs a card → `onDragStart` fires → we track which card is being dragged
2. A **DragOverlay** renders a "ghost" copy that follows the cursor
3. User drops the card → `onDragEnd` fires → we figure out where it landed
4. If dropped on a **column** → move to that column
5. If dropped on another **card** → move to that card's column at that position
6. Call `moveJob()` on the store → updates local state + syncs to Supabase

### KanbanColumn: `src/components/board/column.tsx`

Each column is a **droppable zone** (using `useDroppable` from dnd-kit). It:

- Shows the column header (icon, title, count)
- Has a "+" button to add a job directly to that column
- Renders a list of `JobCard` components
- Shows "Drop jobs here" when empty
- Highlights with a ring when a card is being dragged over it

### JobCard: `src/components/board/job-card.tsx`

Each card is **sortable** (using `useSortable` from dnd-kit). It:

- Shows company name, role, salary, date, contact, and tags
- Has hover-revealed action buttons: external link, edit, delete, drag handle
- Uses Framer Motion for smooth layout animations when cards move
- Becomes semi-transparent when being dragged
- Tilts and scales up when used as a drag overlay (ghost)

---

## Step 11: Build the Job Form with Validation

### Validation Schema: `src/lib/validations/job.ts`

We use **Zod** to define what valid form data looks like:

```typescript
export const jobFormSchema = z
  .object({
    company: z.string().min(1, "Company name is required").max(100),
    role: z.string().min(1, "Role is required").max(100),
    // ... other fields
  })
  .refine(/* email validation */)
  .refine(/* URL validation */)
  .refine(/* min salary ≤ max salary */);
```

Zod gives us:

- **Type inference** — `JobFormValues` is auto-generated from the schema
- **Validation messages** — shown next to each field
- **Custom rules** — like "min salary must be ≤ max salary"

### Job Form: `src/components/board/job-form.tsx`

Uses **React Hook Form** connected to the Zod schema via `zodResolver`:

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<JobFormValues>({
  resolver: zodResolver(jobFormSchema),
  defaultValues: { ... },
});
```

Key points:

- Works for both **Add** and **Edit** (checks if a `job` prop exists)
- All form fields use `{...register('fieldName')}` to connect to React Hook Form
- Errors display below each field
- On submit, calls `transformFormToJob()` to convert string values to proper types, then calls `addJob()` or `updateJob()` on the store

---

## Step 12: Set Up Supabase (Database & Auth)

### What is Supabase?

It's a Backend-as-a-Service that gives you a **Postgres database** + **authentication** + **API** — all hosted for free. Think of it as Firebase but with a real SQL database.

### Database Migration: `supabase/migrations/001_create_jobs.sql`

This SQL creates the `jobs` table:

```sql
create table public.jobs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  company     text not null,
  role        text not null,
  status      text not null default 'wishlist',
  -- ... more columns
);
```

Important security feature — **Row Level Security (RLS)**:

```sql
alter table public.jobs enable row level security;

create policy "Users can view own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);
```

This means: even if someone gets your API key, they can **only** see their own data. The database enforces it.

### Three Supabase Client Files

We need different Supabase clients depending on where the code runs:

**1. Browser client** (`src/lib/supabase/client.ts`):

```typescript
// Used in client components (anything with 'use client')
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Check if Supabase keys are set
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && ...);
}
```

**2. Server client** (`src/lib/supabase/server.ts`):

```typescript
// Used in server components and API routes
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: { getAll, setAll }, // reads/writes cookies
  });
}
```

**3. Middleware client** (`src/lib/supabase/middleware.ts`):

```typescript
// Used in Next.js middleware to refresh auth sessions
export async function updateSession(request: NextRequest) { ... }
```

### Why three clients?

- **Browser**: runs in the user's browser, uses browser cookies
- **Server**: runs on the server during page rendering, reads cookies from the request
- **Middleware**: runs before every request, refreshes the auth token if needed

### Next.js Middleware: `src/middleware.ts`

This runs before every page request:

```typescript
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next(); // demo mode — skip
  }
  return updateSession(request); // refresh the Supabase session cookie
}
```

---

## Step 13: Wire the Store to Supabase

The store was originally demo-only (localStorage). We added:

**1. A `loadFromSupabase` action:**

```typescript
loadFromSupabase: async (userId) => {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true });

  if (data) set({ jobs: data, isInitialized: true });
};
```

**2. Supabase sync in every CRUD action:**

Each action (add, update, delete, move) follows the same pattern:

1. Update local state immediately (so the UI is fast)
2. If Supabase is configured, also write to the database in the background

**3. Smart initialization** (in `providers.tsx`):

- If not logged in → load demo data from localStorage
- If logged in → fetch jobs from Supabase instead

---

## Step 14: Build the Auth System

### Auth Context: `src/hooks/use-auth.tsx`

A React Context + Provider that tracks the current user:

```tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return; // skip in demo mode

    const supabase = createClient();

    // Check if already logged in
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Listen for login/logout events
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <AuthCtx.Provider value={{ user, isSupabase, loading, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
```

Any component can then use `const { user, signOut } = useAuth();`

### Auth Form: `src/components/auth/auth-form.tsx`

One form component that handles both login and signup:

- In demo mode (no Supabase) → redirects to home
- In login mode → calls `supabase.auth.signInWithPassword()`
- In signup mode → calls `supabase.auth.signUp()`
- On success → full page reload to `/` so auth state initializes fresh

### Auth Pages

```
src/app/(auth)/login/page.tsx   → <AuthForm mode="login" />
src/app/(auth)/signup/page.tsx  → <AuthForm mode="signup" />
```

The `(auth)` folder with parentheses is a **route group** — it organizes files without affecting the URL. Both pages render at `/login` and `/signup`.

### OAuth Callback: `src/app/auth/callback/route.ts`

If you ever add social logins (Google, GitHub), the OAuth flow redirects back to this route. It exchanges the authorization code for a session.

---

## Step 15: Deploy to GitHub Pages

### The Challenge

GitHub Pages only serves **static files** (HTML, CSS, JS). Next.js normally needs a server. So we configured a conditional **static export**.

### Next.js Config: `next.config.ts`

```typescript
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages && {
    output: "export", // generate static HTML
    basePath: "/job-tracker", // repo name in the URL
    images: { unoptimized: true }, // no image optimization server
  }),
};
```

When `GITHUB_PAGES=true`:

- `output: 'export'` → Next.js generates a static `out/` folder
- `basePath` → all links are prefixed with `/job-tracker` (because GitHub Pages URLs are `username.github.io/repo-name`)
- `images: { unoptimized: true }` → skip the image optimization server

### GitHub Actions Workflow: `.github/workflows/deploy.yml`

This file tells GitHub to automatically build and deploy on every push to `main`:

```yaml
jobs:
  build:
    steps:
      - Checkout code
      - Setup Node.js
      - npm ci (install dependencies)
      - Remove server-only files (middleware, auth callback)
      - npm run build (with GITHUB_PAGES=true)
      - Upload the `out/` folder

  deploy:
    steps:
      - Deploy to GitHub Pages
```

We **remove** `middleware.ts` and `src/app/auth/` before building because static export can't handle server-side features. That's fine — the GitHub Pages version is demo-only anyway.

### To enable it:

1. Go to your repo → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` → it deploys automatically

---

## Final File Structure

```
job-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml                ← GitHub Pages auto-deploy
├── public/                           ← static assets (favicon, etc.)
├── src/
│   ├── app/
│   │   ├── globals.css               ← design tokens + dark mode
│   │   ├── layout.tsx                ← root layout (fonts, providers)
│   │   ├── page.tsx                  ← home page (kanban dashboard)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        ← /login
│   │   │   └── signup/page.tsx       ← /signup
│   │   └── auth/
│   │       └── callback/route.ts     ← OAuth callback (API route)
│   ├── components/
│   │   ├── providers.tsx             ← AuthProvider + StoreInitializer
│   │   ├── auth/
│   │   │   └── auth-form.tsx         ← login/signup form
│   │   ├── board/
│   │   │   ├── kanban-board.tsx      ← DndContext + columns
│   │   │   ├── column.tsx            ← droppable column
│   │   │   ├── job-card.tsx          ← sortable card
│   │   │   └── job-form.tsx          ← add/edit form
│   │   ├── dashboard/
│   │   │   ├── stats-bar.tsx         ← status counters
│   │   │   └── search-filter.tsx     ← search + filter + add button
│   │   ├── layout/
│   │   │   └── header.tsx            ← top bar (auth-aware)
│   │   └── ui/
│   │       └── modal.tsx             ← reusable modal
│   ├── hooks/
│   │   ├── use-auth.tsx              ← auth context + useAuth()
│   │   └── use-theme.ts             ← dark mode hook
│   ├── lib/
│   │   ├── constants.ts              ← columns, statuses, demo data
│   │   ├── utils.ts                  ← cn(), formatSalary(), etc.
│   │   ├── supabase/
│   │   │   ├── client.ts            ← browser Supabase client
│   │   │   ├── server.ts            ← server Supabase client
│   │   │   └── middleware.ts         ← session refresh
│   │   └── validations/
│   │       └── job.ts                ← Zod form schema
│   ├── middleware.ts                  ← Next.js middleware (auth)
│   ├── store/
│   │   └── job-store.ts              ← Zustand store (all app state)
│   └── types/
│       └── index.ts                  ← TypeScript interfaces
├── supabase/
│   └── migrations/
│       └── 001_create_jobs.sql       ← database schema + RLS policies
├── .env.local.example                ← template for env variables
├── .env.local                        ← actual env variables (git-ignored)
├── next.config.ts                    ← Next.js config (GitHub Pages support)
├── package.json                      ← dependencies + scripts
├── tsconfig.json                     ← TypeScript config
└── postcss.config.mjs                ← PostCSS (for Tailwind)
```

---

## Concepts You Should Learn More About

If you're a junior developer, here are the key concepts from this project to study further:

1. **React Context API** — how `AuthProvider` shares auth state across the app without prop drilling
2. **Zustand** — simple alternative to Redux for state management. Read the [Zustand docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
3. **Optimistic Updates** — updating the UI before the server confirms (used in our store)
4. **Row Level Security (RLS)** — database-level access control in Supabase
5. **Next.js App Router** — file-based routing, layouts, server vs client components
6. **React Hook Form** — performant forms with minimal re-renders
7. **Zod** — schema-first validation that generates TypeScript types
8. **CSS Custom Properties** — the design token system in our `globals.css`
9. **GitHub Actions** — CI/CD pipelines that auto-deploy on every push
10. **Static Export** — generating a fully static site from a Next.js app

---

_This document was written as part of the JobTracker project. Last updated: March 2026._
