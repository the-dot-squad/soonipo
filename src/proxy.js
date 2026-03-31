import { NextResponse } from "next/server";

const rateLimitStore = globalThis.__apiRateLimitStore || new Map();
if (!globalThis.__apiRateLimitStore) {
  globalThis.__apiRateLimitStore = rateLimitStore;
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function getAllowedOrigins(request) {
  const origins = new Set();
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (configuredBaseUrl) {
    try {
      origins.add(new URL(configuredBaseUrl).origin);
    } catch {
      // Ignore malformed env values.
    }
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    origins.add(`https://${vercelUrl}`);
  }

  const requestOrigin = request.nextUrl.origin;
  if (requestOrigin) origins.add(requestOrigin);

  return origins;
}

function isCrossSiteBrowserRequest(request, allowedOrigins) {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) {
    return true;
  }

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return true;
  }

  return false;
}

function shouldRateLimit(pathname) {
  return pathname.startsWith("/api/") && !pathname.startsWith("/api/cron");
}

function getRateLimitPolicy(pathname) {
  if (pathname.startsWith("/api/ipos/search")) {
    return { max: 40, windowMs: 60_000 };
  }

  if (pathname.startsWith("/api/stock/")) {
    return { max: 80, windowMs: 60_000 };
  }

  return { max: 120, windowMs: 60_000 };
}

function applyRateLimit(request) {
  const pathname = request.nextUrl.pathname;
  const { max, windowMs } = getRateLimitPolicy(pathname);
  const ip = getClientIp(request);
  const now = Date.now();
  const key = `${pathname}:${ip}`;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    const nextState = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, nextState);
    return { allowed: true, remaining: max - 1, resetAt: nextState.resetAt, max };
  }

  if (existing.count >= max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt, max };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
    max,
  };
}

function withSecurityHeaders(response, rateLimit) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (rateLimit) {
    response.headers.set("X-RateLimit-Limit", String(rateLimit.max));
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.floor(rateLimit.resetAt / 1000))
    );
  }

  return response;
}

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Method not allowed" }, { status: 405 })
    );
  }

  const allowedOrigins = getAllowedOrigins(request);
  if (isCrossSiteBrowserRequest(request, allowedOrigins)) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Cross-site requests are blocked" }, { status: 403 })
    );
  }

  if (shouldRateLimit(pathname)) {
    const rateLimit = applyRateLimit(request);
    if (!rateLimit.allowed) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      );
      const response = NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(retryAfterSeconds));
      return withSecurityHeaders(response, rateLimit);
    }

    return withSecurityHeaders(NextResponse.next(), rateLimit);
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/api/:path*"],
};
