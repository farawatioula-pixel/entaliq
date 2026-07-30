# Intaleq 2026

Jordan's Digital Youth Income & Training Platform. Built with Next.js (App
Router), TypeScript, and Tailwind CSS.

## Pages

| Route        | What's there |
|--------------|--------------|
| `/`          | Home — hero, the gap Intaleq closes, the promise, tracks preview, trainers, partner logos, closing CTA |
| `/about`     | The full case for Intaleq and its self-sustaining model |
| `/tracks`    | All seven income tracks in detail |
| `/trainers`  | Trainer bios |
| `/partners`  | Sponsorship tiers, partner logos, and a working "Partner With Us" form |
| `/register`  | Two live application paths: Plenary (Amman) and Training (Ghor Al-Safi) |
| `/signup`, `/login` | Create an account or log in |
| `/profile`   | Edit your own profile and services (must be logged in) |
| `/directory` | Public directory of everyone's profiles and services |
| `/directory/[id]` | One person's public profile page |

Every nav link, CTA button, and form is functional — not a placeholder.

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How form submissions work

The Register and Partner forms POST to `/api/register` (see
`src/app/api/register/route.ts`). Out of the box, every submission is logged
server-side, which you can see in your terminal locally or in the **Vercel →
Project → Logs** tab in production.

To have submissions land in an actual inbox instead of just logs, connect a
form backend (no code changes needed):

1. Create a free form endpoint at [Formspree](https://formspree.io) (or
   [Getform](https://getform.io)/similar) and copy its endpoint URL.
2. In Vercel, go to **Project → Settings → Environment Variables** and add:
   - `FORM_ENDPOINT` = the endpoint URL you copied
3. Redeploy. Every registration and partner inquiry will now forward there.

## Editing content

All copy that repeats across pages (tracks, trainers, partner logos, stats,
the four "gap" cards, the four "promise" cards) lives in one place:

```
src/lib/data.ts
```

Edit the arrays there and every page that uses them updates automatically.

Colors and fonts are defined once in `src/app/globals.css`
(`--color-red`, `--color-ink`, `--color-paper`, `--color-line`) and in
`src/app/layout.tsx` (Archivo for headlines, Inter for body text).

## Setting up accounts & the directory (Supabase)

The Directory/Profile feature (`/signup`, `/login`, `/profile`, `/directory`)
needs a place to store accounts and profile data. This uses
[Supabase](https://supabase.com) (free tier, no credit card).

1. **Create a project**
   - Go to [supabase.com](https://supabase.com) → sign up → **New Project**.
   - Pick any name/password/region. Wait ~2 minutes for it to finish setting up.

2. **Create the database table**
   - In your Supabase project, go to **SQL Editor → New query**.
   - Open `supabase/schema.sql` in this repo, copy the whole file, paste it
     in, and click **Run**. This creates the `profiles` table and the rules
     that let people only edit their own profile.

3. **Get your keys**
   - Go to **Settings → API** in Supabase.
   - Copy the **Project URL** and the **anon public** key.

4. **Add them to Vercel**
   - In Vercel: **Project → Settings → Environment Variables**, add:
     - `NEXT_PUBLIC_SUPABASE_URL` = the Project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the anon public key
   - Redeploy.

5. **Turn off email confirmation (optional, recommended for now)**
   - By default Supabase makes new users click a confirmation email before
     they can log in. If you don't have email sending set up yet, go to
     **Authentication → Providers → Email** in Supabase and turn off
     "Confirm email" so signup works immediately.

To run it locally, copy `.env.local.example` to `.env.local` and fill in the
same two values.



1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Intaleq 2026 site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/intaleq.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
   - Import the `intaleq` repository.
   - Framework preset: Vercel auto-detects **Next.js** — leave build settings
     as default (`next build`).
   - Add the `FORM_ENDPOINT` environment variable now if you have one (see
     above), or add it later and redeploy.
   - Click **Deploy**.

3. **Custom domain (optional)**
   - In the Vercel project, go to **Settings → Domains** and add your domain
     (e.g. `intaleq.jo`), then follow the DNS instructions Vercel shows you.

Every future `git push` to `main` automatically redeploys the live site.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) for accounts and the profile directory (see
  setup section above)
- Contact forms forward to an external endpoint (see above) rather than
  storing data in the app itself.
