import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = Redis.fromEnv();

// 20 reaction requests per minute per guest — enough for normal use, tight
// enough to blunt a script hammering the public write endpoint.
export const reactionRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  prefix: "ratelimit:reactions",
});

// Every guest's reaction to every message lives in ONE hash, field
// `${messageId}:${guestId}` -> emoji. A page load's bulk fetch is then a
// single HGETALL regardless of how many messages are on screen, instead of
// one HGETALL per message (which is what was driving Upstash usage way up —
// ~26 commands per fetch, refetched on every staggered-reveal step).
export const REACTIONS_KEY = "reactions";
export const reactionField = (messageId: string, guestId: string) => `${messageId}:${guestId}`;

type ReactionsHash = Record<string, string>;

// Module-level cache: survives across requests on the same warm serverless
// instance (reset on cold start, which is fine — it's a cost optimization,
// not a correctness guarantee). Cuts repeat reads within the TTL window to
// zero Redis commands.
const CACHE_TTL_MS = 20_000;
let cachedHash: ReactionsHash | null = null;
let cachedAt = 0;

export async function getReactionsHash(): Promise<ReactionsHash> {
  if (cachedHash && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedHash;
  }

  cachedHash = (await redis.hgetall<ReactionsHash>(REACTIONS_KEY)) || {};
  cachedAt = Date.now();
  return cachedHash;
}

// Patches the cache in place after a write, so the guest who just reacted
// (and anyone else hitting this same warm instance) sees it immediately
// without forcing a fresh HGETALL.
export function patchReactionsCache(field: string, emoji: string | null) {
  if (!cachedHash) return;
  if (emoji === null) delete cachedHash[field];
  else cachedHash[field] = emoji;
}
