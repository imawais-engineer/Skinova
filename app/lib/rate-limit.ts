import "server-only";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitProfile = "scan" | "simulation" | "coach" | "routine";

const limits: Record<RateLimitProfile, number> = {
  scan: 10,
  simulation: 5,
  coach: 24,
  routine: 12
};

const WINDOW_MS = 60_000;

export function checkRateLimit(profile: RateLimitProfile, actorId: string) {
  const limit = limits[profile];
  const key = `${profile}:${actorId}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true as const, remaining: limit - 1, limit, resetAt: now + WINDOW_MS };
  }

  if (current.count >= limit) {
    return {
      ok: false as const,
      remaining: 0,
      limit,
      retryAfterMs: Math.max(0, current.resetAt - now)
    };
  }

  current.count += 1;
  return { ok: true as const, remaining: limit - current.count, limit, resetAt: current.resetAt };
}

export function rateLimitHeaders(result: ReturnType<typeof checkRateLimit>): Record<string, string> {
  if (result.ok) {
    return {
      "X-RateLimit-Limit": String(result.limit),
      "X-RateLimit-Remaining": String(result.remaining)
    };
  }

  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": "0",
    "Retry-After": String(Math.ceil(result.retryAfterMs / 1000))
  };
}
