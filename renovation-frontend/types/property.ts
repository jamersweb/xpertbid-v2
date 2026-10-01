/** Shared property API types */

export type PropertyPrice = {
  amount: number | null;
  currency: string;
};

export type PropertyLocation = {
  city: string | null;
  state: string | null;
  country: string | null;
};

export type PropertyCategoryRef = {
  id: number | null;
  name: string | null;
  slug: string | null;
  sub_category?: string | null;
  child_category?: string | null;
};

export type PropertySeller = {
  name: string | null;
  avatar_url: string | null;
};

export type PropertyCard = {
  id: number;
  slug: string;
  title: string;
  status: string;
  listing_type: string | null;
  price: PropertyPrice;
  image_url: string | null;
  album_urls: string[];
  location: PropertyLocation;
  category: PropertyCategoryRef;
  attributes: Record<string, string | number | boolean | null>;
  featured: boolean;
  created_at: string | null;
  seller?: PropertySeller;
};

export type PropertyDetail = PropertyCard & {
  description: string;
  map_url: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  canonical_path: string;
  views: number;
  start_date?: string | null;
  end_date?: string | null;
  minimum_bid?: number | null;
  reserve_price?: number | null;
  highest_bid?: number | null;
  youtube_video_id?: string | null;
  featured_name?: string | null;
  product_location?: string | null;
  developer?: string | null;
  delivery_date?: string | null;
  sale_starts?: string | null;
  payment_plan?: string | null;
  number_of_buildings?: string | number | null;
  government_fee?: string | null;
  location_url?: string | null;
  nearby_location?: string | null;
  amenities?: string | null;
  facilities?: string | null;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedProperties = {
  data: PropertyCard[];
  meta: PaginationMeta;
  links?: Record<string, string | null>;
};

export type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  children: CategoryNode[];
};

export type PropertyFilters = {
  page?: number;
  per_page?: number;
  q?: string;
  city?: string;
  city_id?: number;
  state_id?: number;
  country_id?: number;
  type?: string;
  purpose?: string;
  listing_type?: string;
  sub_category?: string;
  child_category?: string;
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  featured?: 0 | 1;
  sort?: "latest" | "price_asc" | "price_desc" | "featured";
};

export type LocationItem = {
  id: number;
  name: string;
  country_id?: number;
  state_id?: number;
};
