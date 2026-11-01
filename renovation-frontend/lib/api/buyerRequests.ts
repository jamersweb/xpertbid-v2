import { getStoredToken } from "@/lib/api/auth";

export type PublicIdentity = {
  id: number;
  name?: string | null;
  profile_pic?: string | null;
  profile?: string | null;
  is_verified?: boolean;
  verification_type?: "corporate" | "individual" | string | null;
};

export type BuyerRequestOffer = {
  id: number;
  price: number;
  currency?: string;
  message?: string | null;
  status: string;
  seller?: PublicIdentity | null;
};

export type BuyerRequestItem = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  location_label?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  budget?: number | null;
  category?: { id: number; name?: string } | null;
  sub_category?: { id: number; name?: string } | null;
  child_category?: { id: number; name?: string } | null;
  category_id?: number | null;
  sub_category_id?: number | null;
  child_category_id?: number | null;
  images?: { id: number; url: string; sort_order?: number }[];
  offers_count?: number;
  offers?: BuyerRequestOffer[];
  user?: PublicIdentity | null;
  my_offer?: BuyerRequestOffer | null;
  created_at?: string;
};

async function buyerRequestFetch(path: string, init?: RequestInit) {
  const token = getStoredToken();
  const res = await fetch(`/api${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Buyer request API error (${res.status})`;
    try {
      const body = await res.json();
      message =
        body?.message ||
        (body?.errors ? Object.values(body.errors).flat().join(" ") : null) ||
        message;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function listMyBuyerRequests() {
  return buyerRequestFetch("/buyer-requests");
}

export function listMatchedBuyerRequests() {
  return buyerRequestFetch("/buyer-requests/matched");
}

export function getBuyerRequest(slug: string) {
  return buyerRequestFetch(`/buyer-requests/${encodeURIComponent(slug)}`);
}

export function createBuyerRequest(form: FormData) {
  return buyerRequestFetch("/buyer-requests", {
    method: "POST",
    body: form,
    headers: {},
  });
}

export function updateBuyerRequest(slug: string, form: FormData) {
  form.append("_method", "PUT");
  return buyerRequestFetch(`/buyer-requests/${encodeURIComponent(slug)}`, {
    method: "POST",
    body: form,
    headers: {},
  });
}

export function closeBuyerRequest(slug: string) {
  return buyerRequestFetch(`/buyer-requests/${encodeURIComponent(slug)}/close`, {
    method: "POST",
    body: JSON.stringify({}),
    headers: { "Content-Type": "application/json" },
  });
}

export function submitOffer(slug: string, data: { price: number; message?: string }) {
  return buyerRequestFetch(`/buyer-requests/${encodeURIComponent(slug)}/offers`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export function acceptOffer(slug: string, offerId: number) {
  return buyerRequestFetch(
    `/buyer-requests/${encodeURIComponent(slug)}/offers/${offerId}/accept`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function rejectOffer(slug: string, offerId: number) {
  return buyerRequestFetch(
    `/buyer-requests/${encodeURIComponent(slug)}/offers/${offerId}/reject`,
    {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function updateOffer(offerId: number, data: { price: number; message?: string }) {
  return buyerRequestFetch(`/buyer-request-offers/${offerId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export function withdrawOffer(offerId: number) {
  return buyerRequestFetch(`/buyer-request-offers/${offerId}`, {
    method: "DELETE",
  });
}

export function getSellerPreferences() {
  return buyerRequestFetch("/seller/buyer-request-preferences");
}

export function saveSellerPreferences(data: {
  category_ids?: number[];
  locations?: Array<Record<string, unknown>>;
}) {
  return buyerRequestFetch("/seller/buyer-request-preferences", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}
