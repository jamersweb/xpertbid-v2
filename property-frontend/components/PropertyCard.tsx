import Link from "next/link";
import type { PropertyCard } from "@/types/property";
import { formatPrice } from "@/lib/seo";
import { mainUrl } from "@/lib/site";
import { OwnerInfoRow } from "@/components/OwnerInfoRow";

type Props = {
  property: PropertyCard;
  showPropertyMeta?: boolean;
};

function isDirectBuy(listingType?: string | null) {
  const t = String(listingType || "").toLowerCase();
  return t === "normal" || t === "normal_list" || t === "business" || t === "business_list";
}

export function PropertyCardView({ property, showPropertyMeta = true }: Props) {
  const attrs = property.attributes || {};
  const beds = attrs.bedrooms != null ? String(attrs.bedrooms) : "";
  const baths = attrs.bathrooms != null ? String(attrs.bathrooms) : "";
  const areaSize = attrs.area != null ? String(attrs.area) : attrs.size_sqft != null ? String(attrs.size_sqft) : "";
  const areaUnit = attrs.area_unit != null ? String(attrs.area_unit) : "";
  const area = [areaSize, areaUnit].filter(Boolean).join(" ");
  const shouldRenderMeta = showPropertyMeta && Boolean(beds || baths || area);

  const soldOut = property.status === "sold_out";
  const directBuy = isDirectBuy(property.listing_type);
  const href = `/properties/${property.slug}`;
  const imageSrc = property.image_url || "/assets/images/user.jpg";
  const ctaLabel = soldOut ? "Sold Out" : directBuy ? "Buy Now" : "Place Bid";
  const priceLabel = directBuy ? "Price" : "Minimum Bid";

  return (
    <div className="product-card-wrapper h-100">
      <div className="pro-image m-0" style={{ position: "relative" }}>
        <Link href={href} className="product-box">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={property.title}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "4/3",
                objectFit: "cover",
                borderRadius: "18px",
              }}
              className="img-fluid object-cover"
              loading="lazy"
            />
          </div>
        </Link>

        {soldOut ? (
          <span
            className="badge rounded-pill bg-dark text-white"
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 3,
              fontSize: 12,
              padding: "7px 11px",
            }}
          >
            Sold Out
          </span>
        ) : null}
      </div>

      <OwnerInfoRow
        name={property.seller?.name}
        avatarUrl={property.seller?.avatar_url}
        isFeatured={property.featured}
      />

      <div className="pro-title" style={{ color: "black" }}>
        <h2>
          <Link href={href} className="text-color-black">
            {property.title}
          </Link>
        </h2>
      </div>

      {shouldRenderMeta ? (
        <div className="d-flex flex-nowrap gap-1 mt-2 mb-2 align-items-center overflow-hidden">
          {beds ? (
            <span
              className="badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2 text-truncate"
              style={{ maxWidth: "31%", fontSize: "0.92rem", minWidth: 0 }}
            >
              <i className="fa-solid fa-bed text-primary" aria-hidden="true" />
              {beds} Beds
            </span>
          ) : null}
          {baths ? (
            <span
              className="badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2 text-truncate"
              style={{ maxWidth: "31%", fontSize: "0.92rem", minWidth: 0 }}
            >
              <i className="fa-solid fa-bath text-primary" aria-hidden="true" />
              {baths} Baths
            </span>
          ) : null}
          {area ? (
            <span
              className="badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2"
              style={{
                fontSize: "0.88rem",
                minWidth: 0,
                whiteSpace: "normal",
                flex: "0 0 auto",
              }}
            >
              <i className="fa-solid fa-ruler-combined text-primary" aria-hidden="true" />
              {area}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="pro-meta">
        <div className="pro-price">
          <span>{priceLabel}</span>
          <div className="price">
            <span className="me-1" style={{ color: "#23262F" }}>
              {formatPrice(property.price?.amount, property.price?.currency)}
            </span>
          </div>
        </div>

        <div className="pro-buy-btn">
          <div className="pro-bid-btn">
            {soldOut ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  padding: "14px 22px",
                  background: "#9ca3af",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "not-allowed",
                }}
              >
                Sold Out
              </span>
            ) : (
              <a href={mainUrl(`/product/${property.slug}`)}>{ctaLabel}</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
