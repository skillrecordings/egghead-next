export const MIGRATION_AUTH_LANES = [
  'rails',
  'shadow',
  'authjs',
  'off',
] as const

export type MigrationAuthLane = (typeof MIGRATION_AUTH_LANES)[number]

export type MigrationFlagBackend = 'vercel' | 'redis'

export type MigrationFlagValues = {
  authLane: MigrationAuthLane
  currentUserShadow: boolean
}

export const MIGRATION_FLAGS_DEFAULTS: MigrationFlagValues = {
  authLane: 'rails',
  currentUserShadow: false,
}

export const MIGRATION_FLAG_KEYS = {
  authLane: 'egghead-migration-auth-lane',
  currentUserShadow: 'egghead-migration-current-user-shadow',
} as const

export function normalizeMigrationFlagBackend(
  value: unknown,
): MigrationFlagBackend {
  return value === 'redis' ? 'redis' : 'vercel'
}

export function normalizeAuthLane(value: unknown): MigrationAuthLane {
  return typeof value === 'string' &&
    MIGRATION_AUTH_LANES.includes(value as MigrationAuthLane)
    ? (value as MigrationAuthLane)
    : MIGRATION_FLAGS_DEFAULTS.authLane
}

export function normalizeCurrentUserShadow(value: unknown): boolean {
  return value === true
}

export function normalizeMigrationFlagValues(values: {
  authLane?: unknown
  currentUserShadow?: unknown
}): MigrationFlagValues {
  return {
    authLane: normalizeAuthLane(values.authLane),
    currentUserShadow: normalizeCurrentUserShadow(values.currentUserShadow),
  }
}

type RedisStoredFlagEnvelope = {
  value?: unknown
  expiresAt?: unknown
}

export type RedisFlagReadResult = {
  value: unknown
  reason:
    | 'redis_value'
    | 'redis_envelope'
    | 'redis_empty'
    | 'redis_missing_value'
    | 'redis_expired'
    | 'redis_invalid_expiry'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseRedisString(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

function parseExpiry(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsedNumber = Number(value)
    if (Number.isFinite(parsedNumber)) return parsedNumber

    const parsedDate = Date.parse(value)
    if (Number.isFinite(parsedDate)) return parsedDate
  }

  return null
}

export function readRedisStoredFlagValue({
  raw,
  defaultValue,
  now = Date.now(),
}: {
  raw: unknown
  defaultValue: unknown
  now?: number
}): RedisFlagReadResult {
  if (raw === null || raw === undefined) {
    return {value: defaultValue, reason: 'redis_empty'}
  }

  const parsed = typeof raw === 'string' ? parseRedisString(raw) : raw

  if (parsed === undefined) {
    return {value: defaultValue, reason: 'redis_empty'}
  }

  if (!isRecord(parsed)) {
    return {value: parsed, reason: 'redis_value'}
  }

  const envelope = parsed as RedisStoredFlagEnvelope
  if (!('value' in envelope)) {
    return {value: defaultValue, reason: 'redis_missing_value'}
  }

  if ('expiresAt' in envelope) {
    const expiresAt = parseExpiry(envelope.expiresAt)
    if (expiresAt === null) {
      return {value: defaultValue, reason: 'redis_invalid_expiry'}
    }
    if (expiresAt <= now) {
      return {value: defaultValue, reason: 'redis_expired'}
    }
  }

  return {value: envelope.value, reason: 'redis_envelope'}
}
