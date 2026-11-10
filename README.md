# The VLVT Root

Luxury hospitality site built with Next.js App Router, Tailwind CSS, Framer Motion, Supabase, and Stripe. Ready for Vercel deployment.

## Vercel deployment

### 1. Create the Vercel project

- Import this project into Vercel.
- Framework preset: **Next.js**
- Build command: `npm run build`
- Install command: `npm install`

### 2. Configure environment variables

Add these in Vercel for every environment you plan to use:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RSVP_WEBHOOK_URL`
- `MEMBERSHIP_WEBHOOK_URL`
- `ADMIN_EMAIL`
- `ADMIN_NAME`
- `ADMIN_PASSCODE`
  - Passcode for `/admin/login`. Use a long random value.
- `PORTAL_PASSWORD`
  - Passcode for the member portal at `/portal`. Use a long random value.
- `PITCH_SPONSORS_TOKEN`
  - Access token for the link-only sponsor pitch page (`/p/sponsors/[token]`).
- `PITCH_DISPENSARY_TOKEN`
  - Access token for the link-only dispensary pitch page (`/p/dispensary/[token]`).

Generate each pitch token with `openssl rand -hex 24`. Rotating a token revokes every link that used the old one.

Never commit real values. `.env.example` holds placeholders only; real keys belong in Vercel environment variables and your local `.env.local`.

Optional:

- `NEXT_PUBLIC_SITE_URL`
  - Not required on Vercel if request headers are available.
  - Useful for local development or if you want an explicit canonical URL.

### 3. Initialize Supabase

Run the SQL in [supabase-schema.sql](./supabase-schema.sql) in the Supabase SQL editor.

This creates:

- `profiles`
- `settings`
- RLS policies
- seeded admin profile row

Then run [supabase/migrations/001_security_hardening.sql](./supabase/migrations/001_security_hardening.sql). It removes anonymous read access to `profiles`, pins the trigger function's `search_path`, and adds the `pitch_views` table. Both files are safe to run more than once. Never disable RLS on `profiles` or `settings`: signed-in users hold table grants and only the RLS policies limit writes to admins.

### 4. Seed or update the admin profile

After env vars are set, run:

```bash
npm run seed:admin
```

Use the email in `ADMIN_EMAIL` to request a magic link at `/admin/login`.

### 5. Configure Stripe webhook

In Stripe, create a webhook endpoint pointing to:

```text
https://your-domain.vercel.app/api/stripe/webhook
```

Subscribe to:

- `checkout.session.completed`

Then copy the webhook signing secret into:

- `STRIPE_WEBHOOK_SECRET`

### 6. Post-deploy checks

Verify these routes after deployment:

- `/`
- `/apply`
- `/experience`
- `/ethos`
- `/portal`
- `/admin/login`
- `/admin`

## Notes

- The homepage uses `dynamic = "force-dynamic"` so the Supabase `hero_video_url` setting updates without a redeploy.
- Stripe and Supabase server routes are pinned to the Node.js runtime for Vercel compatibility.
- The public site avoids restricted compliance terms; protected details remain in the gated portal.
