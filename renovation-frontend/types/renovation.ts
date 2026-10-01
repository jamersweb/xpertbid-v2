/** Shared Home Renovation API types */

export type RenovationPrice = {
  amount: number | null;
  currency: string;
};

export type RenovationLocation = {
  city: string | null;
  state: string | null;
  country: string | null;
};

export type RenovationCategoryRef = {
  id: number | null;
  name: string | null;
  slug: string | null;
  sub_category?: string | null;
  sub_category_slug?: string | null;
  child_category?: string | null;
  child_category_slug?: string | null;
};

export type RenovationSeller = {
  id?: number | null;
  name: string | null;
  avatar_url: string | null;
  rating?: number;
};

export type RenovationCard = {
  id: number;
  slug: string;
  title: string;
  status: string;
  listing_type: string | null;
  price: RenovationPrice;
  image_url: string | null;
  album_urls: string[];
  location: RenovationLocation;
  category: RenovationCategoryRef;
  attributes: Record<string, string | number | boolean | null>;
  featured: boolean;
  created_at: string | null;
  seller?: RenovationSeller;
};

export type RenovationDetail = RenovationCard & {
  description: string;
  map_url: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  canonical_path: string;
  views: number;
  youtube_video_id?: string | null;
  featured_name?: string | null;
  scope_of_work?: string | null;
  materials_spec?: string | null;
  warranty_details?: string | null;
  terms_conditions?: string | null;
  packages?: Array<{
    name: string;
    price: number | string;
    features: string[];
    description?: string;
  }>;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedRenovations = {
  data: RenovationCard[];
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

export type RenovationFilters = {
  page?: number;
  per_page?: number;
  q?: string;
  city?: string;
  city_id?: number;
  state_id?: number;
  country_id?: number;
  service_type?: string;
  listing_type?: string;
  sub_category?: string;
  child_category?: string;
  price_min?: number;
  price_max?: number;
  featured?: 0 | 1;
  sort?: "latest" | "price_asc" | "price_desc" | "featured" | "views";
};

export type LocationItem = {
  id: number;
  name: string;
  country_id?: number;
  state_id?: number;
};
