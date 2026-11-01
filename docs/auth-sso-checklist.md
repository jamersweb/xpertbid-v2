# Auth SSO — no-bounce checklist

## Live (required env)

On production Laravel `.env`:

```env
SESSION_DOMAIN=.xpertbid.com
SESSION_SAME_SITE=lax
FRONTEND_PROPERTY_URL=https://property.xpertbid.com
FRONTEND_RENOVATION_URL=https://build.xpertbid.com
APP_URL=https://www.xpertbid.com
```

Do **not** set `SESSION_DOMAIN` on local (leave empty).

## Local verification

1. Open `http://localhost:3000` or `:3001` as guest — **no** redirect to `/auth/property-handoff`.
2. Login via modal — page stays; modal closes; avatar updates; **no** bridge flash.
3. Hard reload — still logged in (Sanctum token in localStorage).
4. Chat / Sell — single navigate to main (expected).
5. Logout — satellite clears; local may redirect once via `property-logout` (cookie cross-port).

## Live verification

1. Login on www → open build/property → logged in with **no** handoff bounce (`/auth/satellite-token`).
2. Guest visit satellites — no redirect loop.
3. Logout on satellite — silent `/auth/satellite-logout` when same-site cookies work.
