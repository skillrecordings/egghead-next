import {Redis} from '@upstash/redis'

/**
 * Agent note:
 * - We prefer Upstash directly over `@vercel/kv`.
 * - `Redis.fromEnv()` supports both Upstash env vars and Vercel KV fallbacks:
 *   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *   - KV_REST_API_URL / KV_REST_API_TOKEN
 *
 * This module is intentionally lazy so local dev/tests don't crash when Redis
 * env vars aren't present.
 */

let _redis: Redis | null | undefined

function hasRedisEnv(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  return Boolean(url && token)
}

export function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis
  if (!hasRedisEnv()) {
    _redis = null
    return _redis
  }

  try {
    _redis = Redis.fromEnv()
  } catch {
    _redis = null
  }
  return _redis
}
