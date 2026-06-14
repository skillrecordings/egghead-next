import {
  MIGRATION_FLAGS_DEFAULTS,
  normalizeAuthLane,
  normalizeCurrentUserShadow,
  readRedisStoredFlagValue,
} from './migration-flags-core'

describe('migration flag core', () => {
  it('defaults unknown auth lanes to Rails behavior', () => {
    expect(normalizeAuthLane('shadow')).toBe('shadow')
    expect(normalizeAuthLane('surprise')).toBe('rails')
    expect(normalizeAuthLane(undefined)).toBe('rails')
  })

  it('only enables current-user shadow from a boolean true value', () => {
    expect(normalizeCurrentUserShadow(true)).toBe(true)
    expect(normalizeCurrentUserShadow('true')).toBe(false)
    expect(normalizeCurrentUserShadow(undefined)).toBe(false)
  })

  it('reads Redis raw values and JSON envelopes', () => {
    expect(
      readRedisStoredFlagValue({
        raw: '"shadow"',
        defaultValue: MIGRATION_FLAGS_DEFAULTS.authLane,
      }),
    ).toEqual({value: 'shadow', reason: 'redis_value'})

    expect(
      readRedisStoredFlagValue({
        raw: JSON.stringify({value: true, expiresAt: Date.now() + 1000}),
        defaultValue: false,
      }).value,
    ).toBe(true)
  })

  it('returns the safe default for expired Redis envelopes', () => {
    expect(
      readRedisStoredFlagValue({
        raw: {value: 'authjs', expiresAt: 1000},
        defaultValue: MIGRATION_FLAGS_DEFAULTS.authLane,
        now: 2000,
      }),
    ).toEqual({value: 'rails', reason: 'redis_expired'})
  })

  it('returns the safe default for invalid Redis envelopes', () => {
    expect(
      readRedisStoredFlagValue({
        raw: {value: 'authjs', expiresAt: 'not-a-date'},
        defaultValue: MIGRATION_FLAGS_DEFAULTS.authLane,
      }),
    ).toEqual({value: 'rails', reason: 'redis_invalid_expiry'})

    expect(
      readRedisStoredFlagValue({
        raw: {enabled: true},
        defaultValue: false,
      }),
    ).toEqual({value: false, reason: 'redis_missing_value'})
  })
})
