const {RegionUS, APIClient} = require('customerio-node')
const appApiKey = process.env.CUSTOMER_IO_APPLICATION_API_KEY
const api = new APIClient(appApiKey, {region: RegionUS})

export const getAttributes = async (user_contact: string) => {
  try {
    const {customer} = await api.getAttributes(user_contact)
    return customer
  } catch {
    return null
  }
}

export const ENCODED_CUSTOMER_IO_TRACKING_API_CREDENTIALS = Buffer.from(
  `${process.env.NEXT_PUBLIC_CUSTOMER_IO_SITE_ID}:${process.env.CUSTOMER_IO_TRACK_API_BASIC}` ||
    '',
).toString('base64')
