import {Redis} from '@upstash/redis'

/**
 * Agent note:
 * - We prefer Upstash directly over `@vercel/kv`.
 * - Vercel-managed KV is still Upstash under the hood. In practice we often have
 *   BOTH env var sets present:
 *   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
 *   - `KV_REST_API_URL` / `KV_REST_API_TOKEN`
 *
 *   Unfortunately, `Redis.fromEnv()` prefers `UPSTASH_*` when set, even if those
 *   values are stale/broken. That can take down caching and any feature that
 *   relies on Redis.
 *
 *   So we explicitly choose the connection details instead of relying on
 *   `fromEnv()`'s preference order.
 *
 * This module is intentionally lazy so local dev/tests don't crash when Redis
 * env vars aren't present.
 */

let _redis: Redis | null | undefined

function resolveRedisEnv(): {
  source: 'kv' | 'upstash'
  url: string
  token: string
} | null {
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN
  if (kvUrl && kvToken) return {source: 'kv', url: kvUrl, token: kvToken}

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (upstashUrl && upstashToken)
    return {source: 'upstash', url: upstashUrl, token: upstashToken}

  return null
}

export function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis
  const cfg = resolveRedisEnv()
  if (!cfg) {
    _redis = null
    return _redis
  }

  try {
    _redis = new Redis({url: cfg.url, token: cfg.token})
  } catch {
    _redis = null
  }
  return _redis
}
