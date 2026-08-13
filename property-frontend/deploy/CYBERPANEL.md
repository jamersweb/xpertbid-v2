# Deploy property.xpertbid.com on CyberPanel + OpenLiteSpeed

Server stack: **OpenLiteSpeed** (`lshttpd`) + **CyberPanel** (port 8090).  
Next.js already runs on PM2: `127.0.0.1:3000`.

Do **not** install Nginx — it will conflict with OLS on :80/:443.

---

## 1. DNS

A record: `property.xpertbid.com` → same IP as `xpertbid.com`.

---

## 2. Create subdomain in CyberPanel

1. Open `https://YOUR_SERVER_IP:8090`
2. **Websites → Create Website** (or Manage `xpertbid.com` → Create Subdomain)
3. Domain: `property.xpertbid.com`
4. PHP version: any (unused — we proxy to Node)
5. Create website / subdomain

This creates something like:

- `/home/property.xpertbid.com/`
- `/usr/local/lsws/conf/vhosts/property.xpertbid.com/`

---

## 3. SSL

CyberPanel → **SSL** → Issue for `property.xpertbid.com` (Let's Encrypt).

---

## 4. Reverse proxy to Next.js (port 3000)

### Option A — LiteSpeed WebAdmin (recommended)

1. Open LiteSpeed WebAdmin (often `https://YOUR_IP:7080`)  
   Or CyberPanel → **Server → LiteSpeed WebAdmin**
2. **Virtual Hosts** → `property.xpertbid.com`
3. **External App** → Add:
   - Name: `nodejs-property`
   - Type: `Proxy`
   - Address: `http://127.0.0.1:3000`
   - Max Connections: `100`
   - Initial Timeout: `60`
   - Retry Timeout: `0`
   - Response Buffering: `No`
4. **Context** → Add:
   - URI: `/`
   - Type: `Proxy`
   - Handler: `nodejs-property`
5. **Graceful Restart** OpenLiteSpeed

### Option B — Edit `vhconf.conf` by hand

```bash
ls /usr/local/lsws/conf/vhosts/property.xpertbid.com/
# usually vhconf.conf
```

Add (or merge) into that vhost config — see `openlitespeed-property.vhconf.snippet` in this folder — then:

```bash
/usr/local/lsws/bin/lswsctrl restart
# or
systemctl restart lshttpd
```

---

## 5. Confirm PM2

```bash
pm2 status
pm2 save
curl -I http://127.0.0.1:3000
```

---

## 6. Laravel env (main app)

On the Laravel host `.env`:

```env
FRONTEND_PROPERTY_URL=https://property.xpertbid.com
PROPERTY_ROOT_CATEGORY_ID=222
```

```bash
php artisan config:clear
php artisan config:cache
```

---

## 7. Smoke test

- https://property.xpertbid.com/
- https://property.xpertbid.com/properties
- https://xpertbid.com/ still OK
