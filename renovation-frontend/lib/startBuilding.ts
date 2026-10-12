import {
  findBuilderRoot,
  findChildByName,
  nameIncludes,
} from "@/lib/categoryTree";
import { propertyUrl } from "@/lib/site";
import type { CategoryNode } from "@/types/property";

export type PlotAnswer = "yes" | "no" | "not_sure";
export type BuildingNeed = "architect" | "contractor" | "materials";

export type BrowseTarget = {
  href: string;
  usedFallback: boolean;
};

const FALLBACK_BUILDER_SLUG = "home-builder";

function isContractorsSub(node: CategoryNode) {
  return (
    nameIncludes(node, "contractors", "building") ||
    nameIncludes(node, "contractors & building")
  );
}

function isMaterialsSub(node: CategoryNode) {
  return nameIncludes(node, "raw construction materials");
}

function isArchitectChild(node: CategoryNode) {
  return nameIncludes(node, "architect") || nameIncludes(node, "3d floor plan");
}

function buildPropertiesHref(params: {
  type?: string | null;
  sub_category?: string | null;
  child_category?: string | null;
}) {
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.sub_category) qs.set("sub_category", params.sub_category);
  if (params.child_category) qs.set("child_category", params.child_category);
  qs.set("listing_type", "normal");
  return `/properties?${qs.toString()}`;
}

export function propertyListingsUrl() {
  return propertyUrl("/properties");
}

/**
 * Resolve a Start Building “need” to a /properties browse URL using
 * name-based category matching (slugs are environment-specific).
 */
export function resolveBuildingBrowseUrl(
  purposes: CategoryNode[],
  need: BuildingNeed
): BrowseTarget {
  const builder = findBuilderRoot(purposes);
  const typeSlug = builder?.slug || FALLBACK_BUILDER_SLUG;

  if (!builder) {
    return {
      href: buildPropertiesHref({ type: typeSlug }),
      usedFallback: true,
    };
  }

  if (need === "materials") {
    const materials = findChildByName(builder, isMaterialsSub);
    if (!materials?.slug) {
      return {
        href: buildPropertiesHref({ type: typeSlug }),
        usedFallback: true,
      };
    }
    return {
      href: buildPropertiesHref({ type: typeSlug, sub_category: materials.slug }),
      usedFallback: false,
    };
  }

  const contractors = findChildByName(builder, isContractorsSub);
  if (!contractors?.slug) {
    return {
      href: buildPropertiesHref({ type: typeSlug }),
      usedFallback: true,
    };
  }

  if (need === "contractor") {
    return {
      href: buildPropertiesHref({
        type: typeSlug,
        sub_category: contractors.slug,
      }),
      usedFallback: false,
    };
  }

  // architect — if child missing, still land on contractors services
  const architect = findChildByName(contractors, isArchitectChild);
  if (!architect?.slug) {
    return {
      href: buildPropertiesHref({
        type: typeSlug,
        sub_category: contractors.slug,
      }),
      usedFallback: false,
    };
  }

  return {
    href: buildPropertiesHref({
      type: typeSlug,
      sub_category: contractors.slug,
      child_category: architect.slug,
    }),
    usedFallback: false,
  };
}
