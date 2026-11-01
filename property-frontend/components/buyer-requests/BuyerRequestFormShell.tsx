"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { formatPostedDate, statusPill } from "@/components/buyer-requests/BrUi";
import type { BuyerRequestItem } from "@/lib/api/buyerRequests";

type Props = {
  title: string;
  isEdit?: boolean;
  buyerRequest?: BuyerRequestItem | null;
  submitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  cancelHref?: string;
};

export function FormCard({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="brf-card">
      {(title || description) && (
        <div className="brf-card__head">
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="brf-label">
      {children}
      {required ? <span className="brf-req">*</span> : null}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="brf-error">{message}</p>;
}

export default function BuyerRequestFormShell({
  title,
  isEdit = false,
  buyerRequest = null,
  submitting = false,
  submitLabel,
  submittingLabel,
  onSubmit,
  children,
  cancelHref = "/buyer-requests",
}: Props) {
  const pill = statusPill(buyerRequest?.status || "closed");

  return (
    <div className="brf-page">
      <div className="brf-inner">
        <div className="brf-top">
          <Link href={cancelHref} className="brf-back">
            <i className="fa-solid fa-arrow-left" aria-hidden />
            Back to Requests
          </Link>
          <h1>{title}</h1>
        </div>

        <form id="buyer-request-form" onSubmit={onSubmit}>
          <div className="brf-grid">
            <div className="brf-main">{children}</div>

            <aside className="brf-aside">
              <div className="brf-tips d-none d-lg-block">
                <div className="brf-tips__title">
                  <i className="fa-solid fa-lightbulb" aria-hidden />
                  Tips for quick offers
                </div>
                <ul>
                  <li>Describe scope clearly (rooms, size, materials)</li>
                  <li>Include reference images or mood boards</li>
                  <li>Mention preferred start / completion timeline</li>
                  <li>Set a realistic target budget</li>
                  <li>Add your area so nearby sellers can offer</li>
                </ul>
              </div>

              {isEdit && buyerRequest ? (
                <div className="brf-summary d-none d-lg-block">
                  <h2>Request summary</h2>
                  <dl>
                    <div>
                      <dt>
                        <i className="fa-solid fa-signal" aria-hidden /> Status
                      </dt>
                      <dd>
                        <span
                          className="br-pill"
                          style={{
                            background: pill.bg,
                            color: pill.color,
                            boxShadow: `inset 0 0 0 1px ${pill.ring}`,
                          }}
                        >
                          {buyerRequest.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <i className="fa-solid fa-clipboard-list" aria-hidden /> Offers
                      </dt>
                      <dd>
                        {buyerRequest.offers_count ?? buyerRequest.offers?.length ?? 0}
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <i className="fa-regular fa-calendar" aria-hidden /> Created
                      </dt>
                      <dd>{formatPostedDate(buyerRequest.created_at)}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="brf-summary d-none d-lg-block">
                  <h2>What happens next?</h2>
                  <ol className="brf-steps">
                    <li>
                      <span>1</span> Matched sellers get notified
                    </li>
                    <li>
                      <span>2</span> Compare offers and chat
                    </li>
                    <li>
                      <span>3</span> Accept the best offer
                    </li>
                  </ol>
                </div>
              )}

              <div className="brf-actions d-none d-lg-flex">
                <button type="submit" className="br-btn br-btn--dark w-100" disabled={submitting}>
                  {submitting ? submittingLabel : submitLabel}
                </button>
                <Link href={cancelHref} className="br-btn br-btn--outline w-100">
                  Cancel
                </Link>
                {isEdit && buyerRequest?.slug ? (
                  <Link href={`/buyer-requests/${buyerRequest.slug}`} className="brf-view-live">
                    <i className="fa-regular fa-eye" aria-hidden />
                    View live request
                  </Link>
                ) : null}
              </div>
            </aside>
          </div>

          <div className="brf-mobile-actions d-lg-none">
            <Link href={cancelHref} className="br-btn br-btn--outline flex-fill">
              Cancel
            </Link>
            <button
              type="submit"
              className="br-btn br-btn--dark"
              style={{ flex: 1.4 }}
              disabled={submitting}
            >
              {submitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
      <FormShellStyles />
    </div>
  );
}

function FormShellStyles() {
  return (
    <style>{`
      .brf-page {
        min-height: 70vh;
        background: #f8fafc;
        padding-bottom: 5rem;
      }
      .brf-inner {
        max-width: 72rem;
        margin: 0 auto;
        padding: 1rem 0.65rem;
      }
      @media (min-width: 576px) {
        .brf-inner { padding: 1.5rem 1rem; }
      }
      @media (min-width: 992px) {
        .brf-inner { padding: 2rem 1.5rem; }
      }
      .brf-top { margin-bottom: 1.25rem; }
      .brf-back {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 0.4rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #64748b;
        text-decoration: none !important;
      }
      .brf-back:hover { color: #0f172a; }
      .brf-top h1 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #111827;
      }
      @media (min-width: 576px) {
        .brf-top h1 { font-size: 1.5rem; }
      }
      .brf-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 992px) {
        .brf-grid {
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
      }
      .brf-main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      @media (min-width: 576px) {
        .brf-main { gap: 1.25rem; }
      }
      .brf-aside {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      @media (min-width: 992px) {
        .brf-aside {
          position: sticky;
          top: 1.25rem;
        }
      }
      .brf-card {
        border-radius: 1rem;
        border: 1px solid #f3f4f6;
        background: #fff;
        padding: 0.9rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      }
      @media (min-width: 576px) {
        .brf-card { padding: 1.25rem; }
      }
      @media (min-width: 768px) {
        .brf-card { padding: 1.5rem; }
      }
      .brf-card__head { margin-bottom: 1rem; }
      .brf-card__head h2 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: #111827;
      }
      .brf-card__head p {
        margin: 0.2rem 0 0;
        font-size: 0.875rem;
        color: #64748b;
      }
      .brf-fields {
        display: flex;
        flex-direction: column;
        gap: 1.15rem;
      }
      .brf-label {
        display: block;
        margin-bottom: 0.4rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
      }
      .brf-req { margin-left: 0.15rem; color: #f43f5e; }
      .brf-error {
        margin: 0.35rem 0 0;
        font-size: 0.75rem;
        color: #f43f5e;
      }
      .brf-input,
      .brf-fields select,
      .brf-fields textarea {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        background: #fff;
        padding: 0.65rem 0.9rem;
        font-size: 0.875rem;
        color: #0f172a;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .brf-input:focus,
      .brf-fields select:focus,
      .brf-fields textarea:focus {
        border-color: #94a3b8;
        box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
      }
      .brf-hint {
        margin: 0.35rem 0 0;
        font-size: 0.75rem;
        color: #64748b;
      }
      .brf-budget {
        position: relative;
      }
      .brf-budget span {
        position: absolute;
        left: 0.9rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.875rem;
        font-weight: 600;
        color: #64748b;
        pointer-events: none;
      }
      .brf-budget .brf-input { padding-left: 3.4rem; }
      .brf-drop {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        border: 2px dashed #e2e8f0;
        background: rgba(248, 250, 252, 0.7);
        padding: 2.25rem 1rem;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .brf-drop:hover,
      .brf-drop.is-over {
        border-color: #0f172a;
        background: #f8fafc;
      }
      .brf-drop.is-full {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .brf-drop__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        margin-bottom: 0.75rem;
        border-radius: 999px;
        background: #fff;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
        border: 1px solid #e2e8f0;
        color: #475569;
        font-size: 1.15rem;
      }
      .brf-drop strong {
        display: block;
        font-size: 0.875rem;
        color: #0f172a;
      }
      .brf-drop p {
        margin: 0.25rem 0 0;
        font-size: 0.75rem;
        color: #64748b;
      }
      .brf-images {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      @media (min-width: 576px) {
        .brf-images { grid-template-columns: repeat(3, 1fr); }
      }
      @media (min-width: 768px) {
        .brf-images { grid-template-columns: repeat(4, 1fr); }
      }
      .brf-image {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: 0.75rem;
        border: 1px solid #f3f4f6;
        background: #f1f5f9;
      }
      .brf-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .brf-image button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 1.75rem;
        height: 1.75rem;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.95);
        color: #334155;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
        cursor: pointer;
      }
      .brf-image button:hover {
        background: #fff1f2;
        color: #e11d48;
      }
      .brf-tips {
        border-radius: 1rem;
        border: 1px solid #dbeafe;
        background: rgba(239, 246, 255, 0.65);
        padding: 1rem 1.15rem;
        font-size: 0.875rem;
      }
      .brf-tips__title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
        color: #0f172a;
      }
      .brf-tips__title i { color: #f59e0b; }
      .brf-tips ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: #475569;
      }
      .brf-tips li {
        display: flex;
        gap: 0.5rem;
      }
      .brf-tips li::before {
        content: "";
        width: 0.35rem;
        height: 0.35rem;
        margin-top: 0.45rem;
        border-radius: 999px;
        background: #60a5fa;
        flex-shrink: 0;
      }
      .brf-summary {
        border-radius: 1rem;
        border: 1px solid #f3f4f6;
        background: #fff;
        padding: 1rem 1.15rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      }
      .brf-summary h2 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: #111827;
      }
      .brf-summary dl {
        margin: 1rem 0 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .brf-summary dl > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        font-size: 0.875rem;
      }
      .brf-summary dt {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        margin: 0;
        color: #64748b;
        font-weight: 400;
      }
      .brf-summary dd {
        margin: 0;
        font-weight: 600;
        color: #0f172a;
      }
      .brf-steps {
        margin: 0.75rem 0 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        font-size: 0.875rem;
        color: #475569;
      }
      .brf-steps li {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }
      .brf-steps span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 999px;
        background: #0f172a;
        color: #fff;
        font-size: 0.65rem;
        font-weight: 700;
        flex-shrink: 0;
      }
      .brf-actions {
        flex-direction: column;
        gap: 0.65rem;
        border-radius: 1rem;
        border: 1px solid #f3f4f6;
        background: #fff;
        padding: 1rem 1.15rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      }
      .brf-view-live {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #64748b;
        text-decoration: none !important;
      }
      .brf-view-live:hover { color: #0f172a; }
      .brf-mobile-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        border-radius: 1rem;
        border: 1px solid #f3f4f6;
        background: #fff;
        padding: 0.85rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      }
      .br-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 0.15rem 0.65rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      .br-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        border-radius: 0.75rem;
        padding: 0.65rem 1rem;
        font-size: 0.875rem;
        font-weight: 600;
        text-decoration: none !important;
        border: 0;
        cursor: pointer;
      }
      .br-btn--dark {
        background: #0f172a;
        color: #fff !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.15);
      }
      .br-btn--dark:hover { background: #000; color: #fff !important; }
      .br-btn--dark:disabled { opacity: 0.6; cursor: not-allowed; }
      .br-btn--outline {
        background: #fff;
        color: #334155 !important;
        border: 1px solid #e2e8f0;
      }
      .br-btn--outline:hover { background: #f8fafc; }
    `}</style>
  );
}
