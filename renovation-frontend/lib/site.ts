export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://property.xpertbid.com";

/** Main XpertBid marketplace (Inertia) — logos, auth, sell, policies */
export const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL?.replace(/\/$/, "") ||
  "https://xpertbid.com";

export function mainUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${MAIN_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Local public assets mirrored from Laravel `public/assets` */
export function asset(path: string) {
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/assets/${path.replace(/^assets\//, "")}`;
}

export function assetImage(file: string) {
  return `/assets/images/${file.replace(/^\/+/, "")}`;
}
