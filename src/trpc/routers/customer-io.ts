import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'

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

      console.log('INPUT', input)

      if (!email && !id) return null

      console.log('SELECTED', selectedInterests)

      if (!id) {
        const customer = await cio.identify(email, {
          email,
          ...selectedInterests,
          pro: false,
          created_at: Math.floor(Date.now() * 0.001), // Customer.io uses seconds with their UNIX epoch timestamps
        })

        console.log('trackClient', cio)
        console.log('customer', customer)
      } else {
        const customer = await cio.identify(id, {
          email,
          ...selectedInterests,
        })

        console.log('trackClient', cio)
        console.log('customer', customer)
      }
    }),
})
