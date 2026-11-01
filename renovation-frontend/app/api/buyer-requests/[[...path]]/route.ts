import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v1";

const SITE = "renovation";

type Ctx = { params: Promise<{ path?: string[] }> };

async function proxy(request: NextRequest, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  const suffix = path.length ? `/${path.join("/")}` : "";
  const auth = request.headers.get("authorization") || "";

  const upstream = new URL(`${API_BASE}/buyer-requests${suffix}`);
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
        "X-Site": SITE,
        ...(auth ? { Authorization: auth } : {}),
      },
      cache: "no-store",
    };

    const contentType = request.headers.get("Content-Type");
    if (contentType) {
      (init.headers as Record<string, string>)["Content-Type"] = contentType;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.arrayBuffer();
    }

    const res = await fetch(upstream.toString(), init);
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "Buyer requests proxy failed" }, { status: 502 });
  }
}

export async function GET(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx);
}

export async function POST(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx);
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx);
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx);
}
