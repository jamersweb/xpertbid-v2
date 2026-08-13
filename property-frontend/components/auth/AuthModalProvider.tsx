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
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

type AuthModal = "login" | "register" | null;

type AuthModalContextValue = {
  openLogin: () => void;
  openRegister: () => void;
  closeModals: () => void;
  activeModal: AuthModal;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<AuthModal>(null);

  const openLogin = useCallback(() => setActiveModal("login"), []);
  const openRegister = useCallback(() => setActiveModal("register"), []);

  const closeModals = useCallback(() => {
    setActiveModal(null);
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("auth")) {
      currentUrl.searchParams.delete("auth");
      window.history.replaceState(
        {},
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const authMode = new URL(window.location.href).searchParams.get("auth");
    if (authMode === "login") setActiveModal("login");
    if (authMode === "register") setActiveModal("register");
  }, []);

  const value = useMemo(
    () => ({ openLogin, openRegister, closeModals, activeModal }),
    [openLogin, openRegister, closeModals, activeModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <LoginModal
        isOpen={activeModal === "login"}
        onClose={closeModals}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={activeModal === "register"}
        onClose={closeModals}
        onSwitchToLogin={openLogin}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
