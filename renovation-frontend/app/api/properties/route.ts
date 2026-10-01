import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost/api/v1";

const ALLOWED_KEYS = new Set([
  "page",
  "per_page",
  "q",
  "city",
  "city_id",
  "state_id",
  "country_id",
  "type",
  "purpose",
  "listing_type",
  "sub_category",
  "child_category",
  "price_min",
  "price_max",
  "bedrooms",
  "featured",
  "sort",
]);

export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams;
  const outgoing = new URLSearchParams();

  incoming.forEach((value, key) => {
    if (!ALLOWED_KEYS.has(key) || value === "") return;
    outgoing.set(key, value);
  });

  if (!outgoing.has("per_page")) {
    outgoing.set("per_page", "12");
  }

  const qs = outgoing.toString();
  const url = `${API_BASE}/properties${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch properties" },
      { status: 502 }
    );
  }
}
