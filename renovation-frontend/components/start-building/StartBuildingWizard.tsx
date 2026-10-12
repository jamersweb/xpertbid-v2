"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryNode } from "@/types/property";
import {
  propertyListingsUrl,
  resolveBuildingBrowseUrl,
  type BuildingNeed,
  type PlotAnswer,
} from "@/lib/startBuilding";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  purposes: CategoryNode[];
};

type Step = "plot" | "need";

const NEED_OPTIONS: {
  key: BuildingNeed;
  title: string;
  subtitle: string;
  icon: string;
}[] = [
  {
    key: "architect",
    title: "Architect",
    subtitle: "Floor plans & 3D design",
    icon: "fa-compass-drafting",
  },
  {
    key: "contractor",
    title: "Contractor",
    subtitle: "Grey structure & turnkey",
    icon: "fa-helmet-safety",
  },
  {
    key: "materials",
    title: "Construction materials",
    subtitle: "Cement, steel, bricks…",
    icon: "fa-cubes",
  },
];

export function StartBuildingWizard({ isOpen, onClose, purposes }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("plot");
  const [fallbackNote, setFallbackNote] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep("plot");
      setFallbackNote("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePlot = (answer: PlotAnswer) => {
    if (answer === "no") {
      window.location.href = propertyListingsUrl();
      return;
    }
    setFallbackNote("");
    setStep("need");
  };

  const handleNeed = (need: BuildingNeed) => {
    const target = resolveBuildingBrowseUrl(purposes, need);
    if (target.usedFallback) {
      setFallbackNote("Showing all Home Builder listings");
      window.setTimeout(() => {
        onClose();
        router.push(target.href);
      }, 700);
      return;
    }
    onClose();
    router.push(target.href);
  };

  return (
    <div
      className="loginModal startBuildingModal"
      style={{ display: "block" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="startBuildingTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="loginModal-content startBuildingModal-content">
        <span
          className="close-btn"
          id="closeStartBuildingModal"
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClose();
          }}
        >
          <i className="fa-solid fa-xmark" />
        </span>

        {step === "need" ? (
          <button
            type="button"
            className="startBuilding-back"
            onClick={() => {
              setFallbackNote("");
              setStep("plot");
            }}
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
        ) : null}

        {step === "plot" ? (
          <div className="startBuilding-step text-center">
            <h3 id="startBuildingTitle" className="mb-2 fw-bold">
              Start Building
            </h3>
            <p className="startBuilding-lead mb-4">Do you have a plot?</p>
            <div className="startBuilding-options">
              <button
                type="button"
                className="startBuilding-option"
                onClick={() => handlePlot("yes")}
              >
                <span className="startBuilding-option-title">Yes</span>
                <span className="startBuilding-option-sub">I already own land</span>
              </button>
              <button
                type="button"
                className="startBuilding-option"
                onClick={() => handlePlot("no")}
              >
                <span className="startBuilding-option-title">No</span>
                <span className="startBuilding-option-sub">Help me find a plot</span>
              </button>
              <button
                type="button"
                className="startBuilding-option"
                onClick={() => handlePlot("not_sure")}
              >
                <span className="startBuilding-option-title">Not sure</span>
                <span className="startBuilding-option-sub">Browse building services</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="startBuilding-step text-center">
            <h3 id="startBuildingTitle" className="mb-2 fw-bold">
              What do you need?
            </h3>
            <p className="startBuilding-lead mb-4">
              We&apos;ll show matching Home Builder products
            </p>
            {fallbackNote ? (
              <p className="startBuilding-fallback mb-3" role="status">
                {fallbackNote}
              </p>
            ) : null}
            <div className="startBuilding-options">
              {NEED_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className="startBuilding-option"
                  onClick={() => handleNeed(opt.key)}
                >
                  <span className="startBuilding-option-icon" aria-hidden="true">
                    <i className={`fa-solid ${opt.icon}`} />
                  </span>
                  <span className="startBuilding-option-title">{opt.title}</span>
                  <span className="startBuilding-option-sub">{opt.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
