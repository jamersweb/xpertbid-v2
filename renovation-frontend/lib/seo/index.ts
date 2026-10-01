import type { Metadata } from "next";
import type { PropertyCard, PropertyDetail } from "@/types/property";

export const SITE_NAME = "XpertBid Property";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://property.xpertbid.com";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function formatPrice(amount: number | null | undefined, currency = "PKR") {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "Price on request";
  }
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

export function propertyMetadata(property: PropertyDetail): Metadata {
  const city = property.location?.city;
  const title = city
    ? `${property.title} in ${city} | ${SITE_NAME}`
    : `${property.title} | ${SITE_NAME}`;
  const description = truncate(
    property.description?.replace(/<[^>]+>/g, " ") ||
      `${property.title} listed on ${SITE_NAME}.`
  );
  const image = property.image_url || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(property.canonical_path || `/properties/${property.slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/properties/${property.slug}`),
      siteName: SITE_NAME,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function realEstateJsonLd(property: PropertyDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: truncate(property.description?.replace(/<[^>]+>/g, " ") || property.title, 300),
    url: absoluteUrl(`/properties/${property.slug}`),
    image: property.album_urls?.length ? property.album_urls : property.image_url,
    datePosted: property.created_at,
    offers: {
      "@type": "Offer",
      price: property.price?.amount ?? undefined,
      priceCurrency: property.price?.currency || "PKR",
      availability:
        property.status === "sold_out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location?.city || undefined,
      addressRegion: property.location?.state || undefined,
      addressCountry: property.location?.country || undefined,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function locationLabel(card: PropertyCard | PropertyDetail) {
  return [card.location?.city, card.location?.state, card.location?.country]
    .filter(Boolean)
    .join(", ");
}
