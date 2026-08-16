import "server-only";
import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitHeaders, type RateLimitProfile } from "./rate-limit";

export function enforceRateLimit(actorId: string, profile: RateLimitProfile) {
  const result = checkRateLimit(profile, actorId);

  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: rateLimitHeaders(result) }
    );
  }

  return { headers: rateLimitHeaders(result) };
}
