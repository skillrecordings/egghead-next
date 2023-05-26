import {router, baseProcedure} from '../trpc.server'
import {z} from 'zod'
import emailIsValid from 'utils/email-is-valid'
import cookieUtil from 'utils/cookies'
import {CIO_IDENTIFIER_KEY} from 'config'

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

export const customerIORouter = router({
  identify: baseProcedure
    .input(
      z.object({
        email: z.string().optional(),
        id: z.string().optional(),
        selectedInterests: z.object({
          article_cta_portfolio: z.number().optional(),
          article_cta_fullStack2023: z.number().optional(),
          article_cta_typescript: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, selectedInterests} = input

      if (!email || (email && !emailIsValid(email))) return null

      try {
        const {customer} = await api.getAttributes(email, IdentifierType.Email)
        console.log(`customer '${email}' exists - updating`)

        if (customer) {
          await cio.identify(`cio_${customer.identifiers.cio_id}`, {
            ...(!customer?.attributes.article_cta_fullStack2023 && {
              article_cta_fullStack2023:
                selectedInterests.article_cta_fullStack2023,
            }),
            ...(!customer?.attributes.article_cta_portfolio && {
              article_cta_portfolio: selectedInterests.article_cta_portfolio,
            }),
            ...(!customer?.attributes.article_cta_typescript && {
              article_cta_typescript: selectedInterests.article_cta_typescript,
            }),
          })
          return customer
        }
      } catch (e) {
        console.log(`customer '${email}' doesn't exist yet`)

        const customer = await cio.identify(email, {
          email,
          ...selectedInterests,
          pro: false,
          created_at: Math.floor(Date.now() * 0.001), // Customer.io uses seconds with their UNIX epoch timestamps
          ...(selectedInterests.article_cta_typescript && {
            typescript_score: 10,
          }),
        })

        // Set cookie for 1 year

        console.log(`customer '${email}' created`)
        return customer
      }

      try {
        const {customer} = await api.getAttributes(email, IdentifierType.Email)

        cookieUtil.set(CIO_IDENTIFIER_KEY, `cio_${customer.identifiers.cio_id}`)
      } catch (e) {
        console.log(`could not set cookie for ${email}`)
      }
    }),
})
