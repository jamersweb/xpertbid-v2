"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="br-confirm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="br-confirm-title"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        className="br-confirm__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`br-confirm__icon ${danger ? "is-danger" : ""}`}>
          <i className={`fa-solid ${danger ? "fa-triangle-exclamation" : "fa-circle-question"}`} aria-hidden />
        </div>
        <h2 id="br-confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="br-confirm__actions">
          <button
            type="button"
            className="br-btn br-btn--outline"
            disabled={busy}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`br-btn ${danger ? "br-btn--danger" : "br-btn--dark"}`}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
      <style>{`
        .br-confirm {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(2px);
        }
        .br-confirm__panel {
          width: min(100%, 420px);
          border-radius: 1rem;
          background: #fff;
          padding: 1.35rem 1.35rem 1.2rem;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
          text-align: center;
        }
        .br-confirm__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          margin-bottom: 0.85rem;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 1.15rem;
        }
        .br-confirm__icon.is-danger {
          background: #fff1f2;
          color: #e11d48;
        }
        .br-confirm__panel h2 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
        }
        .br-confirm__panel p {
          margin: 0.55rem 0 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #64748b;
        }
        .br-confirm__actions {
          display: flex;
          gap: 0.6rem;
          margin-top: 1.25rem;
        }
        .br-confirm__actions .br-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          border: 0;
          cursor: pointer;
        }
        .br-confirm__actions .br-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .br-btn--outline {
          background: #fff;
          color: #334155;
          border: 1px solid #e2e8f0 !important;
        }
        .br-btn--outline:hover { background: #f8fafc; }
        .br-btn--dark {
          background: #0f172a;
          color: #fff;
        }
        .br-btn--dark:hover { background: #000; }
        .br-btn--danger {
          background: #e11d48;
          color: #fff;
        }
        .br-btn--danger:hover { background: #be123c; }
      `}</style>
    </div>
  );
}
