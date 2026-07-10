/**
 * Feature flags whose Stripe products receive the live-workshop purchase email.
 *
 * Add a workshop sale flag here when its Edge Config `workshop` value should be
 * recognized by the post-checkout receipt flow.
 */
export const LIVE_WORKSHOP_SALE_FLAGS = [
  'featureFlagCursorWorkshopSale',
  'featureFlagClaudeCodeWorkshopSale',
  'featureFlagCodexWorkshopSale',
  'featureFlagSoftwareFactoryWorkshopSale',
] as const
