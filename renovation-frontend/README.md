# XpertBid Home Renovation Frontend

Next.js 15 (App Router) site for **home.xpertbid.com**. Reads public home renovation services, contractors, packages, and 3-level categories from the Laravel API at `/api/v1` on the main XpertBid host.

## Local development

```bash
# Terminal 1 — Laravel backend (from repo root)
php artisan serve

# Terminal 2 — Next.js Home Renovation Frontend
cd renovation-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or assigned port).

## Environment Variables

| Variable | Default / Example |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://127.0.0.1:8000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://home.xpertbid.com` |
| `NEXT_PUBLIC_MAIN_SITE_URL` | `https://xpertbid.com` |
| `API_REVALIDATE_SECONDS` | `120` |

## Key Features

- **20 Renovation Subcategories & 110 Child Categories**: Modular Kitchens, Bathrooms, Flooring, False Ceiling, Smart Home, Roofing, Painting, etc.
- **Interactive Budget Estimator**: Dynamic cost calculations per square foot.
- **Service Catalog with Multi-Filters**: 3-Level category facet, budget sliders, and city selectors.
- **Detailed Project Showcases**: Lightbox galleries, scope of work, warranty specs, and contractor badges.
- **Direct Lead Generation**: Free Quote & WhatsApp site inspection requests.
- **Automated SEO**: Dynamic sitemap (`sitemap.xml`) and JSON-LD schema.
