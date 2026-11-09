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
  const title = `${property.title} | ${SITE_NAME}`;
  const description = truncate(
    property.description?.replace(/<[^>]+>/g, " ") ||
      `${property.title} listed on ${SITE_NAME}.`
  );

  // Select the best available image for OG/twitter, avoiding seller avatars
  const images: string[] = [];

  // Priority 1: Primary image_url (if it's an absolute URL or path, not seller avatar)
  if (property.image_url) {
    // Exclude seller/avatar URLs (typically have avatar, user, profile, avatar_url patterns)
    if (!property.image_url.match(/avatar|user|profile|avatar_url/i)) {
      images.push(property.image_url);
    }
  }

  // Priority 2: Album URLs (first few valid property gallery images)
  if (images.length === 0 && property.album_urls?.length) {
    // Filter out potential seller/avatar URLs from album URLs
    const validAlbumUrls = property.album_urls.filter(
      (url) => url && !url.match(/avatar|user|profile|avatar_url/i)
    );
    if (validAlbumUrls.length > 0) {
      // Use up to 2 first valid album URLs for OG/twitter
      images.push(...validAlbumUrls.slice(0, 2));
    }
  }

  // Priority 3: Use an appropriate default property placeholder if no valid images found
  if (images.length === 0) {
    // Use a property-specific placeholder image that represents real estate/property
    images.push(
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
    );
  }

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
      images: images.map((url) => ({ url: absoluteUrl(url) })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((url) => absoluteUrl(url)),
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
