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

const LAST_HANDOFF_KEY = "xb_last_handoff_check";

function clearHandoffFlags() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(LAST_HANDOFF_KEY);
}

function clearMainSyncFlags() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (key?.startsWith("xb_main_synced_")) keys.push(key);
  }
  keys.forEach((key) => window.sessionStorage.removeItem(key));
  clearHandoffFlags();
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

/** Clean URL for handoff return_to (no auth query noise). */
function cleanReturnUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("auth_token");
  url.searchParams.delete("auth_checked");
  url.searchParams.delete("logged_out");
  return url.toString();
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

  // Auto-sync authentication whenever user switches back to this tab (no refresh needed)
  useEffect(() => {
    const handleTabRevisit = () => {
      if (typeof document !== "undefined" && document.visibilityState && document.visibilityState !== "visible") {
        return;
      }

      const token = getStoredToken();
      if (token) {
        // If we already have a token, verify if user is still logged in or logged out on main site
        void refreshUser();
      } else {
        // If we don't have a token, check if user logged in on the main site while away
        const lastCheck = Number(window.sessionStorage.getItem(LAST_HANDOFF_KEY) || 0);
        if (Date.now() - lastCheck > 2500) {
          window.sessionStorage.setItem(LAST_HANDOFF_KEY, String(Date.now()));
          const returnTo = encodeURIComponent(cleanReturnUrl());
          window.location.replace(`${MAIN_SITE_URL}/auth/property-handoff?return_to=${returnTo}`);
        }
      }
    };

    window.addEventListener("focus", handleTabRevisit);
    document.addEventListener("visibilitychange", handleTabRevisit);
    return () => {
      window.removeEventListener("focus", handleTabRevisit);
      document.removeEventListener("visibilitychange", handleTabRevisit);
    };
  }, [refreshUser]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      const authToken = url.searchParams.get("auth_token");
      const authChecked = url.searchParams.get("auth_checked") === "1";
      const loggedOutParam = url.searchParams.get("logged_out") === "1";
      const hadAuthToken = Boolean(authToken);

      const stripAuthParams = () => {
        url.searchParams.delete("auth_token");
        url.searchParams.delete("auth_checked");
        url.searchParams.delete("logged_out");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      };

      if (loggedOutParam) {
        clearStoredToken();
        clearHandoffFlags();
        stripAuthParams();
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (authToken) {
        storeToken(authToken);
        clearHandoffFlags();
        stripAuthParams();
      } else if (authChecked) {
        window.sessionStorage.setItem(LAST_HANDOFF_KEY, String(Date.now()));
        stripAuthParams();
      }

      const lastCheck = Number(window.sessionStorage.getItem(LAST_HANDOFF_KEY) || 0);
      const recentlyChecked = Date.now() - lastCheck < 15000;

      // If we don't have a token, check once with Laravel main site
      if (!getStoredToken() && !authChecked && !recentlyChecked) {
        window.sessionStorage.setItem(LAST_HANDOFF_KEY, String(Date.now()));
        const returnTo = encodeURIComponent(cleanReturnUrl());
        window.location.replace(`${MAIN_SITE_URL}/auth/property-handoff?return_to=${returnTo}`);
        return;
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
    clearMainSyncFlags();
    await establishMainSiteSession(redirectUrl);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      clearStoredToken();
    }
    clearMainSyncFlags();
    setUser(null);

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
