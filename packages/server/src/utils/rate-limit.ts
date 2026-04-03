import { redisClient } from "@/db/redis";
import { Logger } from "@/logger";

const logger = new Logger("RateLimit");

/**
 * Safely parse an integer from an environment variable.
 * Falls back to `fallback` when the variable is unset, empty, or non-numeric.
 */
export const envInt = (key: string, fallback: number): number => {
  const val = Number(process.env[key]);
  return Number.isNaN(val) || val <= 0 ? fallback : val;
};

export interface RateLimitOptions {
  /** Maximum requests allowed within the window. */
  maxRequests: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

/**
 * Fixed-window rate limiter backed by Redis INCR + PEXPIRE.
 * Atomic across multiple server instances — safe for horizontal scaling.
 * Falls back to allowing requests (fail-open) if Redis is unavailable.
 *
 * Returns `true` if the request is allowed, `false` if it should be blocked.
 */
export async function checkRateLimit(
  key: string,
  opts: RateLimitOptions,
): Promise<boolean> {
  try {
    const redisKey = `rl:${key}`;
    const count = await redisClient.incr(redisKey);
    // Set TTL only on the first request so subsequent increments use the same window
    if (count === 1) {
      await redisClient.pexpire(redisKey, opts.windowMs);
    }
    return count <= opts.maxRequests;
  } catch (err) {
    // Fail-open: allow the request rather than hard-failing when Redis is down
    logger.warn(`Rate limit check failed (Redis unavailable): ${String(err)}`);
    return true;
  }
}
