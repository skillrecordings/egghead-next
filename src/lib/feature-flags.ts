import {createClient} from '@vercel/edge-config'

interface FeatureFlags {
  allowedRoles?: string[]
  saleBanner?: string[]
}

// We use prefixes to avoid mixing up the flags with other Edge Config values
const prefixKey = (prefix: string, key: string) => `${prefix}_${key}`

export async function getDraftFeatureFlag(
  prefix: string,
  key: keyof FeatureFlags,
) {
  if (!process.env.FEATURE_FLAGS_EDGE_CONFIG) return false
  const prefixedKey = prefixKey(prefix, key)
  const edgeConfig = createClient(process.env.FEATURE_FLAGS_EDGE_CONFIG)
  const featureFlag = await edgeConfig.get<FeatureFlags>(prefixedKey)

  return featureFlag
}

export async function getSaleBannerFeatureFlag(
  prefix: string,
  key: keyof FeatureFlags,
) {
  if (!process.env.FEATURE_FLAGS_EDGE_CONFIG) return false
  const prefixedKey = prefixKey(prefix, key)
  const edgeConfig = createClient(process.env.FEATURE_FLAGS_EDGE_CONFIG)

  const featureFlag = await edgeConfig.get<boolean>(prefixedKey)

  return featureFlag
}
