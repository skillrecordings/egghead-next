import {getFeatureFlag, getSaleBannerFeatureFlag} from '@/lib/feature-flags'
import {type LogContext} from '@/utils/structured-log'
import {LiveWorkshopSchema} from '@/types'
import type {HeaderBannerData} from '@/components/app/header/banner-data'

export async function getHeaderBannerData(
  logContext: LogContext = {},
): Promise<HeaderBannerData> {
  const [
    lifetimeSaleEnabled,
    cursorWorkshopSaleEnabled,
    claudeCodeWorkshopSaleEnabled,
    cursorWorkshopEarlyBirdEnabled,
  ] = await Promise.all([
    getSaleBannerFeatureFlag(
      'featureFlagLifetimeSale',
      'saleBanner',
      logContext,
    ),
    getSaleBannerFeatureFlag(
      'featureFlagCursorWorkshopSale',
      'saleBanner',
      logContext,
    ),
    getSaleBannerFeatureFlag(
      'featureFlagClaudeCodeWorkshopSale',
      'saleBanner',
      logContext,
    ),
    getSaleBannerFeatureFlag(
      'featureFlagCursorWorkshopSale',
      'earlyBirdBanner',
      logContext,
    ),
  ])

  const [cursorWorkshopRaw, claudeCodeWorkshopRaw] = await Promise.all([
    cursorWorkshopSaleEnabled || cursorWorkshopEarlyBirdEnabled
      ? getFeatureFlag('featureFlagCursorWorkshopSale', 'workshop', logContext)
      : Promise.resolve(undefined),
    claudeCodeWorkshopSaleEnabled
      ? getFeatureFlag(
          'featureFlagClaudeCodeWorkshopSale',
          'workshop',
          logContext,
        )
      : Promise.resolve(undefined),
  ])

  const parsedCursorWorkshop = cursorWorkshopRaw
    ? LiveWorkshopSchema.safeParse(cursorWorkshopRaw)
    : {success: true as const, data: undefined}
  const parsedClaudeWorkshop = claudeCodeWorkshopRaw
    ? LiveWorkshopSchema.safeParse(claudeCodeWorkshopRaw)
    : {success: true as const, data: undefined}

  return {
    lifetimeSaleEnabled: Boolean(lifetimeSaleEnabled),
    cursorWorkshopSaleEnabled: Boolean(cursorWorkshopSaleEnabled),
    claudeCodeWorkshopSaleEnabled: Boolean(claudeCodeWorkshopSaleEnabled),
    cursorWorkshopEarlyBirdEnabled: Boolean(cursorWorkshopEarlyBirdEnabled),
    cursorWorkshop: parsedCursorWorkshop.success
      ? parsedCursorWorkshop.data ?? null
      : null,
    claudeCodeWorkshop: parsedClaudeWorkshop.success
      ? parsedClaudeWorkshop.data ?? null
      : null,
  }
}
