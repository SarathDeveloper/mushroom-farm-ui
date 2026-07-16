import { NextResponse } from "next/server";

interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (key: string, limit: number): { success: boolean; remaining: number; reset: number } => {
      const now = Date.now();
      const entry = rateLimitStore.get(key);
      
      if (!entry || entry.resetTime < now) {
        const resetTime = now + config.interval;
        rateLimitStore.set(key, { count: 1, resetTime });
        return { success: true, remaining: limit - 1, reset: resetTime };
      }
      
      if (entry.count >= limit) {
        return { success: false, remaining: 0, reset: entry.resetTime };
      }
      
      entry.count++;
      return { success: true, remaining: limit - entry.count, reset: entry.resetTime };
    },
  };
}

const defaultLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

export async function withRateLimit(
  request: Request,
  handler: () => Promise<NextResponse>,
  options: { limit?: number; identifier?: string } = {}
): Promise<NextResponse> {
  const { limit = 60, identifier } = options;
  const ip = getClientIp(request);
  const key = identifier ? `${identifier}:${ip}` : ip;
  
  const result = defaultLimiter.check(key, limit);
  
  if (!result.success) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.reset.toString(),
          "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  const response = await handler();
  
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.reset.toString());
  
  return response;
}

export const apiLimits = {
  auth: 10,
  otp: 5,
  orders: 30,
  general: 60,
} as const;
