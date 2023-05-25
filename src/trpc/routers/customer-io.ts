import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import emailIsValid from 'utils/email-is-valid'

const {TrackClient, RegionUS} = require('customerio-node')
const siteId = process.env.CUSTOMER_IO_SITE_ID
const apiKey = process.env.CUSTOMER_IO_TRACK_API_BASIC

const cio = new TrackClient(siteId, apiKey, {region: RegionUS})

export const customerIORouter = router({
  identify: baseProcedure
    .input(
      z.object({
        email: z.string().optional(),
        id: z.string().optional(),
        selectedInterests: z.object({
          portfolio: z.number().optional(),
          fullStack2023: z.number().optional(),
          typescript: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, id, selectedInterests} = input

      if (!email && !id) return null
      if (email && !emailIsValid(email)) return null

      if (!id) {
        await cio.identify(email, {
          email,
          ...selectedInterests,
          pro: false,
          created_at: Math.floor(Date.now() * 0.001), // Customer.io uses seconds with their UNIX epoch timestamps
          ...(selectedInterests.typescript && {typescript_score: 10}),
        })
      } else {
        await cio.identify(id, {
          email,
          ...selectedInterests,
          created_at: Math.floor(Date.now() * 0.001),
        })
      }
    }),
})
