import {createClient} from '@vercel/edge-config'

interface FeatureFlags {
  allowedRoles: string[]
}

// We use prefixes to avoid mixing up the flags with other Edge Config values
const prefixKey = (prefix: string, key: string) => `${prefix}_${key}`

export async function getDraftFeatureFlag(key: keyof FeatureFlags) {
  const prefixedKey = prefixKey('featureFlagDraftCourse', key)
  const edgeConfig = createClient(process.env.DRAFT_COURSE_EDGE_CONFIG)
  const featureFlag = await edgeConfig.get<FeatureFlags>(prefixedKey)

  return featureFlag
}
