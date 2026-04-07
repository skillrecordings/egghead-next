import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {getFeatureFlag, getSaleBannerFeatureFlag} from '@/lib/feature-flags'
import {LiveWorkshopSchema} from '@/types'
import {getHeaderBannerData} from '@/server/header-banners'

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

    return getHeaderBannerData(logContext)
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
