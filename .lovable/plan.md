## Goal
Add pagination/sorting to the updates database (URL-synced), enable real email alerts for watchlist matches with official source links, and back watchlists with authentication + server storage.

## 1. Updates database: pagination + sorting (URL-synced)
`src/routes/updates.tsx`:
- Extend the `searchSchema` with `sort` (`date_desc` | `date_asc` | `severity_desc` | `severity_asc`) and `page` (number, default 1), both using `fallback(...).default(...)`.
- Add a Sort `<select>` in the filter bar next to the existing filters.
- Compute severity rank (`urgent=3, warning=2, info=1, approved=0`) and sort `filtered` accordingly.
- Paginate at 10 rows per page. Add a pager (Prev / page X of N / Next) below the results table; clicking updates `page` in the URL.
- Reset to page 1 whenever any filter/sort/search changes (in `update()` helper).

## 2. Auth (Lovable Cloud)
Enable Lovable Cloud, then add email/password + Google sign-in:
- `src/routes/auth.tsx` — public sign-in / sign-up page (Supabase via `@/integrations/supabase/client`, plus `lovable.auth.signInWithOAuth("google", ...)` per broker requirement).
- `src/routes/_authenticated/route.tsx` is integration-managed; rely on it.
- Root route (`__root.tsx`) header: show "Sign in" when signed out, and account menu / "Sign out" when signed in. Wire the `onAuthStateChange` subscriber (filtered to SIGNED_IN/OUT/USER_UPDATED) to `router.invalidate()`.
- Enable Google provider via `supabase--configure_social_auth`.

## 3. Server-side watchlist
Migration creating `public.watchlists` (one row per user):
```
user_id uuid PK references auth.users,
email text,
countries text[], visa_types text[], statuses text[],
frequency text, enabled bool,
updated_at timestamptz
```
+ GRANTs + RLS: user can select/insert/update/delete own row.

Move `/watchlist` under `src/routes/_authenticated/watchlist.tsx` (delete top-level `watchlist.tsx`). Server functions in `src/lib/watchlist.functions.ts` using `requireSupabaseAuth`:
- `getMyWatchlist` — returns row or defaults.
- `saveMyWatchlist` — upsert.
Component loads via `useServerFn` + `useQuery`, saves via mutation. Keep the existing preview-of-matches UI.

Update header/nav link to `/watchlist` — clicking while signed out lands on `/auth` via the managed gate.

## 4. Email notifications
- Set up Lovable email domain (prompt user via `<presentation-open-email-setup>` only if none is configured).
- Scaffold app email templates (`email_domain--scaffold_transactional_email_templates`).
- Add template `src/lib/email-templates/watchlist-alert.tsx` — subject "New immigration change: {title}", body includes country/visa/effective date/status, key change summary, and a prominent "View official source" button linking to `sourceUrl`, plus a "View on Immigration Radar" link to `/updates/{id}`.
- Admin publish flow (MVP): add server function `notifyWatchlistMatches({ changeId })` that loads the change from `immigration-data`, queries `watchlists` where `enabled=true` and (country in `countries` or countries empty) and (visa in `visa_types` or empty) and (status in `statuses` or empty), then calls `sendTemplateEmail('watchlist-alert', row.email, { templateData, idempotencyKey: `watchlist-${changeId}-${user_id}` })` per match.
- Add a small "Send alerts for this change" admin button on `/updates/$id` (visible to signed-in users for MVP; gated later) that invokes the server fn. Show success/failure toast.

## Technical notes
- Everything stays on Lovable Cloud + TanStack Start server functions; no edge functions.
- Preserve existing dark Bloomberg-terminal aesthetic; new UI reuses existing tokens (`ring-gradient`, `bg-card-gradient`, `glow-cyan`).
- `localStorage` fallback in `watchlist.tsx` is removed once server-side load works; matches preview keeps working from loaded prefs.
