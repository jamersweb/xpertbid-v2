import { HeroSection } from "@/components/HeroSection";
import { HomePropertySection } from "@/components/HomePropertySection";
import { findBuilderRoot } from "@/lib/categoryTree";
import {
  getProperties,
  getPropertyCategories,
} from "@/lib/api/client";
import type { CategoryNode, PropertyCard, PropertyFilters } from "@/types/property";

export const revalidate = 120;

const SECTION_LIMIT = 3;
const HOME_BUILDER_SECTION_COUNT = 5;

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

function findBuilderFromTree(tree: CategoryNode | null): CategoryNode | null {
  if (!tree) return null;
  const mains = tree.main_categories?.length
    ? tree.main_categories
    : tree.slug
      ? [tree]
      : [];
  return findBuilderRoot(mains);
}

/** Prefer a sensible Home Builder mix; fill with remaining children up to 5. */
function pickHomeBuilderSections(builder: CategoryNode | null): CategoryNode[] {
  const children = (builder?.children || []).filter((c) => c.slug);
  if (!children.length) return [];

  const preferredHints = [
    "raw construction materials",
    "contractors",
    "roofing",
    "electrical",
    "doors",
  ];

  const picked: CategoryNode[] = [];
  const used = new Set<number>();

  for (const hint of preferredHints) {
    if (picked.length >= HOME_BUILDER_SECTION_COUNT) break;
    const match = children.find(
      (c) =>
        !used.has(c.id) &&
        (c.name?.toLowerCase().includes(hint) ||
          c.slug?.toLowerCase().includes(hint.replace(/\s+/g, "-")))
    );
    if (match) {
      picked.push(match);
      used.add(match.id);
    }
  }

  for (const child of children) {
    if (picked.length >= HOME_BUILDER_SECTION_COUNT) break;
    if (used.has(child.id)) continue;
    picked.push(child);
    used.add(child.id);
  }

  return picked;
}

export default async function HomePage() {
  let tree: CategoryNode | null = null;
  try {
    tree = await getPropertyCategories();
  } catch {
    tree = null;
  }

  const builder = findBuilderFromTree(tree);
  const builderSlug = builder?.slug || "home-builder";
  const sections = pickHomeBuilderSections(builder);

  let featured: PropertyCard[] = [];
  const sectionProducts: PropertyCard[][] = [];

  try {
    const [featuredRes, ...categoryResults] = await Promise.all([
      safeProperties({ type: builderSlug, featured: 1 }),
      ...sections.map((cat) =>
        safeProperties({ type: builderSlug, sub_category: cat.slug })
      ),
    ]);

    featured = featuredRes;
    sectionProducts.push(...categoryResults);
  } catch {
    // sections stay empty
  }

  const hasAny =
    featured.length > 0 || sectionProducts.some((list) => list.length > 0);

  return (
    <div className="home-page">
      <HeroSection />

      {!hasAny ? (
        <section
          className="featured-product home-property-section"
          style={{ backgroundColor: "#F1F1F1" }}
        >
          <div className="container-fluid px-3 px-lg-5">
            <div className="property-empty">
              No Home Builder products available yet. Ensure the Laravel API is running.
            </div>
          </div>
        </section>
      ) : null}

      <HomePropertySection
        title="Featured Home Builder Products"
        viewAllHref={`/properties?type=${encodeURIComponent(builderSlug)}&featured=1&listing_type=normal`}
        properties={featured}
        tone="default"
      />

      {sections.map((cat, index) => (
        <HomePropertySection
          key={cat.id || cat.slug}
          title={cat.name}
          viewAllHref={`/properties?type=${encodeURIComponent(builderSlug)}&sub_category=${encodeURIComponent(cat.slug)}&listing_type=normal`}
          properties={sectionProducts[index] || []}
          tone={index % 2 === 0 ? "alt" : "default"}
        />
      ))}
    </div>
  );
}
