"use client";

import Link from "next/link";
import { publicBuyerRequestLocation } from "@/components/buyer-requests/BrUi";
import type { BuyerRequestItem } from "@/lib/api/buyerRequests";

type Props = {
  items: BuyerRequestItem[];
  counts: { all: number; available: number; offered: number };
  isCorporateVerified?: boolean;
  hasPreferences?: boolean;
  onBrowseOpen?: () => void;
  onBrowseAll?: () => void;
  subtitle?: string;
};

export default function SellerLeadsHero({
  items,
  counts,
  isCorporateVerified = false,
  hasPreferences = false,
  onBrowseOpen,
  onBrowseAll,
  subtitle = "Buyers post what they need. You bid. Best offer wins.",
}: Props) {
  const open = items.filter((r) => !r.my_offer);
  const spotlight = (open.length ? open : items).slice(0, 3);

  return (
    <section className="br-hero">
      <div className="br-hero__bg" />
      <div className="br-hero__blue" />
      <div className="br-hero__dots" />
      <div className="br-hero__mark d-none d-lg-block" aria-hidden>
        XB
      </div>

      <div className="br-hero__grid">
        <div className="br-hero__copy">
          <div>
            <div className="br-hero__eyebrow">
              <span />
              Live marketplace
            </div>
            <h1>
              Win deals from
              <span>buyer requests</span>
            </h1>
            <p>{subtitle}</p>
          </div>

          <div className="br-hero__cta-block">
            <div className="br-hero__stats">
              <div>
                <strong>{isCorporateVerified ? counts.available : counts.all}</strong>
                <span>{isCorporateVerified ? "Open to you" : "Open leads"}</span>
              </div>
              {isCorporateVerified ? (
                <>
                  <i className="d-none d-sm-block" />
                  <div>
                    <strong>{counts.offered}</strong>
                    <span>Your bids</span>
                  </div>
                </>
              ) : null}
              <i className="d-none d-sm-block" />
              <div>
                <strong>{counts.all}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="br-hero__btns">
              {counts.all > 0 ? (
                <button type="button" className="br-hero__btn br-hero__btn--primary" onClick={onBrowseOpen || onBrowseAll}>
                  <i className="fa-solid fa-arrow-trend-up" aria-hidden />
                  Browse open leads
                </button>
              ) : null}
              <Link href="/seller/buyer-request-preferences" className="br-hero__btn br-hero__btn--ghost">
                <i className="fa-solid fa-gear" aria-hidden />
                {hasPreferences ? "Preferences" : "Set preferences"}
              </Link>
            </div>
          </div>
        </div>

        <div className="br-hero__stack-wrap">
          <div className="br-hero__stack">
            <div className="br-hero__glow d-none d-lg-block" />
            <div className="br-hero__ring d-none d-lg-block" />

            {spotlight.length ? (
              <>
                <div className="br-hero__cards">
                  {spotlight.map((item, idx) => {
                    const thumb = item.images?.[0]?.url;
                    const tilt = idx === 0 ? "tilt-a" : idx === 1 ? "tilt-b" : "tilt-c";
                    const hideMobile = idx === 2 ? "d-none d-sm-block" : "";
                    return (
                      <div key={item.id} className={`${tilt} ${hideMobile}`}>
                        <div
                          className="br-hero__card-wrap"
                          style={{ animationDelay: `${idx * 0.4}s`, animationDuration: `${5 + idx * 0.6}s` }}
                        >
                          <Link href={`/buyer-requests/${item.slug}`} className="br-hero__card">
                            <div className="br-hero__thumb">
                              {thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={thumb} alt="" />
                              ) : (
                                <i className="fa-solid fa-clipboard-list" aria-hidden />
                              )}
                            </div>
                            <div className="br-hero__card-body">
                              <div className="br-hero__card-title">{item.title}</div>
                              <div className="br-hero__card-meta">
                                {publicBuyerRequestLocation(item) ? (
                                  <span>
                                    <i className="fa-solid fa-location-dot" aria-hidden />
                                    {publicBuyerRequestLocation(item)}
                                  </span>
                                ) : null}
                                {item.budget != null && Number(item.budget) > 0 ? (
                                  <strong>{Number(item.budget).toLocaleString()} PKR</strong>
                                ) : null}
                              </div>
                            </div>
                            <span className="br-hero__bid">Bid</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {counts.all > Math.min(spotlight.length, 2) ? (
                  <button
                    type="button"
                    className="br-hero__more d-sm-none"
                    onClick={onBrowseAll}
                  >
                    +{Math.max(0, counts.all - Math.min(spotlight.length, 2))} more leads below
                  </button>
                ) : null}
                {counts.all > spotlight.length ? (
                  <button
                    type="button"
                    className="br-hero__more d-none d-sm-block"
                    onClick={onBrowseAll}
                  >
                    +{counts.all - spotlight.length} more leads below
                  </button>
                ) : null}
              </>
            ) : (
              <div className="br-hero__empty">
                <i className="fa-solid fa-magnifying-glass" aria-hidden />
                <p>No open leads yet</p>
                <span>New buyer requests will appear here.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .br-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 1rem;
          border-radius: 1rem;
        }
        @media (min-width: 576px) {
          .br-hero {
            margin-bottom: 2rem;
            border-radius: 1.75rem;
          }
        }
        .br-hero__bg {
          position: absolute;
          inset: 0;
          background: #1a2b4b;
          pointer-events: none;
        }
        .br-hero__blue {
          position: absolute;
          inset: 0 0 0 auto;
          width: 58%;
          background: #43ACE9;
          clip-path: polygon(14% 0, 100% 0, 100% 100%, 0 100%);
          pointer-events: none;
          display: none;
        }
        @media (min-width: 992px) {
          .br-hero__blue { display: block; }
        }
        .br-hero__dots {
          position: absolute;
          inset: 0;
          opacity: 0.07;
          pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0);
          background-size: 18px 18px;
        }
        .br-hero__mark {
          position: absolute;
          left: -1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 7.5rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.06em;
          color: rgba(255,255,255,0.04);
          pointer-events: none;
          user-select: none;
        }
        @media (min-width: 992px) {
          .br-hero__mark { font-size: 9.5rem; }
        }
        .br-hero__grid {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 992px) {
          .br-hero__grid {
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
          }
        }
        .br-hero__copy {
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.25rem 1rem;
        }
        @media (min-width: 576px) {
          .br-hero__copy { padding: 2.25rem 2rem; }
        }
        @media (min-width: 992px) {
          .br-hero__copy { padding: 2.5rem; }
        }
        .br-hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #43ACE9;
        }
        @media (min-width: 576px) {
          .br-hero__eyebrow { font-size: 11px; letter-spacing: 0.18em; }
        }
        .br-hero__eyebrow span {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 999px;
          background: #43ACE9;
          animation: brPulse 1.5s ease-in-out infinite;
        }
        .br-hero__copy h1 {
          margin: 0.65rem 0 0;
          max-width: 28rem;
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.18;
          letter-spacing: -0.02em;
          color: #fff;
        }
        @media (min-width: 576px) {
          .br-hero__copy h1 { margin-top: 0.75rem; font-size: 1.875rem; }
        }
        @media (min-width: 992px) {
          .br-hero__copy h1 { font-size: 2.35rem; line-height: 1.15; }
        }
        .br-hero__copy h1 span {
          display: block;
          margin-top: 0.15rem;
          color: #43ACE9;
        }
        .br-hero__copy > div > p {
          margin: 0.5rem 0 0;
          max-width: 24rem;
          font-size: 13px;
          line-height: 1.55;
          color: #cbd5e1;
        }
        @media (min-width: 576px) {
          .br-hero__copy > div > p { margin-top: 0.75rem; font-size: 15px; }
        }
        .br-hero__cta-block {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @media (min-width: 576px) {
          .br-hero__cta-block { margin-top: 2rem; gap: 1rem; }
        }
        .br-hero__stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
          max-width: 100%;
        }
        @media (min-width: 576px) {
          .br-hero__stats {
            display: inline-flex;
            align-items: flex-end;
            gap: 1.75rem;
          }
        }
        .br-hero__stats strong {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          font-variant-numeric: tabular-nums;
        }
        @media (min-width: 576px) {
          .br-hero__stats strong { font-size: 1.875rem; }
        }
        .br-hero__stats span {
          display: block;
          margin-top: 0.15rem;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
        }
        @media (min-width: 576px) {
          .br-hero__stats span { font-size: 11px; }
        }
        .br-hero__stats > div { text-align: center; min-width: 0; }
        @media (min-width: 576px) {
          .br-hero__stats > div { text-align: left; }
        }
        .br-hero__stats > i {
          width: 1px;
          height: 2rem;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .br-hero__btns {
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        @media (min-width: 576px) {
          .br-hero__btns { flex-direction: row; flex-wrap: wrap; }
        }
        .br-hero__btn {
          display: inline-flex;
          width: 100%;
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
        @media (min-width: 576px) {
          .br-hero__btn { width: auto; }
        }
        .br-hero__btn--primary {
          background: #43ACE9;
          color: #fff !important;
          box-shadow: 0 10px 28px rgba(67, 172, 233, 0.45);
        }
        .br-hero__btn--primary:hover { background: #35a0df; color: #fff !important; }
        .br-hero__btn--ghost {
          border: 1px solid rgba(255,255,255,0.2) !important;
          background: rgba(255,255,255,0.05);
          color: #fff !important;
        }
        .br-hero__btn--ghost:hover { background: rgba(255,255,255,0.1); color: #fff !important; }
        .br-hero__stack-wrap {
          position: relative;
          z-index: 10;
          background: #43ACE9;
          padding: 1rem 1rem 1.25rem;
          pointer-events: none;
        }
        @media (min-width: 576px) {
          .br-hero__stack-wrap { padding: 1.25rem 2rem 2rem; }
        }
        @media (min-width: 992px) {
          .br-hero__stack-wrap {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            background: transparent;
            padding: 2.5rem 2.5rem 2.5rem 4rem;
            pointer-events: auto;
          }
        }
        .br-hero__stack {
          position: relative;
          width: 100%;
          max-width: 24rem;
          margin: 0 auto;
          pointer-events: auto;
        }
        @media (min-width: 992px) {
          .br-hero__stack { margin: 0; }
        }
        .br-hero__glow {
          position: absolute;
          inset: -1rem;
          border-radius: 2rem;
          background: rgba(255,255,255,0.1);
          filter: blur(28px);
          pointer-events: none;
        }
        .br-hero__ring {
          position: absolute;
          right: -0.25rem;
          top: 0.5rem;
          width: 5rem;
          height: 5rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.25);
          pointer-events: none;
        }
        .br-hero__cards {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .br-hero__card-wrap { transform-origin: center; }
        @media (min-width: 576px) {
          .br-hero__card-wrap {
            animation-name: brHeroFloat;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }
          .tilt-a { transform: rotate(-1deg); }
          .tilt-b { transform: rotate(1deg); }
          .tilt-c { transform: rotate(-1deg); }
        }
        .br-hero__card {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.5);
          background: #fff;
          padding: 0.65rem;
          text-decoration: none !important;
          color: inherit;
          box-shadow: 0 10px 28px rgba(26, 43, 75, 0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        @media (min-width: 576px) {
          .br-hero__card {
            gap: 0.75rem;
            border-radius: 1rem;
            padding: 0.75rem;
            box-shadow: 0 14px 40px rgba(26, 43, 75, 0.22);
          }
        }
        .br-hero__card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 44px rgba(26, 43, 75, 0.28);
        }
        .br-hero__thumb {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 0.5rem;
          background: #e8f6fc;
          color: #43ACE9;
        }
        @media (min-width: 576px) {
          .br-hero__thumb {
            width: 3rem;
            height: 3rem;
            border-radius: 0.75rem;
          }
        }
        .br-hero__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .br-hero__card-body { min-width: 0; flex: 1; }
        .br-hero__card-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 600;
          color: #1a2b4b;
        }
        @media (min-width: 576px) {
          .br-hero__card-title { font-size: 0.875rem; }
        }
        .br-hero__card:hover .br-hero__card-title { color: #43ACE9; }
        .br-hero__card-meta {
          margin-top: 0.15rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          min-width: 0;
          font-size: 10px;
          color: #64748b;
        }
        @media (min-width: 576px) {
          .br-hero__card-meta { gap: 0.5rem; font-size: 11px; }
        }
        .br-hero__card-meta span {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .br-hero__card-meta i { color: #43ACE9; flex-shrink: 0; }
        .br-hero__card-meta strong {
          flex-shrink: 0;
          font-weight: 600;
          color: #1a2b4b;
        }
        .br-hero__bid {
          flex-shrink: 0;
          border-radius: 999px;
          background: rgba(67, 172, 233, 0.15);
          padding: 0.15rem 0.5rem;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #1a7fb8;
        }
        .br-hero__more {
          position: relative;
          z-index: 10;
          width: 100%;
          margin-top: 0.75rem;
          border-radius: 0.75rem;
          border: 1px dashed rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.2);
          padding: 0.65rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(2px);
        }
        .br-hero__more:hover { background: rgba(255,255,255,0.3); }
        .br-hero__empty {
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.15);
          padding: 1.5rem;
          text-align: center;
          color: #fff;
        }
        .br-hero__empty i { font-size: 1.5rem; opacity: 0.85; }
        .br-hero__empty p {
          margin: 0.65rem 0 0;
          font-weight: 600;
        }
        .br-hero__empty span {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.75);
        }
        @keyframes brHeroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes brPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .br-hero__card-wrap,
          .br-hero__eyebrow span { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
