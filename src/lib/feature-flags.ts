import {createClient} from '@vercel/edge-config'
import {kv} from '@vercel/kv'
import {logEvent, timeEvent, type LogContext} from '@/utils/structured-log'

interface FeatureFlags {
  allowedRoles?: string[]
  saleBanner?: string[]
  earlyBirdBanner?: string[]
  workshop?: string[]
}

// We use prefixes to avoid mixing up the flags with other Edge Config values
const prefixKey = (prefix: string, key: string) => `${prefix}_${key}`

const EDGE_CONFIG_ID = process.env.FEATURE_FLAGS_EDGE_CONFIG
const edgeConfig = EDGE_CONFIG_ID ? createClient(EDGE_CONFIG_ID) : null

const FEATURE_FLAGS_KV_PREFIX = 'feature-flags'
const FEATURE_FLAGS_KV_TTL_SECONDS = Number(
  process.env.FEATURE_FLAGS_KV_TTL_SECONDS ?? '60',
)

type CacheEntry = {value: unknown; expiresAt: number}
const memoryCache = new Map<string, CacheEntry>()
const inFlight = new Map<string, Promise<unknown>>()

const memoryGet = <T>(key: string): T | undefined => {
  const entry = memoryCache.get(key)
  if (!entry) return undefined
  if (Date.now() >= entry.expiresAt) {
    memoryCache.delete(key)
    return undefined
  }
  return entry.value as T
}

const memorySet = (key: string, value: unknown) => {
  // Treat non-positive TTL as "no caching" without crashing callers.
  if (!Number.isFinite(FEATURE_FLAGS_KV_TTL_SECONDS)) return
  if (FEATURE_FLAGS_KV_TTL_SECONDS <= 0) return
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + FEATURE_FLAGS_KV_TTL_SECONDS * 1000,
  })
}

async function getCachedEdgeConfigValue<T>(
  prefixedKey: string,
  fetcher: () => Promise<T>,
  logContext: LogContext = {},
): Promise<T> {
  const mem = memoryGet<T>(prefixedKey)
  if (mem !== undefined) return mem

  const existing = inFlight.get(prefixedKey)
  if (existing) return (await existing) as T

  const promise = (async () => {
    const kvKey = `${FEATURE_FLAGS_KV_PREFIX}:${prefixedKey}`

    // 1) KV (Redis) cache: shared across lambda instances
    try {
      const cached = await kv.get<T>(kvKey)
      if (cached !== null && cached !== undefined) {
        memorySet(prefixedKey, cached)
        return cached
      }
    } catch {
      logEvent(
        'warn',
        'feature_flags.kv.get_error',
        {prefixed_key: prefixedKey},
        logContext,
      )
    }

    // 2) Edge Config: source of truth
    const fetched = await timeEvent(
      'feature_flags.edge_config.get',
      {prefixed_key: prefixedKey},
      fetcher,
      logContext,
    )

    memorySet(prefixedKey, fetched)
    try {
      if (Number.isFinite(FEATURE_FLAGS_KV_TTL_SECONDS)) {
        await kv.set(kvKey, fetched, {ex: FEATURE_FLAGS_KV_TTL_SECONDS})
      }
    } catch {
      logEvent(
        'warn',
        'feature_flags.kv.set_error',
        {prefixed_key: prefixedKey},
        logContext,
      )
    }

    return fetched
  })()

  inFlight.set(prefixedKey, promise as Promise<unknown>)
  try {
    return await promise
  } finally {
    inFlight.delete(prefixedKey)
  }
}

export async function getFeatureFlag(
  prefix: string,
  key: keyof FeatureFlags,
  logContext: LogContext = {},
) {
  const prefixedKey = prefixKey(prefix, key)
  if (!edgeConfig) return false

  return getCachedEdgeConfigValue(
    prefixedKey,
    () => edgeConfig.get<FeatureFlags>(prefixedKey),
    logContext,
  )
}

export async function getSaleBannerFeatureFlag(
  prefix: string,
  key: keyof FeatureFlags,
  logContext: LogContext = {},
) {
  const prefixedKey = prefixKey(prefix, key)
  if (!edgeConfig) return false

  const featureFlag = await getCachedEdgeConfigValue(
    prefixedKey,
    () => edgeConfig.get<boolean>(prefixedKey),
    logContext,
  )

  return Boolean(featureFlag)
}
