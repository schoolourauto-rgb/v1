# Required Environment Variables for Production

These must be set in your Vercel/production environment for all Supabase and dealer routes to work:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-side only)

If any are missing, dealer routes and Supabase logic will fail in production.

## How to set in Vercel
1. Go to your Vercel dashboard → Project → Settings → Environment Variables.
2. Add the above variables with correct values from your Supabase project.
3. Redeploy after saving.

---

If you use `.env.local` for local dev, make sure these are also present there for local testing.
