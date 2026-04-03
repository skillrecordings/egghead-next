import {
  getTypesenseNodes,
  resolveTypesenseHostHash,
} from '@/utils/typesense-host'

describe('resolveTypesenseHostHash', () => {
  test('extracts the host hash from a full typesense hostname', () => {
    expect(
      resolveTypesenseHostHash('9umq47iyejnwbps5p-1.a1.typesense.net'),
    ).toBe('9umq47iyejnwbps5p')
  })

  test('returns undefined for an invalid hostname', () => {
    expect(resolveTypesenseHostHash('localhost')).toBeUndefined()
  })
})

describe('getTypesenseNodes', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {...originalEnv}
    delete process.env.NEXT_PUBLIC_TYPESENSE_HOST_HASH
    delete process.env.NEXT_PUBLIC_TYPESENSE_HOST
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('builds fallback nodes from NEXT_PUBLIC_TYPESENSE_HOST when hash is missing', () => {
    process.env.NEXT_PUBLIC_TYPESENSE_HOST =
      '9umq47iyejnwbps5p-1.a1.typesense.net'

    expect(getTypesenseNodes(443)).toEqual([
      {
        host: '9umq47iyejnwbps5p-1.a1.typesense.net',
        port: 443,
        protocol: 'https',
      },
      {
        host: '9umq47iyejnwbps5p-2.a1.typesense.net',
        port: 443,
        protocol: 'https',
      },
      {
        host: '9umq47iyejnwbps5p-3.a1.typesense.net',
        port: 443,
        protocol: 'https',
      },
    ])
  })
})
