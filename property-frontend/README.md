# XpertBid Property Frontend

Next.js App Router site for **property.xpertbid.com**. Reads public property data from the Laravel API at `/api/v1` on the main XpertBid host. Does not replace the Inertia marketplace.

## Local development

```bash
# Terminal 1 — Laravel (from repo root)
php artisan serve

# Terminal 2 — Next.js
cd property-frontend
cp .env.example .env.local
# set NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
npm run dev
```

Open http://localhost:3000

## Environment

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://xpertbid.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://property.xpertbid.com` |
| `NEXT_PUBLIC_MAIN_SITE_URL` | `https://xpertbid.com` |
| `API_REVALIDATE_SECONDS` | `120` |

UI matches the main XpertBid site: same Bootstrap + `style.css`, `header-logo.png`, `footer-logo.png`, and `xp-prop-logo-clean.png`. Auth / Sell / policies link back to the main domain.

## Production

See [deploy/nginx-property.xpertbid.com.conf](./deploy/nginx-property.xpertbid.com.conf) and [deploy/README.md](./deploy/README.md).
