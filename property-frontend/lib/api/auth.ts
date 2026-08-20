import { MAIN_SITE_URL } from "@/lib/site";

/** Same-origin Next proxy → Laravel `/api/v1` (avoids browser CORS). */
const API_BASE = "/api";

const TOKEN_KEY = "property_auth_token";

export type AuthUser = {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  profile_pic?: string | null;
  role?: string | null;
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
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
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
    throw new Error(firstError(json, "Something went wrong. Please try again."));
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
  type: "login" | "register";
  otp_type?: "sms" | "whatsapp";
}) {
  return authPost("/auth/send-otp", input);
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

export async function establishMainSiteSession(preferredBridgeUrl?: string) {
  if (typeof window === "undefined") return;

  let bridgeUrl = preferredBridgeUrl || "";
  if (!bridgeUrl) {
    bridgeUrl = await getSessionLink(window.location.href);
  }

  // Full navigation is required so the Laravel session cookie is first-party.
  window.location.replace(bridgeUrl);
}

/** @deprecated use establishMainSiteSession */
export function syncMainSiteSession(redirectUrl?: string) {
  void establishMainSiteSession(redirectUrl);
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
