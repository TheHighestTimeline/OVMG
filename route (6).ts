# OneVibe Compute Marketplace — Deploy Guide

## Quick start (local dev)

```bash
cd compute-marketplace
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Netlify

### Option A: Netlify CLI (fastest)
```bash
npm install -g netlify-cli
cd compute-marketplace
netlify login
netlify init        # link to site or create new
netlify deploy --prod
```

### Option B: Netlify Dashboard (drag & drop)
1. `npm install && npm run build` locally
2. Drag the `.next/` folder into app.netlify.com → Sites → Deploy

### Option C: Git-connected (recommended for ongoing)
1. Push `compute-marketplace/` to a GitHub repo
2. In Netlify: New site → Import from Git
3. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm install && npm run build`
   - Publish directory: `.next`
   - Node version: 20
4. Add the `@netlify/plugin-nextjs` plugin (already in `netlify.toml`)

## Environment variables

Set in Netlify dashboard → Site settings → Environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Optional | Resend API key for LOI email delivery. Get at resend.com. Without this, LOI submissions are logged server-side but no email is sent. |

## LOI email setup

1. Create a free account at https://resend.com
2. Verify your sending domain (`onevibemg.com`)
3. Copy your API key → paste as `RESEND_API_KEY` env var in Netlify
4. Update the `from:` address in `app/api/loi/route.ts` if needed

## Updating inventory / pricing

All inventory lives in one file: `lib/inventory.ts`

- To change a price: edit `pricePerUnit` on the relevant listing
- To change utilization: edit `utilPct` (triggers bar color: ≥80% red, 40–80% amber, <40% blue)
- To mark a site LIVE: change `status: 'PRE-ORDER'` → `status: 'LIVE'`
- To add a new listing: add an entry to the `LISTINGS` array
- To update portfolio stats (shown in the header): edit `PORTFOLIO_STATS`

## Custom domain

In Netlify: Site settings → Domain management → Add custom domain
Suggested: `compute.onevibemg.com`

## Tech stack

- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS + CSS variables (dark navy theme)
- **Email**: Resend (optional)
- **Hosting**: Netlify + `@netlify/plugin-nextjs`
- **No database**: inventory is static in `lib/inventory.ts`
- **No Stripe**: LOI flow collects contact info only, no payment at checkout
