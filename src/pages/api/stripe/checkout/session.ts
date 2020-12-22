import {NextApiRequest, NextApiResponse} from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const StripeCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    try {
      if (!req.query.session_id) throw new Error('no session id')
      const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id,
        {expand: ['customer']},
      )
      if (!session)
        throw new Error(`no session loaded for ${req.query.session_id}`)

      res.status(200).json({
        email: session.customer.email,
        amount: session.amount_total / 100,
        status: session.payment_status,
      })
    } catch (error) {
      console.error(JSON.stringify(error))
      res.end()
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default StripeCheckoutSession
