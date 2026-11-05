"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredToken,
  establishMainSiteSessionSilent,
  fetchMe,
  fetchSatelliteTokenFromMain,
  getSessionLink,
  getStoredToken,
  logoutApi,
  logoutMainSiteSessionSilent,
  storeToken,
  type AuthUser,
} from "@/lib/api/auth";
import { MAIN_SITE_URL, mainUrl } from "@/lib/site";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setSession: (
    token: string,
    user: AuthUser,
    redirectUrl?: string,
    syncPopup?: Window | null
  ) => Promise<void>;
  logout: () => Promise<void>;
  openMainPath: (path: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Cooldown for credentialed main→satellite token pulls (no full-page handoff). */
const LAST_TOKEN_SYNC_KEY = "xb_last_satellite_token_sync";
const TOKEN_SYNC_COOLDOWN_MS = 15000;
const LOGGED_OUT_KEY = "xb_satellite_logged_out";

function clearSyncFlags() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(LAST_TOKEN_SYNC_KEY);
  const keys: string[] = [];
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (key?.startsWith("xb_main_synced_")) keys.push(key);
  }
  keys.forEach((key) => window.sessionStorage.removeItem(key));
}

/** Same pattern as desktop header avatar (SiteChrome / MobileBottomNav). */
export function resolveProfileImageSrc(src?: string | null) {
  if (!src) return "/assets/images/user.jpg";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src.startsWith("/") && !src.startsWith("//")
      ? `${MAIN_SITE_URL}${src}`
      : src;
  }
  return `${MAIN_SITE_URL}/${src.replace(/^\/+/, "")}`;
}

export function resolveProfileImage(user: AuthUser | null) {
  return resolveProfileImageSrc(user?.profile_pic);
}

function stripAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("auth_token");
  url.searchParams.delete("auth_checked");
  url.searchParams.delete("logged_out");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function canAttemptTokenSync() {
  if (window.sessionStorage.getItem(LOGGED_OUT_KEY) === "1") return false;
  const last = Number(window.sessionStorage.getItem(LAST_TOKEN_SYNC_KEY) || 0);
  return Date.now() - last >= TOKEN_SYNC_COOLDOWN_MS;
}

function markTokenSyncAttempt() {
  window.sessionStorage.setItem(LAST_TOKEN_SYNC_KEY, String(Date.now()));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const lastRevisitRef = useRef<number>(0);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
    } catch (err: unknown) {
      const status =
        (err as { status?: number; statusCode?: number })?.status ||
        (err as { status?: number; statusCode?: number })?.statusCode;
      // ONLY clear token if the server explicitly returned 401 Unauthorized
      if (status === 401) {
        clearStoredToken();
        setUser(null);
      }
    }
  }, []);

  const tryPullTokenFromMain = useCallback(async (): Promise<boolean> => {
    if (!canAttemptTokenSync()) return false;
    markTokenSyncAttempt();
    const result = await fetchSatelliteTokenFromMain();
    if (!result.authenticated || !result.token) return false;
    storeToken(result.token);
    window.sessionStorage.removeItem(LOGGED_OUT_KEY);
    if (result.user) {
      setUser(result.user);
    } else {
      try {
        setUser(await fetchMe());
      } catch {
        clearStoredToken();
        setUser(null);
        return false;
      }
    }
    return true;
  }, []);

  // Soft re-sync when returning to the tab (credentialed fetch — no redirect).
  useEffect(() => {
    const handleTabRevisit = () => {
      if (typeof document !== "undefined" && document.visibilityState && document.visibilityState !== "visible") {
        return;
      }
      // Throttle revisit checks to once every 10 seconds to prevent rapid focus/visibility loops
      const now = Date.now();
      if (now - lastRevisitRef.current < 10000) {
        return;
      }
      lastRevisitRef.current = now;

      if (getStoredToken()) {
        void refreshUser();
        return;
      }
      void tryPullTokenFromMain();
    };

    window.addEventListener("focus", handleTabRevisit);
    document.addEventListener("visibilitychange", handleTabRevisit);
    return () => {
      window.removeEventListener("focus", handleTabRevisit);
      document.removeEventListener("visibilitychange", handleTabRevisit);
    };
  }, [refreshUser, tryPullTokenFromMain]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      const authToken = url.searchParams.get("auth_token");
      const authChecked = url.searchParams.get("auth_checked") === "1";
      const loggedOutParam = url.searchParams.get("logged_out") === "1";

      if (loggedOutParam) {
        clearStoredToken();
        window.sessionStorage.setItem(LOGGED_OUT_KEY, "1");
        clearSyncFlags();
        stripAuthParamsFromUrl();
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (authToken) {
        storeToken(authToken);
        window.sessionStorage.removeItem(LOGGED_OUT_KEY);
        stripAuthParamsFromUrl();
      } else if (authChecked) {
        markTokenSyncAttempt();
        stripAuthParamsFromUrl();
      }

      // No local token: try silent same-site cookie SSO (live). Never full-page handoff.
      if (!getStoredToken()) {
        const pulled = await tryPullTokenFromMain();
        if (cancelled) return;
        if (!pulled) {
          setUser(null);
          setLoading(false);
          return;
        }
        setLoading(false);
        return;
      }

      try {
        const me = await fetchMe();
        if (cancelled) return;
        setUser(me);
        window.sessionStorage.removeItem(LOGGED_OUT_KEY);
      } catch {
        clearStoredToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [tryPullTokenFromMain]);

  const setSession = useCallback(async (
    token: string,
    nextUser: AuthUser,
    redirectUrl?: string,
    syncPopup?: Window | null
  ) => {
    // Stay on this page; silently set main web session so other sites can SSO.
    storeToken(token);
    setUser(nextUser);
    window.sessionStorage.removeItem(LOGGED_OUT_KEY);
    clearSyncFlags();
    try {
      await establishMainSiteSessionSilent(redirectUrl, syncPopup);
    } catch {
      // Satellite session still valid; main sync can happen on next openMainPath.
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      clearStoredToken();
    }
    clearSyncFlags();
    setUser(null);
    window.sessionStorage.setItem(LOGGED_OUT_KEY, "1");

    const silentOk = await logoutMainSiteSessionSilent();
    if (silentOk) return;

    const returnTo = encodeURIComponent(`${window.location.origin}/`);
    window.location.replace(`${MAIN_SITE_URL}/auth/property-logout?return_to=${returnTo}`);
  }, []);

  const openMainPath = useCallback(async (path: string) => {
    const target = path.startsWith("http") ? path : mainUrl(path);
    if (!getStoredToken()) {
      window.location.assign(target);
      return;
    }
    try {
      const bridge = await getSessionLink(target);
      window.location.assign(bridge);
    } catch {
      window.location.assign(target);
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
