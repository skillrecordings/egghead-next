import {NextApiRequest, NextApiResponse} from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Transaction = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const transaction_id = req.query.transaction_id

      if (!transaction_id) throw new Error('no balance transaction id')

      const transaction = await stripe.balanceTransactions.retrieve(
        transaction_id as string,
        {
          expand: ['source.invoice'],
        },
      )

      if (transaction) {
        if (transaction.source?.invoice) {
          const lineItems = transaction.source.invoice.lines.data

          res.status(200).json({transaction, lineItems})
        } else {
          const charge = await stripe.charges.retrieve(transaction.source.id)

          const lineItems = [
            {
              description: charge.description,
              price: {unit_amount: charge.amount},
              quantity: 1,
              amount: charge.amount,
            },
          ]

          res.status(200).json({transaction, lineItems})
        }
      } else {
        res.status(400).end()
      }
    } catch (error) {
      res.status(400).end()
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default Transaction
