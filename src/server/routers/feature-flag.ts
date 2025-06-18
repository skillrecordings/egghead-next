import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {getFeatureFlag, getSaleBannerFeatureFlag} from '@/lib/feature-flags'
import {LiveWorkshopSchema} from '@/types'

export const featureFlagRouter = router({
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
