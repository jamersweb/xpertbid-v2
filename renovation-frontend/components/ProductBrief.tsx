"use client";

import type { PropertyDetail } from "@/types/property";
import { formatPrice } from "@/lib/seo";
import { assetImage, mainUrl } from "@/lib/site";

type Props = {
  property: PropertyDetail;
};

function isDirectBuy(listingType?: string | null) {
  const t = String(listingType || "").toLowerCase();
  return ["normal", "normal_list", "business", "business_list"].includes(t);
}

function isAuctionSale(listingType?: string | null) {
  const t = String(listingType || "").toLowerCase();
  return t === "auction" || t === "live_auction";
}

function buildAvatarUrl(avatar?: string | null) {
  if (!avatar) return assetImage("user.jpg");
  if (avatar.startsWith("http")) return avatar;
  const normalized = String(avatar).replace(/\\/g, "/");
  if (normalized.startsWith("/")) return normalized;
  return `/${normalized.replace(/^\/+/, "")}`;
}

export function ProductBrief({ property }: Props) {
  const soldOut = property.status === "sold_out";
  const auction = isAuctionSale(property.listing_type);
  const direct = isDirectBuy(property.listing_type);
  const productUrl = mainUrl(`/product/${property.slug}`);
  const highestBid =
    Number(property.highest_bid || 0) > 0
      ? Number(property.highest_bid)
      : Number(property.minimum_bid ?? property.price?.amount ?? 0);
  const startPrice = Number(property.minimum_bid ?? property.price?.amount ?? 0);
  const reserve = Number(property.reserve_price ?? 0);
  const currency = property.price?.currency || "PKR";
  const sellerName = property.seller?.name || "Seller";
  const supportMessage = encodeURIComponent(
    `Hello XpertBid Support, I need help with this listing: ${property.title}`
  );

  return (
    <div className="product-details-brief-parent" style={{ padding: "0 10px" }}>
      <h2 className="product-heading mb-3">{property.title}</h2>

      {soldOut ? (
        <div className="sold-out-banner mb-4">
          <i className="fa-solid fa-box-open me-2" />
          Sold Out
        </div>
      ) : null}

      <div className="owned-by-and-favoruite d-flex align-items-center justify-content-between mb-4">
        <div className="owned d-flex align-items-center gap-2">
          <div className="customer-profile-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={buildAvatarUrl(property.seller?.avatar_url)}
              alt="Owner"
              style={{ width: 45, height: 45, borderRadius: "50%", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
              }}
            />
          </div>
          <div className="customer-name d-flex flex-column">
            <span className="owner text-muted small fw-semibold" style={{ fontSize: 12 }}>
              Owned By
            </span>
            <p className="name mb-0 fw-bold text-dark" style={{ fontSize: 15 }}>
              {sellerName}
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <a
            href={mainUrl("/chat")}
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
            style={{ borderRadius: 20, padding: "5px 15px", fontSize: 13 }}
          >
            <i className="fa-regular fa-comment-dots" />
            Chat
          </a>
          <a
            href={mainUrl("/favorites")}
            className="fav-btn border-0 bg-light p-2 rounded-2"
            aria-label="Favorites"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                stroke="#23262F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {auction ? (
        <>
          <div className="bid-rank-and-time detail-auction-strip mb-3">
            <div className="detail-auction-meta">
              <span className="rank">Highest Bid</span>
              <div className="price">{formatPrice(highestBid, currency)}</div>
            </div>
          </div>

          {!soldOut && String(property.status).toLowerCase() !== "awarded" ? (
            <div className="bid-input-wrap mb-3">
              <a
                href={productUrl}
                className="btn w-100 fw-bold mt-0 d-flex align-items-center justify-content-center text-decoration-none"
                style={{
                  height: 50,
                  fontSize: 18,
                  borderRadius: 10,
                  backgroundColor: "#23262F",
                  color: "#fff",
                  border: "none",
                }}
              >
                Place Bid
              </a>
            </div>
          ) : null}

          <div className="min-bid-and-estimate d-flex justify-content-between mt-2">
            <div className="minimum-bid text-muted small">
              Starting bid price:{" "}
              <span className="text-dark fw-semibold">{formatPrice(startPrice, currency)}</span>
            </div>
            <div className="estimate-bid text-muted small">
              Market Value:{" "}
              <span className="text-dark fw-semibold">{formatPrice(reserve || startPrice, currency)}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="normal-pricing-section">
            <div className="bid-rank-and-time bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center">
              <div className="bid-price-and-rank d-flex flex-column">
                <span className="rank text-muted small fw-semibold">Price</span>
                <div className="price fw-bold d-flex align-items-center gap-2">
                  <span className="text-dark" style={{ fontSize: 28 }}>
                    {formatPrice(property.price?.amount, currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons d-grid gap-2 mb-3">
              {soldOut ? (
                <div className="sold-out-action-box">
                  <span className="sold-out-action-label">Sold Out</span>
                  <p className="mb-0 text-muted" style={{ fontSize: 13 }}>
                    This listing is no longer available for purchase or bidding.
                  </p>
                </div>
              ) : direct ? (
                <a
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center text-decoration-none"
                  style={{
                    height: 50,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: "#25D366",
                    color: "#fff",
                    border: "none",
                  }}
                  href={`https://wa.me/923022113202?text=${supportMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-whatsapp me-2" />
                  Contact to Support
                </a>
              ) : (
                <a
                  href={productUrl}
                  className="btn w-100 fw-bold d-flex align-items-center justify-content-center text-decoration-none"
                  style={{
                    height: 50,
                    fontSize: 16,
                    borderRadius: 10,
                    backgroundColor: "#23262F",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  View on XpertBid
                </a>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        .detail-auction-strip {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 18px 20px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }
        .detail-auction-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .detail-auction-meta .rank {
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .detail-auction-meta .price {
          color: #111827;
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sold-out-banner {
          display: inline-flex;
          align-items: center;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
        }
        .sold-out-action-box {
          background: #f8fafc;
          border: 1px dashed #d1d5db;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .sold-out-action-label {
          display: block;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
