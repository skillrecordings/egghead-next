import {NextApiRequest, NextApiResponse} from 'next'
import {withPagesApiLogging} from '@/lib/logging'
import {z} from 'zod'
import {inngest} from '@/inngest/inngest.server'
import {CUSTOMER_IO_IDENTIFY_EVENT} from '@/inngest/events/identify-customer-io'
import emailIsValid from '@/utils/email-is-valid'
import {drovrSignupsEnabled} from '@/lib/drovr-signup'
import {verifyShieldShiba} from '@/lib/shield-shiba'

const subscribeRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().default('newsletter_signup'),
  shieldToken: z.string().optional(),
  page: z.string().url().optional(),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed',
    })
  }

  try {
    console.log('INFO: Newsletter subscription API request received')

    // Validate request body
    const validationResult = subscribeRequestSchema.safeParse(req.body)

    if (!validationResult.success) {
      console.error(
        'ERROR: Newsletter subscription validation failed:',
        validationResult.error,
      )
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid request data',
        details: validationResult.error.issues,
      })
    }

    const {email, name, source, shieldToken, page} = validationResult.data

    // Double-check email validity
    if (!emailIsValid(email)) {
      console.error(`ERROR: Invalid email format: ${email}`)
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
      })
    }

    console.log(`INFO: Processing newsletter subscription for email: ${email}`)

    // Prepare Customer.io attributes
    const currentDateTime = Math.floor(Date.now() * 0.001) // Customer.io uses seconds
    const selectedInterests = {
      ai_dev_essentials_newsletter: currentDateTime,
      newsletter_signup_source: source,
    }

    if (!process.env.EGGHEAD_SUPPORT_BOT_TOKEN) {
      return res.status(500).json({
        error: 'Subscription failed',
        message: 'Internal server error',
      })
    }

    const screening = drovrSignupsEnabled()
      ? await verifyShieldShiba({token: shieldToken, email})
      : null

    // Send to Customer.io via Inngest
    await inngest.send({
      name: CUSTOMER_IO_IDENTIFY_EVENT,
      data: {
        email,
        selectedInterests,
        userToken: process.env.EGGHEAD_SUPPORT_BOT_TOKEN,
        ...(name && {first_name: name}),
        ...(page && {page}),
        ...(screening && {screening}),
      },
    })

    console.log(
      `INFO: Newsletter subscription successful for email: ${email}, source: ${source}`,
    )

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      email,
      timestamp: currentDateTime,
    })
  } catch (error) {
    console.error('ERROR: Newsletter subscription API error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'

    return res.status(500).json({
      error: 'Subscription failed',
      message: errorMessage,
    })
  }
}

export default withPagesApiLogging(handler)
