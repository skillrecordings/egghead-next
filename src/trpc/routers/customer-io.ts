import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import {getAttributes} from 'lib/customer-io'
import emailIsValid from 'utils/email-is-valid'
import {getContactId} from 'lib/users'
import {ACCESS_TOKEN_KEY} from 'utils/auth'

const {TrackClient, RegionUS} = require('customerio-node')
const siteId = process.env.CUSTOMER_IO_SITE_ID
const apiKey = process.env.CUSTOMER_IO_TRACK_API_BASIC
const cio = new TrackClient(siteId, apiKey, {region: RegionUS})
const date = Math.floor(Date.now() * 0.001)

export const customerIORouter = router({
  identify: baseProcedure
    .input(
      z.object({
        email: z.string().optional(),
        id: z.string().optional(),
        selectedInterests: z.object({
          article_cta_portfolio: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, selectedInterests} = input
      if (!email || (email && !emailIsValid(email))) return null

      console.log('email', email)
      const token =
        ctx.req?.cookies[ACCESS_TOKEN_KEY] ||
        process.env.EGGHEAD_SUPPORT_BOT_TOKEN
      console.log('token', token)
      if (!token) return null

      const user_contact = await getContactId({token, email})
      console.log('user_contact', user_contact)

      const customer = await getAttributes(user_contact)

      if (customer) {
        await cio.identify(user_contact, {
          ...(!customer?.attributes.signed_up_for_newsletter && {
            signed_up_for_newsletter: date,
          }),
          ...(!customer?.attributes.article_cta_portfolio && {
            article_cta_portfolio: selectedInterests.article_cta_portfolio,
          }),
        })
        return customer
      } else {
        console.log(`customer '${email}' doesn't exist yet`)

        await cio.identify(user_contact, {
          email,
          id: user_contact,
          ...selectedInterests,
          pro: false,
          created_at: date, // Customer.io uses seconds with their UNIX epoch timestamps
          signed_up_for_newsletter: date,
        })

        console.log(`customer '${email}' created`)
      }
    }),
})
