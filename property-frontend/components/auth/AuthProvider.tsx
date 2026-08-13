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

function clearMainSyncFlags() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (key?.startsWith("xb_main_synced_")) keys.push(key);
  }
  keys.forEach((key) => window.sessionStorage.removeItem(key));
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
      const hadAuthToken = Boolean(authToken);
      if (authToken) {
        storeToken(authToken);
        url.searchParams.delete("auth_token");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
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
          // Already logged in on property but main-site cookie may be missing.
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
    await logoutApi();
    clearMainSyncFlags();
    setUser(null);
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
