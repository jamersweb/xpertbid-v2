# Self-hosted streaming demo (480p-ready)

This stack gives you **RTMP ingest** and **HLS playback** in one container.  
**480p** is set on the **encoder (OBS)** — this demo does **not** transcode on the server (low CPU, ideal for KVM-class VPS).

## Requirements on the VPS

- **Docker Engine** + **Docker Compose** plugin (v2).
- Firewall: allow **1935/tcp** (RTMP) and **8899/tcp** (HLS HTTP), or whatever you map in `docker-compose.yml`.
- For production behind your domain with HTTPS, put **Nginx/Caddy** in front and **proxy_pass** `/hls/` to `http://127.0.0.1:8899/hls/` so the browser is not blocked by mixed content.

## Install Docker (AlmaLinux / RHEL / Rocky example)

```bash
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
```

## Start the demo

```bash
cd /path/to/v2/tools/streaming-demo
docker compose pull
docker compose up -d
curl -s http://127.0.0.1:8899/health
```

## OBS Studio (480p)

1. **Settings → Video**: Base & Output **854×480** (or **640×480**).
2. **Settings → Output**:
   - Encoder: **x264** (or hardware H.264 if available).
   - **Keyframe interval**: 2 s (or 1–2× your HLS segment length; segments here are **3 s**).
   - Bitrate: **1000–2000 Kbps** is plenty for 480p for web.
3. **Settings → Audio**: AAC, 128 kbps typical.
4. **Settings → Stream**:
   - Service: **Custom…**
   - Server: `rtmp://YOUR_SERVER_PUBLIC_IP:1935/live`
   - Stream key: e.g. `demo480` (any alphanumeric; becomes the HLS name).

**Playback URL** (replace IP and key):

`http://YOUR_SERVER_PUBLIC_IP:8899/hls/demo480.m3u8`

## Test player (Laravel site)

After your Laravel app is reachable, open:

`/streaming-demo-player.html?stream=demo480&hls=http://YOUR_SERVER_PUBLIC_IP:8899/hls/demo480.m3u8`

If your site is **HTTPS**, the M3U8 must also be **HTTPS** (reverse-proxy HLS) or the browser will block it.

## Stop / remove

```bash
docker compose down
```

## Next steps (not in this demo)

- **Laravel integration**: store `stream_key`, `scheduled_at`, `listing_id`; webhook or poll for “live”; **bids** stay in your app DB; optionally broadcast over **Reverb**.
- **Server-side transcode** (multiple qualities): needs **FFmpeg** + more CPU — upgrade VPS or use a second “media” server.
- **TLS for RTMPS**: optional; many setups use RTMP on private network / VPN to origin.
