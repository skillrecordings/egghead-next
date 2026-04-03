export function resolveTypesenseHostHash(host?: string) {
  if (!host) return undefined

  const match = host.match(/^(.*)-\d+\.a1\.typesense\.net$/)
  return match?.[1]
}

export function getTypesenseNodes(port: number) {
  const hostHash =
    process.env.NEXT_PUBLIC_TYPESENSE_HOST_HASH ??
    resolveTypesenseHostHash(process.env.NEXT_PUBLIC_TYPESENSE_HOST)

  return hostHash
    ? [1, 2, 3].map((index) => ({
        host: `${hostHash}-${index}.a1.typesense.net`,
        port,
        protocol: 'https',
      }))
    : []
}
