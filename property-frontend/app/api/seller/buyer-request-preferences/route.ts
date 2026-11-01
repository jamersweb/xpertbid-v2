import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v1";

const SITE = "property";

async function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization") || "";
  const upstream = new URL(`${API_BASE}/seller/buyer-request-preferences`);
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key === "site") return;
    upstream.searchParams.append(key, value);
  });
  upstream.searchParams.set("site", SITE);

  try {
    const init: RequestInit = {
      method: request.method,
      headers: {
        Accept: "application/json",
        "Content-Type": request.headers.get("Content-Type") || "application/json",
        "X-Site": SITE,
        ...(auth ? { Authorization: auth } : {}),
      },
      cache: "no-store",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.text();
    }
    const res = await fetch(upstream.toString(), init);
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "Preferences proxy failed" }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  return proxy(request);
}
export async function PUT(request: NextRequest) {
  return proxy(request);
}
