# رابطك — LinkBio SaaS

Arabic-first Link-in-Bio + mini store + WhatsApp + services + analytics platform.

## Production architecture
- Next.js App Router + TypeScript + Tailwind
- Supabase Auth/Postgres/Storage with RLS
- Visual drag-and-drop page builder
- Dynamic public `/[username]` pages
- Products, services, WhatsApp, analytics and SEO
- Whop webhook boundary with signature verification
- Vercel-ready deployment

## Required environment
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or legacy anon key)
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `WHOP_WEBHOOK_SECRET`

Never expose service-role or webhook secrets to the browser.

## Database
Apply `supabase/migrations` in order. Provider credentials are intentionally not hardcoded.

## Verify
`npm install`
`npm run lint`
`npm run build`
