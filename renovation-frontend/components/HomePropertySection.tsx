import Link from "next/link";
import { PropertyCardView } from "@/components/PropertyCard";
import type { PropertyCard } from "@/types/property";

type Props = {
  title: string;
  viewAllHref: string;
  properties: PropertyCard[];
  /** Alternating home bands like v2: default grey, tone="alt" soft white/grey */
  tone?: "default" | "alt" | "white";
};

export function HomePropertySection({
  title,
  viewAllHref,
  properties,
  tone = "default",
}: Props) {
  if (!properties.length) return null;

  const backgroundColor =
    tone === "white" ? "#FFFFFF" : tone === "alt" ? "#F9F9F9" : "#F1F1F1";

  return (
    <section className="featured-product home-property-section" style={{ backgroundColor }}>
      <div className="container-fluid px-3 px-lg-5">
        <div className="home-section-header">
          <div className="featured-heading mb-0">
            <h2>{title}</h2>
          </div>
          <Link href={viewAllHref} className="section-view-all-btn">
            View All
          </Link>
        </div>

        <div className="row g-4 home-mobile-scroll-row">
          {properties.slice(0, 3).map((property) => (
            <div key={property.id} className="col-12 col-sm-6 col-lg-4">
              <PropertyCardView property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
