import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost/api/v1";

const ALLOWED = new Set([
  "me",
  "logout",
  "login",
  "register",
  "forgot-password",
  "send-otp",
  "verify-otp",
  "session-link",
]);

type Ctx = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  const endpoint = path.join("/");
  const root = path[0] || "";

  if (!ALLOWED.has(endpoint) && !ALLOWED.has(root)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const auth = request.headers.get("authorization") || "";
  const url = `${API_BASE}/auth/${endpoint}${request.nextUrl.search}`;

  try {
    const init: RequestInit = {
      method: request.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      cache: "no-store",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.text();
    }

    const res = await fetch(url, init);
    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "Auth proxy failed" }, { status: 502 });
  }
}

export async function GET(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx);
}

export async function POST(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx);
}
