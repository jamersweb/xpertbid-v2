import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccordionItem } from "@/components/AccordionItem";
import { Gallery } from "@/components/Gallery";
import { GooglePropertyMap } from "@/components/GooglePropertyMap";
import { ProductBrief } from "@/components/ProductBrief";
import { ProductDetailHeader } from "@/components/ProductDetailHeader";
import { RelatedProperties } from "@/components/RelatedProperties";
import { getProperty, getRelatedProperties } from "@/lib/api/client";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  propertyMetadata,
  realEstateJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatHuman(value?: string | null) {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const mon = monthNames[dt.getMonth()];
  return `${dd}/${mm}/${mon}`;
}

function prettifyKey(rawKey: string) {
  return String(rawKey || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

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
  ].filter((value, index, arr) => arr.indexOf(value) === index);

  const attributeEntries = Object.entries(property.attributes || {}).filter(
    ([key, value]) =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== "" &&
      !["map_url", "latitude", "longitude"].includes(key)
  );

  const hasKeyInfo = Boolean(property.description || property.product_location || property.map_url);
  const hasProject = Boolean(
    property.developer ||
      property.delivery_date ||
      property.sale_starts ||
      property.payment_plan ||
      property.number_of_buildings ||
      property.government_fee
  );
  const isFeaturedListing =
    property.featured || property.featured_name === "home_featured" || property.featured_name === "realstate_featured";

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(realEstateJsonLd(property)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Properties", path: "/properties" },
              { name: property.title, path: `/properties/${property.slug}` },
            ])
          ),
        }}
      />

      <ProductDetailHeader
        views={property.views}
        slug={property.slug}
        shareUrl={absoluteUrl(`/properties/${property.slug}`)}
      />

      <section className="product-image-and-brief">
        <div className="container-fluid">
          <div className={`products-brief-parent${isFeaturedListing ? " listing_promoted" : ""}`}>
            <div className="row">
              <div className="col-md-6">
                <Gallery
                  images={images}
                  title={property.title}
                  status={property.status}
                  listingType={property.listing_type}
                  startDate={property.start_date}
                  endDate={property.end_date}
                  youtubeVideoId={property.youtube_video_id}
                />
              </div>

              <div className="col-md-6">
                {isFeaturedListing ? (
                  <div style={{ display: "block" }}>
                    <button type="button" className="pro_feature" disabled>
                      <i className="fa-solid fa-bolt me-2" />
                      Featured
                    </button>
                  </div>
                ) : null}

                <ProductBrief property={property} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-detailed-info">
        <div className="container-fluid">
          <div className="product-detailed-info-parent">
            <div className="row justify-content-between">
              <div className="col-lg-7 col-md-6">
                <div className="x-accordions">
                  {hasKeyInfo ? (
                    <AccordionItem title="Key Information" defaultOpen>
                      {property.description ? (
                        <div
                          className="mb-3"
                          dangerouslySetInnerHTML={{ __html: property.description }}
                        />
                      ) : null}
                      {property.product_location ? (
                        <div className="mb-3">
                          <h6 className="mb-1">Location</h6>
                          <div>{property.product_location}</div>
                        </div>
                      ) : null}
                      {property.map_url ? (
                        <div className="mt-3">
                          {String(property.map_url).includes("<iframe") ? (
                            <div dangerouslySetInnerHTML={{ __html: property.map_url }} />
                          ) : (
                            <a
                              href={String(property.map_url)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-secondary btn-sm"
                            >
                              View on map
                            </a>
                          )}
                        </div>
                      ) : null}
                    </AccordionItem>
                  ) : null}

                  {attributeEntries.length > 0 ? (
                    <AccordionItem title="Additional Details" defaultOpen>
                      <div className="row gx-3 gy-2">
                        {attributeEntries.map(([key, value]) => (
                          <div className="col-md-6" key={key}>
                            <div className="d-flex justify-content-between align-items-center border rounded px-3 py-2">
                              <span className="text-muted small">{prettifyKey(key)}</span>
                              <strong className="small text-dark">{String(value)}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionItem>
                  ) : null}

                  {hasProject ? (
                    <AccordionItem title="Project by">
                      {property.developer ? (
                        <div className="mb-3">
                          <div>{property.developer}</div>
                        </div>
                      ) : null}
                      {property.delivery_date ? (
                        <div className="mb-3">
                          <h6 className="mb-1">Delivery Date</h6>
                          <div>{formatHuman(property.delivery_date)}</div>
                        </div>
                      ) : null}
                      {property.sale_starts ? (
                        <div className="mb-3">
                          <h6 className="mb-1">Sale Starts</h6>
                          <div>{formatHuman(property.sale_starts)}</div>
                        </div>
                      ) : null}
                      {property.payment_plan ? (
                        <div className="mb-3">
                          <h6 className="mb-1">Payment Plan</h6>
                          <div dangerouslySetInnerHTML={{ __html: property.payment_plan }} />
                        </div>
                      ) : null}
                      {property.number_of_buildings ? (
                        <div className="mb-3">
                          <h6 className="mb-1">Number of Buildings</h6>
                          <div>{property.number_of_buildings}</div>
                        </div>
                      ) : null}
                      {property.government_fee ? (
                        <div className="mb-1">
                          <h6 className="mb-1">Government Fee</h6>
                          <div dangerouslySetInnerHTML={{ __html: property.government_fee }} />
                        </div>
                      ) : null}
                    </AccordionItem>
                  ) : null}

                  {(property.map_url || property.latitude || property.product_location || property.location_url || property.attributes?.map_url) ? (
                    <AccordionItem title="Property Location Map" defaultOpen>
                      <GooglePropertyMap
                        mapUrl={property.map_url || property.location_url || (property.attributes?.map_url as string)}
                        latitude={property.latitude || (property.attributes?.latitude as string)}
                        longitude={property.longitude || (property.attributes?.longitude as string)}
                        locationAddress={property.product_location || (property.attributes?.address as string) || (property.attributes?.property_address as string)}
                        title={property.title}
                      />
                    </AccordionItem>
                  ) : null}

                  {property.amenities ? (
                    <AccordionItem title="Amenities">
                      <div dangerouslySetInnerHTML={{ __html: property.amenities }} />
                    </AccordionItem>
                  ) : null}

                  {property.facilities ? (
                    <AccordionItem title="Facilities">
                      <div dangerouslySetInnerHTML={{ __html: property.facilities }} />
                    </AccordionItem>
                  ) : null}

                  {property.nearby_location ? (
                    <AccordionItem title="Location & Nearby Attractions">
                      <div dangerouslySetInnerHTML={{ __html: property.nearby_location }} />
                    </AccordionItem>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProperties items={related} />
    </div>
  );
}
