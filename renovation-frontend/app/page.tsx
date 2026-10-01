import { HeroSection } from "@/components/HeroSection";
import { HomePropertySection } from "@/components/HomePropertySection";
import {
  getFeaturedProperties,
  getProperties,
  getPropertyCategories,
} from "@/lib/api/client";
import type { CategoryNode, PropertyCard, PropertyFilters } from "@/types/property";

export const revalidate = 120;

const SECTION_LIMIT = 3;

async function safeProperties(
  filters: PropertyFilters = {}
): Promise<PropertyCard[]> {
  try {
    const result = await getProperties({
      ...filters,
      per_page: SECTION_LIMIT,
      sort: "latest",
      listing_type: filters.listing_type || "normal",
    });
    return result.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  let featured: PropertyCard[] = [];
  let kitchen: PropertyCard[] = [];
  let bathroom: PropertyCard[] = [];
  let flooring: PropertyCard[] = [];
  let ceiling: PropertyCard[] = [];
  let tree: CategoryNode | null = null;

  try {
    tree = await getPropertyCategories();
  } catch {
    tree = null;
  }

  try {
    const [featuredRes, kitchenRes, bathRes, floorRes, ceilingRes] = await Promise.all([
      getFeaturedProperties(SECTION_LIMIT).catch(() => [] as PropertyCard[]),
      safeProperties({ sub_category: "kitchen-renovation" }),
      safeProperties({ sub_category: "bathroom-renovation" }),
      safeProperties({ sub_category: "flooring" }),
      safeProperties({ sub_category: "ceiling" }),
    ]);

    featured = featuredRes;
    kitchen = kitchenRes;
    bathroom = bathRes;
    flooring = floorRes;
    ceiling = ceilingRes;
  } catch {
    // sections stay empty
  }

  const hasAny =
    featured.length ||
    kitchen.length ||
    bathroom.length ||
    flooring.length ||
    ceiling.length;

  return (
    <div className="home-page">
      <HeroSection />

      {!hasAny ? (
        <section className="featured-product home-property-section" style={{ backgroundColor: "#F1F1F1" }}>
          <div className="container-fluid px-3 px-lg-5">
            <div className="property-empty">
              No renovation services available yet. Ensure the Laravel API is running.
            </div>
          </div>
        </section>
      ) : null}

      <HomePropertySection
        title="Featured Renovation Services"
        viewAllHref="/properties?featured=1&listing_type=normal"
        properties={featured}
        tone="default"
      />

      <HomePropertySection
        title="Kitchen Renovation"
        viewAllHref="/properties?sub_category=kitchen-renovation&listing_type=normal"
        properties={kitchen}
        tone="alt"
      />

      <HomePropertySection
        title="Bathroom Renovation"
        viewAllHref="/properties?sub_category=bathroom-renovation&listing_type=normal"
        properties={bathroom}
        tone="default"
      />

      <HomePropertySection
        title="Flooring & Marble"
        viewAllHref="/properties?sub_category=flooring&listing_type=normal"
        properties={flooring}
        tone="alt"
      />

      <HomePropertySection
        title="Ceiling & Lighting"
        viewAllHref="/properties?sub_category=ceiling&listing_type=normal"
        properties={ceiling}
        tone="default"
      />
    </div>
  );
}
