"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredToken,
  establishMainSiteSession,
  fetchMe,
  getSessionLink,
  getStoredToken,
  logoutApi,
  storeToken,
  type AuthUser,
} from "@/lib/api/auth";
import { MAIN_SITE_URL, mainUrl } from "@/lib/site";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setSession: (token: string, user: AuthUser, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  openMainPath: (path: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const LOGGED_OUT_KEY = "xb_property_logged_out";
const HANDOFF_PENDING_KEY = "xb_main_handoff_pending";
const HANDOFF_RETRY_KEY = "xb_main_handoff_retry";

function clearMainSyncFlags() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (key?.startsWith("xb_main_synced_")) keys.push(key);
  }
  keys.forEach((key) => window.sessionStorage.removeItem(key));
  window.sessionStorage.removeItem(HANDOFF_PENDING_KEY);
  window.sessionStorage.removeItem(HANDOFF_RETRY_KEY);
}

function profileImageUrl(src?: string | null) {
  if (!src) return "/assets/images/user.jpg";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src.startsWith("/") && !src.startsWith("//")
      ? `${MAIN_SITE_URL}${src}`
      : src;
  }
  return `${MAIN_SITE_URL}/${src.replace(/^\/+/, "")}`;
}

export function resolveProfileImage(user: AuthUser | null) {
  return profileImageUrl(user?.profile_pic);
}

function currentPageUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}` || "/";
}

function absoluteReturnUrl() {
  return `${window.location.origin}${currentPageUrl()}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      clearStoredToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      const authToken = url.searchParams.get("auth_token");
      const authChecked = url.searchParams.get("auth_checked") === "1";
      const loggedOutParam = url.searchParams.get("logged_out") === "1";
      const hadAuthToken = Boolean(authToken);

      if (loggedOutParam) {
        clearStoredToken();
        window.sessionStorage.setItem(LOGGED_OUT_KEY, "1");
        window.sessionStorage.removeItem(HANDOFF_PENDING_KEY);
        url.searchParams.delete("logged_out");
        url.searchParams.delete("auth_token");
        url.searchParams.delete("auth_checked");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (authToken) {
        storeToken(authToken);
        window.sessionStorage.removeItem(LOGGED_OUT_KEY);
        window.sessionStorage.removeItem(HANDOFF_PENDING_KEY);
        url.searchParams.delete("auth_token");
        url.searchParams.delete("auth_checked");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      } else if (authChecked) {
        window.sessionStorage.removeItem(HANDOFF_PENDING_KEY);
        url.searchParams.delete("auth_checked");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }

      const explicitlyLoggedOut = window.sessionStorage.getItem(LOGGED_OUT_KEY) === "1";

      // Sync from main-site session when property has no token yet.
      if (!getStoredToken() && !explicitlyLoggedOut) {
        if (window.sessionStorage.getItem(HANDOFF_PENDING_KEY) === "1") {
          // Came back without a token — stay guest for this load.
          window.sessionStorage.removeItem(HANDOFF_PENDING_KEY);
        } else {
          window.sessionStorage.setItem(HANDOFF_PENDING_KEY, "1");
          const returnTo = encodeURIComponent(absoluteReturnUrl());
          window.location.replace(`${MAIN_SITE_URL}/auth/property-handoff?return_to=${returnTo}`);
          return;
        }
      }

      if (!getStoredToken()) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const me = await fetchMe();
        if (cancelled) return;
        setUser(me);
        window.sessionStorage.removeItem(LOGGED_OUT_KEY);

        const syncedKey = `xb_main_synced_${me.id}`;
        if (hadAuthToken) {
          window.sessionStorage.setItem(syncedKey, "1");
        } else if (window.sessionStorage.getItem(syncedKey) !== "1") {
          window.sessionStorage.setItem(syncedKey, "1");
          try {
            await establishMainSiteSession();
            return;
          } catch {
            window.sessionStorage.removeItem(syncedKey);
          }
        }
      } catch {
        clearStoredToken();
        if (
          !explicitlyLoggedOut &&
          window.sessionStorage.getItem(HANDOFF_RETRY_KEY) !== "1"
        ) {
          window.sessionStorage.setItem(HANDOFF_RETRY_KEY, "1");
          window.sessionStorage.removeItem(HANDOFF_PENDING_KEY);
          const returnTo = encodeURIComponent(absoluteReturnUrl());
          window.location.replace(`${MAIN_SITE_URL}/auth/property-handoff?return_to=${returnTo}`);
          return;
        }
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = useCallback(async (token: string, nextUser: AuthUser, redirectUrl?: string) => {
    storeToken(token);
    setUser(nextUser);
    window.sessionStorage.removeItem(LOGGED_OUT_KEY);
    clearMainSyncFlags();
    await establishMainSiteSession(redirectUrl);
  }, []);

  const logout = useCallback(async () => {
    // Always clear local session first (even if API CORS fails).
    try {
      await logoutApi();
    } catch {
      clearStoredToken();
    }
    clearMainSyncFlags();
    setUser(null);
    window.sessionStorage.setItem(LOGGED_OUT_KEY, "1");

    // Also end the main-site cookie session, then return here.
    const returnTo = encodeURIComponent(`${window.location.origin}/`);
    window.location.replace(`${MAIN_SITE_URL}/auth/property-logout?return_to=${returnTo}`);
  }, []);

  const openMainPath = useCallback(async (path: string) => {
    const target = path.startsWith("http") ? path : mainUrl(path);
    if (!getStoredToken()) {
      window.location.href = target;
      return;
    }
    try {
      const bridge = await getSessionLink(target);
      window.location.replace(bridge);
    } catch {
      window.location.href = target;
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, setSession, logout, openMainPath, refreshUser }),
    [user, loading, setSession, logout, openMainPath, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
