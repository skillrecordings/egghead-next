import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {getFeatureFlag, getSaleBannerFeatureFlag} from '@/lib/feature-flags'
import {WorkshopDateAndTimeSchema} from '@/types'

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
  getWorkshopDateAndTime: baseProcedure
    .input(
      z.object({
        flag: z.string(),
      }),
    )
    .query(async ({input, ctx}) => {
      const workshopDateAndTime = await getFeatureFlag(
        input.flag,
        'workshopDateAndTime',
      )

      const parsedDateAndTime =
        WorkshopDateAndTimeSchema.parse(workshopDateAndTime)
      return parsedDateAndTime
    }),
})
