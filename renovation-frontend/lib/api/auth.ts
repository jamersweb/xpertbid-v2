import { MAIN_SITE_URL } from "@/lib/site";

/** Same-origin Next proxy → Laravel `/api/v1` (avoids browser CORS). */
const API_BASE = "/api";

const TOKEN_KEY = "renovation_auth_token";

export type AuthUser = {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  profile_pic?: string | null;
  role?: string | null;
  is_corporate_verified?: boolean;
  is_verified?: boolean;
  verification_type?: string | null;
};

type AuthJson = {
  message?: string;
  redirect_url?: string;
  token?: string;
  user?: AuthUser;
  data?: AuthUser | unknown;
  url?: string;
  errors?: Record<string, string[] | string>;
  email?: string;
};

function firstError(json: AuthJson, fallback: string) {
  if (json.message) return json.message;
  if (json.email) return json.email;
  const errors = json.errors;
  if (errors) {
    const first = Object.values(errors)[0];
    if (Array.isArray(first)) return first[0] || fallback;
    if (typeof first === "string") return first;
  }
  return fallback;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  const legacy = window.localStorage.getItem("property_auth_token");
  if (legacy) {
    window.localStorage.setItem(TOKEN_KEY, legacy);
    window.localStorage.removeItem("property_auth_token");
    return legacy;
  }
  return null;
}

export function storeToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.removeItem("property_auth_token");
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem("property_auth_token");
}

async function authFetch(path: string, init?: RequestInit) {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  const json = (await res.json().catch(() => ({}))) as AuthJson;

  if (!res.ok) {
    const err = new Error(firstError(json, "Something went wrong. Please try again.")) as Error & {
      status?: number;
      statusCode?: number;
    };
    err.status = res.status;
    err.statusCode = res.status;
    throw err;
  }

  return json;
}

async function authPost(path: string, body: Record<string, unknown>) {
  return authFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function returnTo() {
  if (typeof window === "undefined") return undefined;
  return window.location.href;
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
  remember?: boolean;
}) {
  return authPost("/auth/login", {
    ...input,
    return_to: returnTo(),
  });
}

export async function registerWithEmail(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  return authPost("/auth/register", {
    ...input,
    signup_source: "property_web",
    return_to: returnTo(),
  });
}

export async function forgotPassword(email: string) {
  return authPost("/auth/forgot-password", { email });
}

export async function sendAuthOtp(input: {
  phone: string;
  type: "login" | "register" | "forgot_password";
  otp_type?: "sms" | "whatsapp";
}) {
  return authPost("/auth/send-otp", input);
}

export async function validateResetOtp(input: {
  phone: string;
  otp: string;
}) {
  return authPost("/auth/validate-reset-otp", input);
}

export async function resetPasswordWithPhone(input: {
  phone: string;
  otp: string;
  password: string;
  password_confirmation: string;
}) {
  return authPost("/auth/reset-password-phone", input);
}

export async function verifyAuthOtp(input: {
  phone: string;
  otp: string;
  name?: string;
  password?: string;
}) {
  return authPost("/auth/verify-otp", {
    ...input,
    signup_source: "property_web",
    return_to: returnTo(),
  });
}

export async function fetchMe(): Promise<AuthUser> {
  const json = await authFetch("/auth/me");
  return json.data as AuthUser;
}

export async function logoutApi() {
  try {
    await authPost("/auth/logout", {});
  } catch {
    // ignore
  } finally {
    clearStoredToken();
  }
}

export async function getSessionLink(to: string) {
  const json = await authPost("/auth/session-link", { to });
  return json.url as string;
}

type SatelliteTokenResponse = {
  authenticated?: boolean;
  token?: string;
  user?: AuthUser;
  ok?: boolean;
};

/**
 * Pull Sanctum token from main-site web session (credentialed).
 * Works on live when SESSION_DOMAIN=.xpertbid.com (same-site).
 * On localhost ports (cross-site + SameSite=Lax) this usually returns guest — no bounce.
 */
export async function fetchSatelliteTokenFromMain(): Promise<{
  authenticated: boolean;
  token?: string;
  user?: AuthUser;
}> {
  if (typeof window === "undefined") {
    return { authenticated: false };
  }

  try {
    const res = await fetch(`${MAIN_SITE_URL}/auth/satellite-token`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { authenticated: false };
    const json = (await res.json().catch(() => ({}))) as SatelliteTokenResponse;
    if (!json.authenticated || !json.token) {
      return { authenticated: false };
    }
    return {
      authenticated: true,
      token: json.token,
      user: json.user,
    };
  } catch {
    return { authenticated: false };
  }
}

/** Clear main web session when same-site cookies work. Returns false if FE should use redirect fallback. */
export async function logoutMainSiteSessionSilent(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch(`${MAIN_SITE_URL}/auth/satellite-logout`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: "{}",
    });
    return res.ok;
  } catch {
    return false;
  }
}

function withSilentParam(bridgeUrl: string) {
  try {
    const u = new URL(bridgeUrl);
    u.searchParams.set("silent", "1");
    return u.toString();
  } catch {
    const join = bridgeUrl.includes("?") ? "&" : "?";
    return `${bridgeUrl}${join}silent=1`;
  }
}

function mainOrigin() {
  try {
    return new URL(MAIN_SITE_URL).origin;
  } catch {
    return MAIN_SITE_URL;
  }
}

/** Open during the click handler (before await) so the browser allows the popup. */
export function openAuthSyncPopup(): Window | null {
  if (typeof window === "undefined") return null;
  try {
    return window.open(
      "about:blank",
      "xb_auth_sync",
      "popup=yes,width=40,height=40,left=0,top=0"
    );
  } catch {
    return null;
  }
}

/**
 * Set Laravel web session from a satellite login without navigating the current page.
 * Prefer a pre-opened popup (from openAuthSyncPopup) for SameSite=Lax / localhost.
 */
export async function establishMainSiteSessionSilent(
  preferredBridgeUrl?: string,
  preopenedPopup?: Window | null
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  let bridgeUrl = preferredBridgeUrl || "";
  if (!bridgeUrl) {
    try {
      bridgeUrl = await getSessionLink(window.location.href);
    } catch {
      try {
        preopenedPopup?.close();
      } catch {
        // ignore
      }
      return false;
    }
  }

  // Ensure localhost / 127.0.0.1 and port match MAIN_SITE_URL so cookies land on the exact origin the user visits
  if (bridgeUrl) {
    try {
      const u = new URL(bridgeUrl);
      const targetMain = new URL(MAIN_SITE_URL);
      if (
        (u.hostname === "localhost" || u.hostname === "127.0.0.1") &&
        (targetMain.hostname === "localhost" || targetMain.hostname === "127.0.0.1")
      ) {
        bridgeUrl = `${targetMain.origin}${u.pathname}${u.search}`;
      }
    } catch {
      // ignore
    }
  }

  const silentUrl = withSilentParam(bridgeUrl);
  const expectedOrigin = mainOrigin();

  return new Promise((resolve) => {
    let settled = false;
    let iframe: HTMLIFrameElement | null = null;
    let popup: Window | null = preopenedPopup && !preopenedPopup.closed ? preopenedPopup : null;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMessage);
      try {
        iframe?.remove();
      } catch {
        // ignore
      }
      try {
        popup?.close();
      } catch {
        // ignore
      }
      resolve(ok);
    };

    const onMessage = (event: MessageEvent) => {
      let matches = event.origin === expectedOrigin;
      if (!matches) {
        try {
          const u = new URL(event.origin);
          const exp = new URL(expectedOrigin);
          matches =
            (u.hostname === "localhost" || u.hostname === "127.0.0.1") &&
            (exp.hostname === "localhost" || exp.hostname === "127.0.0.1") &&
            u.port === exp.port;
        } catch {
          matches = false;
        }
      }
      if (!matches) return;
      const data = event.data as { type?: string; ok?: boolean } | null;
      if (data?.type === "xb-auth-sync") {
        finish(Boolean(data.ok));
      }
    };

    window.addEventListener("message", onMessage);

    if (popup) {
      try {
        popup.location.replace(silentUrl);
      } catch {
        popup = null;
      }
    }

    if (!popup || popup.closed) {
      // Popup missing/blocked — iframe (works when same-site, e.g. live subdomains).
      iframe = document.createElement("iframe");
      iframe.setAttribute("title", "auth-sync");
      iframe.style.cssText =
        "position:absolute;width:0;height:0;border:0;clip:rect(0,0,0,0);";
      iframe.src = silentUrl;
      document.body.appendChild(iframe);
    }

    window.setTimeout(() => finish(true), 2500);
  });
}

/** @deprecated use establishMainSiteSessionSilent */
export async function establishMainSiteSession(preferredBridgeUrl?: string) {
  return establishMainSiteSessionSilent(preferredBridgeUrl);
}

/** @deprecated */
export function syncMainSiteSession(redirectUrl?: string) {
  void establishMainSiteSessionSilent(redirectUrl);
}

export function completeAuthRedirect(redirectUrl?: string) {
  if (redirectUrl) {
    window.location.href = redirectUrl;
    return;
  }
  window.location.href = MAIN_SITE_URL;
}

export function googleAuthUrl() {
  const returnToValue =
    typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const qs = returnToValue ? `?return_to=${returnToValue}` : "";
  return `${MAIN_SITE_URL}/auth/google${qs}`;
}

export type { AuthJson };
