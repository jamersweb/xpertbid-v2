# Deploying property.xpertbid.com

Same VPS as the main Laravel app. Nginx routes by hostname; Next.js runs under PM2; API stays on `xpertbid.com`.

## 1. DNS

Point `property.xpertbid.com` A/AAAA records to the VPS IP (same as `xpertbid.com`).

## 2. Laravel env (main app)

```env
PROPERTY_ROOT_CATEGORY_ID=222
FRONTEND_PROPERTY_URL=https://property.xpertbid.com
```

Confirm CORS allowlist includes the property origin (`config/cors.php`).

Smoke-test after deploy:

```bash
curl -s https://xpertbid.com/api/v1/health
curl -sI https://xpertbid.com/          # Inertia home still OK
curl -s "https://xpertbid.com/api/v1/properties?per_page=1"
```

## 3. Build Next.js

```bash
cd /var/www/xpertbid-v2/property-frontend
cp .env.example .env.production.local
# NEXT_PUBLIC_API_BASE_URL=https://xpertbid.com/api/v1
# NEXT_PUBLIC_SITE_URL=https://property.xpertbid.com
npm ci
npm run build
```

## 4. PM2

```bash
pm2 start npm --name property-frontend -- start -- -p 3000
# or: pm2 start ecosystem.config.cjs
pm2 save
```

Example `ecosystem.config.cjs` is in this folder.

## 5. Nginx

Install `nginx-property.xpertbid.com.conf` into sites-available, enable it, then:

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d property.xpertbid.com
```

Keep the existing `xpertbid.com` PHP-FPM vhost unchanged.

## 6. Smoke checklist

- [ ] `https://property.xpertbid.com/` loads
- [ ] `/properties` lists cards from API
- [ ] Property detail + related work
- [ ] `/sitemap.xml` and `/robots.txt` OK
- [ ] `https://xpertbid.com/` Inertia marketplace unaffected
- [ ] CORS: browser fetch from property origin to `/api/v1` succeeds
