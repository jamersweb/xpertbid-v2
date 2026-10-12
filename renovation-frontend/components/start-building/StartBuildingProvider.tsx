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
import { StartBuildingWizard } from "@/components/start-building/StartBuildingWizard";
import type { CategoryNode } from "@/types/property";

type StartBuildingContextValue = {
  openStartBuilding: () => void;
  closeStartBuilding: () => void;
  isOpen: boolean;
};

const StartBuildingContext = createContext<StartBuildingContextValue | null>(null);

type Props = {
  children: ReactNode;
  purposes?: CategoryNode[];
};

export function StartBuildingProvider({ children, purposes = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const openStartBuilding = useCallback(() => setIsOpen(true), []);

  const closeStartBuilding = useCallback(() => {
    setIsOpen(false);
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get("start") === "building") {
      currentUrl.searchParams.delete("start");
      window.history.replaceState(
        {},
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const start = new URL(window.location.href).searchParams.get("start");
    if (start === "building") setIsOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openStartBuilding, closeStartBuilding, isOpen }),
    [openStartBuilding, closeStartBuilding, isOpen]
  );

  return (
    <StartBuildingContext.Provider value={value}>
      {children}
      <StartBuildingWizard
        isOpen={isOpen}
        onClose={closeStartBuilding}
        purposes={purposes}
      />
    </StartBuildingContext.Provider>
  );
}

export function useStartBuilding() {
  const context = useContext(StartBuildingContext);
  if (!context) {
    throw new Error("useStartBuilding must be used within a StartBuildingProvider");
  }
  return context;
}
