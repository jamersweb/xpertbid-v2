import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { PropertyCardView } from "@/components/PropertyCard";
import { OwnerInfoRow } from "@/components/OwnerInfoRow";
import { getProperty, getRelatedProperties } from "@/lib/api/client";
import {
  breadcrumbJsonLd,
  formatPrice,
  locationLabel,
  propertyMetadata,
  realEstateJsonLd,
} from "@/lib/seo";
import { mainUrl } from "@/lib/site";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) {
    return { title: "Property not found" };
  }
  return propertyMetadata(property);
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const related = await getRelatedProperties(slug);
  const images = [
    ...(property.image_url ? [property.image_url] : []),
    ...(property.album_urls || []),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: property.title, path: `/properties/${property.slug}` },
  ];

  const directBuy = ["normal", "normal_list", "business", "business_list"].includes(
    String(property.listing_type || "").toLowerCase()
  );
  const soldOut = property.status === "sold_out";

  return (
    <div className="property-browse-wrap py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(realEstateJsonLd(property)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)),
        }}
      />

      <div className="container-fluid px-3 px-lg-5">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb mb-0">
            {breadcrumbs.map((item, index) => (
              <li
                key={item.path}
                className={`breadcrumb-item${index === breadcrumbs.length - 1 ? " active" : ""}`}
              >
                {index === breadcrumbs.length - 1 ? (
                  item.name
                ) : (
                  <Link href={item.path}>{item.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="row g-4">
          <div className="col-lg-7">
            <Gallery images={images} title={property.title} />
          </div>

          <div className="col-lg-5">
            <aside className="property-detail-panel">
              <OwnerInfoRow
                name={property.seller?.name}
                avatarUrl={property.seller?.avatar_url}
                isFeatured={property.featured}
              />
              <h1 className="mt-3">{property.title}</h1>
              <p className="text-muted mb-2">{locationLabel(property)}</p>
              <div className="pro-price mb-3">
                <span className="text-muted small d-block">
                  {directBuy ? "Price" : "Minimum Bid"}
                </span>
                <div className="price" style={{ color: "#23262F", fontSize: "1.5rem", fontWeight: 700 }}>
                  {formatPrice(property.price?.amount, property.price?.currency)}
                </div>
              </div>

              {Object.keys(property.attributes || {}).length ? (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {property.attributes.bedrooms != null ? (
                    <span className="badge rounded-pill text-bg-light border text-dark px-3 py-2">
                      <i className="fa-solid fa-bed text-primary me-1" />
                      {String(property.attributes.bedrooms)} Beds
                    </span>
                  ) : null}
                  {property.attributes.bathrooms != null ? (
                    <span className="badge rounded-pill text-bg-light border text-dark px-3 py-2">
                      <i className="fa-solid fa-bath text-primary me-1" />
                      {String(property.attributes.bathrooms)} Baths
                    </span>
                  ) : null}
                  {(property.attributes.area || property.attributes.size_sqft) != null ? (
                    <span className="badge rounded-pill text-bg-light border text-dark px-3 py-2">
                      <i className="fa-solid fa-ruler-combined text-primary me-1" />
                      {[property.attributes.area || property.attributes.size_sqft, property.attributes.area_unit]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className="pro-bid-btn">
                {soldOut ? (
                  <span
                    style={{
                      display: "inline-flex",
                      borderRadius: "12px",
                      padding: "14px 22px",
                      background: "#9ca3af",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    Sold Out
                  </span>
                ) : (
                  <a href={mainUrl(`/product/${property.slug}`)}>
                    {directBuy ? "Buy Now" : "Place Bid"}
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>

        {property.description ? (
          <section className="mt-4">
            <div className="property-detail-panel">
              <h2 className="h4 mb-3" style={{ color: "#23262F" }}>
                About this property
              </h2>
              <div
                className="text-muted"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="featured-product mt-4" style={{ background: "transparent", padding: "24px 0" }}>
            <div className="home-section-header">
              <div className="featured-heading mb-0">
                <h2>Related Properties</h2>
              </div>
            </div>
            <div className="row g-4">
              {related.map((item) => (
                <div key={item.id} className="col-12 col-sm-6 col-lg-4">
                  <PropertyCardView property={item} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
