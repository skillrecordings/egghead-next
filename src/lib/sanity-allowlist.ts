import {sanityClient} from '@/utils/sanity-client'
import groq from 'groq'
import {getRedis} from '@/lib/upstash-redis'
import {logEvent, type LogContext} from '@/utils/structured-log'

type AllowlistKind = 'lesson' | 'course'

const LESSON_SET_KEY = 'sanity:allowlist:lesson:slugs'
const LESSON_META_KEY = 'sanity:allowlist:lesson:meta'

// Course metadata can match by slug OR by Rails numeric IDs.
// loadCourseMetadata() matches: railsCourseId == $courseId || externalId == $courseId || slug.current == $slug
const COURSE_SET_KEY = 'sanity:allowlist:course:keys'
const COURSE_META_KEY = 'sanity:allowlist:course:meta'

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 6 // 6h
const META_MEMORY_TTL_MS = 60 * 1000 // 1m per lambda instance

type AllowlistMeta = {
  version: 1
  kind: AllowlistKind
  refreshed_at: string
  count: number
}

type AllowlistStatus = {
  ready: boolean
  allowed: boolean
  reason: 'allowlist_hit' | 'allowlist_miss' | 'allowlist_not_ready'
}

type RefreshResult = {
  ok: boolean
  kind: AllowlistKind
  refreshed: boolean
  count?: number
  duration_ms?: number
  error_message?: string
}

function metaKeyFor(kind: AllowlistKind) {
  return kind === 'lesson' ? LESSON_META_KEY : COURSE_META_KEY
}

function setKeyFor(kind: AllowlistKind) {
  return kind === 'lesson' ? LESSON_SET_KEY : COURSE_SET_KEY
}

function tmpKeyFor(kind: AllowlistKind, nonce: string) {
  return `${setKeyFor(kind)}:tmp:${nonce}`
}

function isMetaFresh(meta: AllowlistMeta, maxAgeSeconds: number): boolean {
  const ms = Date.parse(meta.refreshed_at)
  if (!Number.isFinite(ms)) return false
  return Date.now() - ms <= maxAgeSeconds * 1000
}

const metaMemoryCache = new Map<
  AllowlistKind,
  {value: AllowlistMeta | null; expiresAt: number}
>()

async function getMeta(kind: AllowlistKind): Promise<AllowlistMeta | null> {
  const cached = metaMemoryCache.get(kind)
  if (cached && Date.now() < cached.expiresAt) return cached.value

  const redis = getRedis()
  if (!redis) {
    metaMemoryCache.set(kind, {
      value: null,
      expiresAt: Date.now() + META_MEMORY_TTL_MS,
    })
    return null
  }

  try {
    const meta = await redis.get<AllowlistMeta>(metaKeyFor(kind))
    const value = meta ?? null
    metaMemoryCache.set(kind, {
      value,
      expiresAt: Date.now() + META_MEMORY_TTL_MS,
    })
    return value
  } catch {
    metaMemoryCache.set(kind, {
      value: null,
      expiresAt: Date.now() + META_MEMORY_TTL_MS,
    })
    return null
  }
}

const lessonAllowlistQuery = groq`
*[_type == "lesson" && defined(slug.current)]{
  "slug": slug.current
}
`

const courseAllowlistQuery = groq`
*[_type in ["course","resource"] && (defined(slug.current) || defined(railsCourseId) || defined(externalId))]{
  "slug": slug.current,
  "railsCourseId": railsCourseId,
  "externalId": externalId
}
`

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items]
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size))
  return out
}

async function refreshAllowlist(
  kind: AllowlistKind,
  logContext: LogContext,
): Promise<RefreshResult> {
  const redis = getRedis()
  if (!redis) {
    return {ok: false, kind, refreshed: false, error_message: 'redis_missing'}
  }

  const startedAt = Date.now()
  const nonce = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const stableSetKey = setKeyFor(kind)
  const tmpSetKey = tmpKeyFor(kind, nonce)

  try {
    if (kind === 'lesson') {
      const rows = (await sanityClient.fetch<{slug?: string}[]>(
        lessonAllowlistQuery,
      )) as {slug?: string}[]
      const slugs = rows
        .map((r) => (r?.slug || '').trim())
        .filter(Boolean) as string[]
      const unique = Array.from(new Set(slugs))

      await redis.del(tmpSetKey)
      for (const part of chunk(unique, 1000)) {
        // Upstash types require at least 1 member. `chunk()` guarantees non-empty parts
        // but TS can't infer that from `string[]`, so we destructure safely.
        const [first, ...rest] = part
        if (!first) continue
        await redis.sadd(tmpSetKey, first, ...rest)
      }

      await redis.rename(tmpSetKey, stableSetKey)

      const meta: AllowlistMeta = {
        version: 1,
        kind,
        refreshed_at: new Date().toISOString(),
        count: unique.length,
      }
      await redis.set(metaKeyFor(kind), meta)
      metaMemoryCache.set(kind, {
        value: meta,
        expiresAt: Date.now() + META_MEMORY_TTL_MS,
      })

      return {
        ok: true,
        kind,
        refreshed: true,
        count: unique.length,
        duration_ms: Date.now() - startedAt,
      }
    }

    // course
    const rows = (await sanityClient.fetch<
      {slug?: string; railsCourseId?: number; externalId?: number}[]
    >(courseAllowlistQuery)) as {
      slug?: string
      railsCourseId?: number
      externalId?: number
    }[]

    const keys: string[] = []
    for (const r of rows) {
      const slug = (r?.slug || '').trim()
      if (slug) keys.push(`slug:${slug}`)
      if (Number.isFinite(r?.railsCourseId))
        keys.push(`id:${Number(r?.railsCourseId)}`)
      if (Number.isFinite(r?.externalId))
        keys.push(`id:${Number(r?.externalId)}`)
    }
    const unique = Array.from(new Set(keys))

    await redis.del(tmpSetKey)
    for (const part of chunk(unique, 1000)) {
      const [first, ...rest] = part
      if (!first) continue
      await redis.sadd(tmpSetKey, first, ...rest)
    }

    await redis.rename(tmpSetKey, stableSetKey)

    const meta: AllowlistMeta = {
      version: 1,
      kind,
      refreshed_at: new Date().toISOString(),
      count: unique.length,
    }
    await redis.set(metaKeyFor(kind), meta)
    metaMemoryCache.set(kind, {
      value: meta,
      expiresAt: Date.now() + META_MEMORY_TTL_MS,
    })

    return {
      ok: true,
      kind,
      refreshed: true,
      count: unique.length,
      duration_ms: Date.now() - startedAt,
    }
  } catch (e: any) {
    return {
      ok: false,
      kind,
      refreshed: false,
      duration_ms: Date.now() - startedAt,
      error_message: e?.message ?? String(e),
    }
  }
}

export async function refreshAllowlistIfStale(
  kind: AllowlistKind,
  logContext: LogContext = {},
  maxAgeSeconds: number = Number(
    process.env.SANITY_ALLOWLIST_MAX_AGE_SECONDS ?? DEFAULT_MAX_AGE_SECONDS,
  ),
): Promise<RefreshResult> {
  const meta = await getMeta(kind)
  if (meta && isMetaFresh(meta, maxAgeSeconds)) {
    return {ok: true, kind, refreshed: false, count: meta.count}
  }

  const res = await refreshAllowlist(kind, logContext)
  if (res.ok && res.refreshed) {
    logEvent(
      'info',
      'sanity.allowlist.refresh',
      {
        kind,
        count: res.count ?? 0,
        duration_ms: res.duration_ms ?? 0,
        ok: true,
      },
      logContext,
    )
  } else if (!res.ok) {
    logEvent(
      'warn',
      'sanity.allowlist.refresh_error',
      {
        kind,
        duration_ms: res.duration_ms ?? 0,
        ok: false,
        error_message: res.error_message,
      },
      logContext,
    )
  }

  return res
}

export async function sanityAllowlistAllowsLesson(
  slug: string,
  logContext: LogContext = {},
): Promise<AllowlistStatus> {
  const redis = getRedis()
  if (!redis) {
    return {ready: false, allowed: true, reason: 'allowlist_not_ready'}
  }

  const meta = await getMeta('lesson')
  if (!meta) return {ready: false, allowed: true, reason: 'allowlist_not_ready'}

  try {
    const allowed = Boolean(await redis.sismember(LESSON_SET_KEY, slug))
    return {
      ready: true,
      allowed,
      reason: allowed ? 'allowlist_hit' : 'allowlist_miss',
    }
  } catch {
    return {ready: false, allowed: true, reason: 'allowlist_not_ready'}
  }
}

export async function sanityAllowlistAllowsCourse(
  params: {slug?: string; courseId?: number},
  logContext: LogContext = {},
): Promise<AllowlistStatus> {
  const redis = getRedis()
  if (!redis) {
    return {ready: false, allowed: true, reason: 'allowlist_not_ready'}
  }

  const meta = await getMeta('course')
  if (!meta) return {ready: false, allowed: true, reason: 'allowlist_not_ready'}

  const slugKey = params.slug ? `slug:${params.slug}` : null
  const idKey =
    params.courseId != null && Number.isFinite(params.courseId)
      ? `id:${Number(params.courseId)}`
      : null

  // If we can't build a key, we can't safely check membership. Fail open.
  if (!slugKey && !idKey) {
    return {ready: false, allowed: true, reason: 'allowlist_not_ready'}
  }

  try {
    // We check both potential match keys because the Sanity doc might only have
    // railsCourseId/externalId populated (or the slug could drift).
    const p = redis.pipeline()
    if (slugKey) p.sismember(COURSE_SET_KEY, slugKey)
    if (idKey) p.sismember(COURSE_SET_KEY, idKey)
    const results = await p.exec<number[]>()
    const allowed = results.some((r) => Boolean(r))
    return {
      ready: true,
      allowed,
      reason: allowed ? 'allowlist_hit' : 'allowlist_miss',
    }
  } catch {
    return {ready: false, allowed: true, reason: 'allowlist_not_ready'}
  }
}
