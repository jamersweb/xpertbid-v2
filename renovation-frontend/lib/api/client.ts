import type {
  CategoryNode,
  LocationItem,
  PaginatedProperties,
  PropertyCard,
  PropertyDetail,
  PropertyFilters,
} from "@/types/property";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api/v1";

const REVALIDATE = Number(process.env.API_REVALIDATE_SECONDS || 120);

function buildQuery(params: Record<string, string | number | undefined | null>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    qs.set(key, String(value));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      ...init,
      next: { revalidate: REVALIDATE },
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[Renovation API] HTTP ${res.status} from ${url}:`, body.slice(0, 200));
      throw new Error(`API ${res.status} ${url}: ${body.slice(0, 200)}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[Renovation API] Fetch error for ${url}:`, (err as Error)?.message || err);
    throw err;
  }
}

export async function getHealth() {
  try {
    return await apiFetch<{ status: string }>("/health");
  } catch {
    return { status: "unreachable" };
  }
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedProperties> {
  try {
    const query = buildQuery({
      page: filters.page,
      per_page: filters.per_page ?? 12,
      q: filters.q,
      city: filters.city,
      city_id: filters.city_id,
      state_id: filters.state_id,
      country_id: filters.country_id,
      type: filters.type,
      purpose: filters.purpose,
      listing_type: filters.listing_type,
      sub_category: filters.sub_category,
      child_category: filters.child_category,
      price_min: filters.price_min,
      price_max: filters.price_max,
      bedrooms: filters.bedrooms,
      featured: filters.featured,
      sort: filters.sort,
    });

    const json = await apiFetch<{
      data: PropertyCard[];
      meta?: PaginatedProperties["meta"];
      links?: PaginatedProperties["links"];
    }>(`/renovations${query}`);

    const meta = json.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: filters.per_page ?? 12,
      total: json.data?.length ?? 0,
    };

    return { data: json.data ?? [], meta, links: json.links };
  } catch {
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: filters.per_page ?? 12,
        total: 0,
      },
    };
  }
}

export async function getFeaturedProperties(limit = 8): Promise<PropertyCard[]> {
  try {
    const json = await apiFetch<{ data: PropertyCard[] }>(
      `/renovations/featured${buildQuery({ limit })}`
    );
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getProperty(slug: string): Promise<PropertyDetail | null> {
  try {
    const json = await apiFetch<{ data: PropertyDetail }>(`/renovations/${encodeURIComponent(slug)}`);
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedProperties(slug: string): Promise<PropertyCard[]> {
  try {
    const json = await apiFetch<{ data: PropertyCard[] }>(
      `/renovations/${encodeURIComponent(slug)}/related`
    );
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getPropertyCategories(): Promise<CategoryNode> {
  try {
    const json = await apiFetch<{ data: CategoryNode }>("/renovation-categories");
    return json.data ?? { id: 1176, name: "Home Renovation", slug: "home-renovation", children: [] };
  } catch {
    return { id: 1176, name: "Home Renovation", slug: "home-renovation", children: [] };
  }
}

export async function getCountries(): Promise<LocationItem[]> {
  try {
    const json = await apiFetch<{ data: LocationItem[] }>("/locations/countries");
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getStates(countryId: number): Promise<LocationItem[]> {
  try {
    const json = await apiFetch<{ data: LocationItem[] }>(
      `/locations/states/${countryId}`
    );
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getCities(stateId: number): Promise<LocationItem[]> {
  try {
    const json = await apiFetch<{ data: LocationItem[] }>(
      `/locations/cities/${stateId}`
    );
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getSitemapSlugs(page = 1, perPage = 200) {
  try {
    return await apiFetch<{
      data: { slug: string; updated_at: string | null }[];
      meta: { current_page: number; last_page: number; total: number };
    }>(`/renovations/sitemap-slugs${buildQuery({ page, per_page: perPage })}`);
  } catch {
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, total: 0 },
    };
  }
}

export function getApiBaseUrl() {
  return API_BASE;
}
