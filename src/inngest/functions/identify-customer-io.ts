import {inngest} from '../inngest.server'
import {CUSTOMER_IO_IDENTIFY_EVENT} from '../events/identify-customer-io'
import {getAttributes} from '@/lib/customer-io'
import emailIsValid from '@/utils/email-is-valid'
import {requestContactGuid} from '@/utils/request-contact-guid'
import {TrackClient, RegionUS} from 'customerio-node'

const siteId = process.env.NEXT_PUBLIC_CUSTOMER_IO_SITE_ID!
const apiKey = process.env.CUSTOMER_IO_TRACK_API_BASIC!
const cio = new TrackClient(siteId, apiKey, {region: RegionUS})

export const identifyCustomerIo = inngest.createFunction(
  {id: 'identify-customer-io-user', name: 'Identify Customer IO User'},
  {event: CUSTOMER_IO_IDENTIFY_EVENT},
  async ({event, step}) => {
    const {email, selectedInterests, userToken} = event.data
    const date = Math.floor(Date.now() * 0.001)

    if (!email || (email && !emailIsValid(email))) {
      return null
    }

    const token = userToken || process.env.EGGHEAD_SUPPORT_BOT_TOKEN
    if (!token) return null

    const {contact_id} = await step.run('get_contact_id', async () => {
      return requestContactGuid(email)
    })

    const customer = await step.run('get_customer_attributes', async () => {
      return getAttributes(contact_id)
    })

    if (customer) {
      await step.run('update_existing_customer', async () => {
        await cio.identify(contact_id, {
          ...(!customer?.attributes.signed_up_for_newsletter && {
            signed_up_for_newsletter: date,
          }),
          ...(!customer?.attributes.article_cta_portfolio && {
            article_cta_portfolio: selectedInterests.article_cta_portfolio,
          }),
        })
      })
    } else {
      try {
        await step.run('create_new_customer', async () => {
          await cio.identify(email, {
            email,
            id: contact_id,
            ...selectedInterests,
            pro: false,
            created_at: date,
            signed_up_for_newsletter: date,
          })
        })
      } catch (error) {
        console.error('Error identifying customer:', error)
        return null
      }
    }
    await step.sleep('wait_for_customer_to_be_created', 5000)

    await step.run('get_latest_customer', async () => {
      return getAttributes(contact_id)
    })

    return {
      contact_id,
      email,
      selectedInterests,
    }
  },
)
