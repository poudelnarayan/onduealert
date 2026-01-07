# OnDueAlert (MVP)

OnDueAlert is a simple compliance / deadline SaaS for freelancers and small businesses.

## What’s included (MVP)

- **Auth**: Clerk (App Router) + protected routes via `clerkMiddleware()`
- **Deadlines**: CRUD, mark completed, recurring next-cycle auto-generation
- **Dashboard**: Upcoming, overdue, completed, basic stats
- **Notifications**: Email alerts based on offsets + daily overdue escalation
- **Reliability**: `NotificationLog` idempotency (no duplicate sends for same deadline + schedule)

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind
- PostgreSQL + Prisma ORM
- Clerk auth
- Nodemailer email sending (SMTP) with a `EMAIL_MODE=console` dev fallback

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create an online Postgres database (recommended)

Pick one of these managed providers:

- **Vercel Postgres (easy if deploying on Vercel)**: Create a Postgres database in Vercel → copy the **connection string**.
- **Neon (recommended for free dev DBs)**: Create a project → copy the **`DATABASE_URL`** connection string.
- **Supabase**: Create a project → Settings → Database → copy the **connection string**.

You’ll paste the connection string into `DATABASE_URL` below.

#### Supabase note (important)

Supabase shows a **Project URL** and **API Keys** (publishable/anon/service-role). Those are for Supabase’s HTTP APIs.

For this project (Prisma + Postgres), you do **not** use the API key. You must use the **Postgres connection string**:

- Supabase Dashboard → **Project Settings** → **Database** → **Connection string**
- Copy the **URI** (it looks like `postgresql://...`)
- Use the **Direct connection** string for `DATABASE_URL` when possible.
  - If you want to use Supabase pooling for runtime requests, you can set:
    - `DATABASE_URL` = pooled/transaction connection string
    - `DIRECT_URL` = direct connection string (used by Prisma for migrations)

### 3) Configure environment variables

Copy `env.example` to `.env` and fill in values:

- **DATABASE_URL**: the managed Postgres connection string from your provider
- **DIRECT_URL** (optional): direct connection string for migrations when using pooling
- **CRON_SECRET**: secret token for cron endpoint
- **Clerk**: set keys in `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- **Supabase** (server-side only): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, optional `SUPABASE_STORAGE_BUCKET_PROOFS`
- **Email**:
  - Local dev: set `EMAIL_MODE=console`
  - Production: set SMTP vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, optional `EMAIL_FROM`)

Note: Next.js loads `.env` automatically from the project root. If `DATABASE_URL` is missing, Prisma will fail to initialize and auth/deadline APIs will return 500s.

### 4) Setup database (run migrations against the online DB)

```bash
# First-time setup (creates tables) — non-interactive:
npm run db:init

# If you change `prisma/schema.prisma` later:
npm run prisma:migrate
npm run prisma:generate
```

### 5) Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` (it redirects to `/dashboard`).

## Cron / background job (notifications)

OnDueAlert uses a cron-triggered API route:

- `GET /api/cron/send-notifications?token=CRON_SECRET`

In Vercel, configure a Cron Job to hit the endpoint (recommended every hour or daily).

## Project structure (high level)

- `prisma/schema.prisma`: data model
- `lib/`: shared server utilities (Prisma, Clerk auth helpers, email, date helpers)
- `app/api/`: API routes (deadlines, dashboard, cron)
- `app/(app)/`: protected dashboard + deadlines pages

## Notes / intended MVP constraints

- **Custom cron-like schedules**: stored in `cronExpression` but not parsed in MVP; use `customIntervalDays` for custom recurrence now.
- **Timezone**: stored on schedule for future use; MVP sends based on UTC day boundaries.
