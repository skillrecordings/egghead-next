import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {getFeatureFlag, getSaleBannerFeatureFlag} from '@/lib/feature-flags'
import {LiveWorkshopSchema} from '@/types'

export const featureFlagRouter = router({
  headerBanners: baseProcedure.query(async ({ctx}) => {
    const requestId =
      ctx?.req?.headers?.get('x-egghead-request-id') ??
      ctx?.req?.headers?.get('x-vercel-id') ??
      undefined

    const logContext = {
      request_id: requestId,
      route: 'trpc.featureFlag.headerBanners',
    }

    const [
      lifetimeSaleEnabled,
      cursorWorkshopSaleEnabled,
      claudeCodeWorkshopSaleEnabled,
      cursorWorkshopEarlyBirdEnabled,
      cursorWorkshopRaw,
      claudeCodeWorkshopRaw,
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
      getFeatureFlag('featureFlagCursorWorkshopSale', 'workshop', logContext),
      getFeatureFlag(
        'featureFlagClaudeCodeWorkshopSale',
        'workshop',
        logContext,
      ),
    ])

    const parsedCursorWorkshop = LiveWorkshopSchema.safeParse(cursorWorkshopRaw)
    const parsedClaudeWorkshop = LiveWorkshopSchema.safeParse(
      claudeCodeWorkshopRaw,
    )

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
  }),
  isLiveWorkshopSale: baseProcedure
    .input(
      z.object({
        flag: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      return getSaleBannerFeatureFlag(input.flag, 'saleBanner')
    }),
  isEarlyBirdWorkshopSale: baseProcedure
    .input(
      z.object({
        flag: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      return getSaleBannerFeatureFlag(input.flag, 'earlyBirdBanner')
    }),
  getLiveWorkshop: baseProcedure
    .input(
      z.object({
        flag: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const workshop = await getFeatureFlag(input.flag, 'workshop')

      const parsedWorkshop = LiveWorkshopSchema.parse(workshop)
      return parsedWorkshop
    }),
})
