import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import emailIsValid from 'utils/email-is-valid'
import cookieUtil from 'utils/cookies'
import {CIO_IDENTIFIER_KEY} from 'config'
import {findOrCreateUser} from 'lib/users'

const {
  TrackClient,
  RegionUS,
  IdentifierType,
  APIClient,
} = require('customerio-node')
const siteId = process.env.CUSTOMER_IO_SITE_ID
const apiKey = process.env.CUSTOMER_IO_TRACK_API_BASIC
const appApiKey = process.env.CUSTOMER_IO_APPLICATION_API_KEY

const cio = new TrackClient(siteId, apiKey, {region: RegionUS})
const api = new APIClient(appApiKey, {region: RegionUS})
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

      const user_guid = findOrCreateUser(email)

      try {
        const {customer} = await api.getAttributes(email, IdentifierType.Email)
        console.log(`customer '${email}' exists - updating`)

        if (customer) {
          await cio.identify(`cio_${customer.identifiers.cio_id}`, {
            signed_up_for_newsletter: date,
            ...(!customer?.attributes.article_cta_portfolio && {
              article_cta_portfolio: selectedInterests.article_cta_portfolio,
            }),
          })
          return customer
        }
      } catch (e) {
        console.log(`customer '${email}' doesn't exist yet`)

        await cio.identify(email, {
          email,
          id: user_guid,
          ...selectedInterests,
          pro: false,
          created_at: date, // Customer.io uses seconds with their UNIX epoch timestamps
          signed_up_for_newsletter: date,
        })

        console.log(`customer '${email}' created`)
        try {
          const {customer} = await api.getAttributes(
            email,
            IdentifierType.Email,
          )

          cookieUtil.set(
            CIO_IDENTIFIER_KEY,
            `cio_${customer.identifiers.cio_id}`,
          )
          console.log(`cookie set for ${email}`)
        } catch (e) {
          console.log(`could not set cookie for ${email}`)
        }
      }
    }),
})
