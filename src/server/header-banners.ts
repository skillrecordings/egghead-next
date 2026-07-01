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
    codexWorkshopSaleEnabled,
    softwareFactoryWorkshopSaleEnabled,
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
      'featureFlagCodexWorkshopSale',
      'saleBanner',
      logContext,
    ),
    getSaleBannerFeatureFlag(
      'featureFlagSoftwareFactoryWorkshopSale',
      'saleBanner',
      logContext,
    ),
    getSaleBannerFeatureFlag(
      'featureFlagCursorWorkshopSale',
      'earlyBirdBanner',
      logContext,
    ),
  ])

  const [
    cursorWorkshopRaw,
    claudeCodeWorkshopRaw,
    codexWorkshopRaw,
    softwareFactoryWorkshopRaw,
  ] = await Promise.all([
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
    codexWorkshopSaleEnabled
      ? getFeatureFlag('featureFlagCodexWorkshopSale', 'workshop', logContext)
      : Promise.resolve(undefined),
    softwareFactoryWorkshopSaleEnabled
      ? getFeatureFlag(
          'featureFlagSoftwareFactoryWorkshopSale',
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
  const parsedCodexWorkshop = codexWorkshopRaw
    ? LiveWorkshopSchema.safeParse(codexWorkshopRaw)
    : {success: true as const, data: undefined}
  const parsedSoftwareFactoryWorkshop = softwareFactoryWorkshopRaw
    ? LiveWorkshopSchema.safeParse(softwareFactoryWorkshopRaw)
    : {success: true as const, data: undefined}

  return {
    lifetimeSaleEnabled: Boolean(lifetimeSaleEnabled),
    cursorWorkshopSaleEnabled: Boolean(cursorWorkshopSaleEnabled),
    claudeCodeWorkshopSaleEnabled: Boolean(claudeCodeWorkshopSaleEnabled),
    codexWorkshopSaleEnabled: Boolean(codexWorkshopSaleEnabled),
    softwareFactoryWorkshopSaleEnabled: Boolean(
      softwareFactoryWorkshopSaleEnabled,
    ),
    cursorWorkshopEarlyBirdEnabled: Boolean(cursorWorkshopEarlyBirdEnabled),
    cursorWorkshop: parsedCursorWorkshop.success
      ? parsedCursorWorkshop.data ?? null
      : null,
    claudeCodeWorkshop: parsedClaudeWorkshop.success
      ? parsedClaudeWorkshop.data ?? null
      : null,
    codexWorkshop: parsedCodexWorkshop.success
      ? parsedCodexWorkshop.data ?? null
      : null,
    softwareFactoryWorkshop: parsedSoftwareFactoryWorkshop.success
      ? parsedSoftwareFactoryWorkshop.data ?? null
      : null,
  }
}
