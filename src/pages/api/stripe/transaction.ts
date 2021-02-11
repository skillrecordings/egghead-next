import {NextApiRequest, NextApiResponse} from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Transaction = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('REQUEST')
  if (req.method === 'GET') {
    try {
      const transaction_id = req.query.transaction_id

      if (!transaction_id) throw new Error('no balance transaction id')

      const transaction = await stripe.balanceTransactions.retrieve(
        transaction_id,
        {
          expand: ['source.invoice'],
        },
      )

      if (transaction) {
        res
          .status(200)
          .json({transaction, lineItems: transaction.source.invoice.lines.data})
      } else {
        res.status(400).end()
      }
    } catch (error) {
      console.error(JSON.stringify(error))
      res.end(error)
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default Transaction
