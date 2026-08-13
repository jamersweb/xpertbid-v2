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
  "http://localhost/api/v1";

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
    throw new Error(`API ${res.status} ${url}: ${body.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

export async function getHealth() {
  return apiFetch<{ status: string }>("/health");
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedProperties> {
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
  }>(`/properties${query}`);

  // Laravel Resource collection wraps meta under meta when using paginator
  const meta = json.meta ?? {
    current_page: 1,
    last_page: 1,
    per_page: filters.per_page ?? 12,
    total: json.data?.length ?? 0,
  };

  return { data: json.data ?? [], meta, links: json.links };
}

export async function getFeaturedProperties(limit = 8): Promise<PropertyCard[]> {
  const json = await apiFetch<{ data: PropertyCard[] }>(
    `/properties/featured${buildQuery({ limit })}`
  );
  return json.data ?? [];
}

export async function getProperty(slug: string): Promise<PropertyDetail | null> {
  try {
    const json = await apiFetch<{ data: PropertyDetail }>(`/properties/${encodeURIComponent(slug)}`);
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedProperties(slug: string): Promise<PropertyCard[]> {
  try {
    const json = await apiFetch<{ data: PropertyCard[] }>(
      `/properties/${encodeURIComponent(slug)}/related`
    );
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getPropertyCategories(): Promise<CategoryNode> {
  const json = await apiFetch<{ data: CategoryNode }>("/property-categories");
  return json.data;
}

export async function getCountries(): Promise<LocationItem[]> {
  const json = await apiFetch<{ data: LocationItem[] }>("/locations/countries");
  return json.data ?? [];
}

export async function getStates(countryId: number): Promise<LocationItem[]> {
  const json = await apiFetch<{ data: LocationItem[] }>(
    `/locations/states/${countryId}`
  );
  return json.data ?? [];
}

export async function getCities(stateId: number): Promise<LocationItem[]> {
  const json = await apiFetch<{ data: LocationItem[] }>(
    `/locations/cities/${stateId}`
  );
  return json.data ?? [];
}

export async function getSitemapSlugs(page = 1, perPage = 200) {
  return apiFetch<{
    data: { slug: string; updated_at: string | null }[];
    meta: { current_page: number; last_page: number; total: number };
  }>(`/properties/sitemap-slugs${buildQuery({ page, per_page: perPage })}`);
}

export function getApiBaseUrl() {
  return API_BASE;
}
