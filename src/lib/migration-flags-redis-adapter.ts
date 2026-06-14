import type {Adapter} from 'flags'
import {getRedis} from '@/lib/upstash-redis'
import {readRedisStoredFlagValue} from '@/lib/migration-flags-core'

type RedisLike = {
  get<T = unknown>(key: string): Promise<T | null>
}

type CreateRedisMigrationFlagAdapterOptions = {
  redis?: RedisLike | null
  keyPrefix?: string
  now?: () => number
}

const DEFAULT_REDIS_PREFIX = 'egghead:migration-flags'
const adapterId = Symbol.for('egghead.migration-flags.redis')

function getRedisPrefix(keyPrefix?: string) {
  return (
    keyPrefix ||
    process.env.EGGHEAD_MIGRATION_FLAGS_REDIS_PREFIX ||
    DEFAULT_REDIS_PREFIX
  )
}

export function getRedisMigrationFlagKey(key: string, keyPrefix?: string) {
  return `${getRedisPrefix(keyPrefix)}:${key}`
}

export function createRedisMigrationFlagAdapter({
  redis,
  keyPrefix,
  now = () => Date.now(),
}: CreateRedisMigrationFlagAdapterOptions = {}) {
  return function redisMigrationFlagAdapter<ValueType, EntitiesType>(): Adapter<
    ValueType,
    EntitiesType
  > {
    return {
      adapterId,
      origin(key) {
        return {
          provider: 'egghead-redis-migration-flags',
          key,
          keyPrefix: getRedisPrefix(keyPrefix),
        }
      },
      async decide({key, defaultValue}) {
        const client = redis === undefined ? getRedis() : redis
        if (!client) return defaultValue as ValueType

        const raw = await client.get(getRedisMigrationFlagKey(key, keyPrefix))
        const result = readRedisStoredFlagValue({
          raw,
          defaultValue,
          now: now(),
        })

        return result.value as ValueType
      },
      async bulkDecide({flags}) {
        const client = redis === undefined ? getRedis() : redis
        if (!client) {
          return Object.fromEntries(
            flags.map(({key, defaultValue}) => [key, defaultValue]),
          ) as Record<string, ValueType>
        }

        const entries = await Promise.all(
          flags.map(async ({key, defaultValue}) => {
            const raw = await client.get(
              getRedisMigrationFlagKey(key, keyPrefix),
            )
            const result = readRedisStoredFlagValue({
              raw,
              defaultValue,
              now: now(),
            })

            return [key, result.value] as const
          }),
        )

        return Object.fromEntries(entries) as Record<string, ValueType>
      },
    }
  }
}
