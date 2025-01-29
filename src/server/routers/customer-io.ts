import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {getAttributes} from '@/lib/customer-io'
import emailIsValid from '@/utils/email-is-valid'
import {getContactId} from '@/lib/users'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {requestContactGuid} from '@/utils/request-contact-guid'

const {TrackClient, RegionUS} = require('customerio-node')
const siteId = process.env.NEXT_PUBLIC_CUSTOMER_IO_SITE_ID
const apiKey = process.env.CUSTOMER_IO_TRACK_API_BASIC
const cio = new TrackClient(siteId, apiKey, {region: RegionUS})
const date = Math.floor(Date.now() * 0.001)

export const customerIORouter = router({
  identify: baseProcedure
    .input(
      z.object({
        email: z.string().optional(),
        id: z.string().optional(),
        selectedInterests: z.record(z.number().optional()),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, selectedInterests} = input
      if (!email || (email && !emailIsValid(email))) return null

      const token = ctx?.userToken || process.env.EGGHEAD_SUPPORT_BOT_TOKEN
      if (!token) return null

      const {contact_id} = await requestContactGuid(email)

      const customer = await getAttributes(contact_id)

      if (customer) {
        await cio.identify(contact_id, {
          ...(!customer?.attributes.signed_up_for_newsletter && {
            signed_up_for_newsletter: date,
          }),
          ...(!customer?.attributes.article_cta_portfolio && {
            article_cta_portfolio: selectedInterests.article_cta_portfolio,
          }),
        })
        return customer
      } else {
        try {
          await cio.identify(email, {
            email,
            id: contact_id,
            ...selectedInterests,
            pro: false,
            created_at: date, // Customer.io uses seconds with their UNIX epoch timestamps
            signed_up_for_newsletter: date,
          })

          return {
            contact_id,
            email,
            selectedInterests,
          }
        } catch (error) {
          console.error('Error identifying customer:', error)
          return null
        }
      }
    }),
})
