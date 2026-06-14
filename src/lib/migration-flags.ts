import {createHash} from 'crypto'
import type {IncomingMessage} from 'http'
import {
  getProviderData as getVercelProviderData,
  vercelAdapter,
} from '@flags-sdk/vercel'
import type {ApiData, ProviderData} from 'flags'
import {
  evaluate,
  flag,
  getProviderData as getCodeProviderData,
} from 'flags/next'
import {EGGHEAD_USER_COOKIE_KEY} from '@/config'
import {
  MIGRATION_AUTH_LANES,
  MIGRATION_FLAG_KEYS,
  MIGRATION_FLAGS_DEFAULTS,
  type MigrationFlagBackend,
  type MigrationFlagValues,
  normalizeMigrationFlagValues,
} from '@/lib/migration-flags-core'
import {createRedisMigrationFlagAdapter} from '@/lib/migration-flags-redis-adapter'
import {logEvent, type LogContext} from '@/utils/structured-log'

type MigrationFlagEntities = {
  user?: {id: string}
  cohort?: {id: string}
  environment?: {id: string}
}

type PagesRouterRequest = IncomingMessage & {
  cookies?: Partial<Record<string, string>>
}

type FlagsPagesRouterRequest = IncomingMessage & {
  cookies: Partial<Record<string, string>>
}

function toFlagsPagesRouterRequest(
  req: PagesRouterRequest,
): FlagsPagesRouterRequest {
  return Object.assign(req, {cookies: req.cookies ?? {}})
}

function hashStableIdentifier(value: string) {
  return createHash('sha256')
    .update(`egghead-migration:${value}`)
    .digest('hex')
    .slice(0, 24)
}

function parseEggheadUserCookie(value: string | undefined) {
  if (!value) return undefined

  try {
    const parsed = JSON.parse(decodeURIComponent(value))
    const id = parsed?.id
    if (typeof id === 'number' || typeof id === 'string') {
      return hashStableIdentifier(String(id))
    }
  } catch {
    return undefined
  }

  return undefined
}

function identifyMigrationFlagContext({
  headers,
  cookies,
}: {
  headers: Headers
  cookies: {get(name: string): {value: string} | undefined}
}): MigrationFlagEntities {
  const cohort =
    headers.get('x-egghead-migration-cohort') ||
    process.env.EGGHEAD_MIGRATION_FLAGS_DEFAULT_COHORT ||
    'staff'
  const hashedUserId = parseEggheadUserCookie(
    cookies.get(EGGHEAD_USER_COOKIE_KEY)?.value,
  )

  return {
    user: hashedUserId ? {id: hashedUserId} : undefined,
    cohort: {id: cohort},
    environment: {id: process.env.VERCEL_ENV || 'local'},
  }
}

const vercelFlags = {
  authLane: flag<string, MigrationFlagEntities>({
    key: MIGRATION_FLAG_KEYS.authLane,
    adapter: vercelAdapter<string, MigrationFlagEntities>(),
    identify: identifyMigrationFlagContext,
    defaultValue: MIGRATION_FLAGS_DEFAULTS.authLane,
    description:
      'Migration auth lane for egghead-next: rails, shadow, authjs, or off.',
    options: MIGRATION_AUTH_LANES.map((value) => ({value, label: value})),
  }),
  currentUserShadow: flag<boolean, MigrationFlagEntities>({
    key: MIGRATION_FLAG_KEYS.currentUserShadow,
    adapter: vercelAdapter<boolean, MigrationFlagEntities>(),
    identify: identifyMigrationFlagContext,
    defaultValue: MIGRATION_FLAGS_DEFAULTS.currentUserShadow,
    description:
      'Fetch Auth.js/CourseBuilder current-user in shadow while returning Rails behavior.',
    options: [
      {value: false, label: 'off'},
      {value: true, label: 'on'},
    ],
  }),
}

const redisAdapter = createRedisMigrationFlagAdapter()

const redisFlags = {
  authLane: flag<string, MigrationFlagEntities>({
    key: MIGRATION_FLAG_KEYS.authLane,
    adapter: redisAdapter<string, MigrationFlagEntities>(),
    identify: identifyMigrationFlagContext,
    defaultValue: MIGRATION_FLAGS_DEFAULTS.authLane,
    description: 'Redis-backed migration auth lane proof for egghead-next.',
    options: MIGRATION_AUTH_LANES.map((value) => ({value, label: value})),
  }),
  currentUserShadow: flag<boolean, MigrationFlagEntities>({
    key: MIGRATION_FLAG_KEYS.currentUserShadow,
    adapter: redisAdapter<boolean, MigrationFlagEntities>(),
    identify: identifyMigrationFlagContext,
    defaultValue: MIGRATION_FLAGS_DEFAULTS.currentUserShadow,
    description: 'Redis-backed current-user shadow proof for egghead-next.',
    options: [
      {value: false, label: 'off'},
      {value: true, label: 'on'},
    ],
  }),
}

export const migrationFlagDefinitions = vercelFlags

function flagsForBackend(backend: MigrationFlagBackend) {
  return backend === 'redis' ? redisFlags : vercelFlags
}

export async function resolveMigrationFlags(
  req: PagesRouterRequest,
  {
    backend = 'vercel',
    logContext = {},
  }: {
    backend?: MigrationFlagBackend
    logContext?: LogContext
  } = {},
): Promise<{
  backend: MigrationFlagBackend
  values: MigrationFlagValues
}> {
  const rawValues = await evaluate(
    flagsForBackend(backend),
    toFlagsPagesRouterRequest(req),
  )
  const values = normalizeMigrationFlagValues(rawValues)

  logEvent(
    'info',
    'migration_flags.resolve',
    {
      backend,
      auth_lane: values.authLane,
      current_user_shadow: values.currentUserShadow,
    },
    logContext,
  )

  return {backend, values}
}

export async function getMigrationFlagProviderData(): Promise<ApiData> {
  let providerData: ProviderData

  try {
    providerData = await getVercelProviderData(migrationFlagDefinitions)
  } catch {
    providerData = getCodeProviderData(migrationFlagDefinitions)
    providerData.hints.push({
      key: 'egghead-migration-flags-provider',
      text: 'Vercel Flags provider data was unavailable; serving code-defined migration flags.',
    })
  }

  return {
    ...providerData,
    overrideEncryptionMode: 'encrypted',
  }
}
