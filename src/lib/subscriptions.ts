import {pgQuery} from '@/db'
import {stripeAdapter} from '@/adapters/stripe-adapter'
import {z} from 'zod'

/**
 * this will only work in Pages router
 * @param email
 */
export async function getLastChargeForActiveSubscription(
  email?: string,
  authToken?: string,
) {
  const eggheadUser = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current?minimal=true`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log('err', err)
      return null
    })

  const queryResult = await pgQuery(`
    select account_subscriptions.stripe_subscription_id as stripe_subscription_id,
           accounts.stripe_customer_id as stripe_customer_id,
           users.email, 
           users.id as user_id, 
           accounts.id as account_id 
    from users
    join account_users ON account_users.user_id = users.id
    join accounts on accounts.id = account_users.account_id
    join account_subscriptions on accounts.id = account_subscriptions.account_id
    where (users.email = lower('${email}') ${
    eggheadUser?.id ? `OR users.id = ${eggheadUser?.id}` : ''
  }) 
    and account_subscriptions.status = 'active'
    and account_subscriptions.stripe_subscription_id not like '%sub_gift_not_in_stripe%'
    limit 1`)

  let amountPaid = 0

  const noAccount = {
    amountPaid,
    stripeSubscriptionId: null,
    stripeCustomerId: null,
    email,
    userId: null,
    accountId: null,
  }

  if (queryResult.rows.length === 1) {
    const parsedResult = z
      .object({
        stripe_subscription_id: z.string(),
        stripe_customer_id: z.string(),
        email: z.string(),
        user_id: z.number(),
        account_id: z.string(),
      })
      .safeParse(queryResult.rows[0])

    if (!parsedResult.success) {
      return noAccount
    }

    console.log('parsedResult.data', parsedResult.data)

    const {
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: stripeCustomerId,
      email,
      user_id: userId,
      account_id: accountId,
    } = parsedResult.data

    console.log('stripeSubscriptionId', stripeSubscriptionId)

    const subscription = await stripeAdapter.getSubscription(
      stripeSubscriptionId,
    )

    console.log('subscription', subscription)

    amountPaid = Number(subscription.latest_invoice.charge.amount) / 100

    console.log('amountPaid', amountPaid)

    return {
      stripeSubscriptionId,
      stripeCustomerId,
      email,
      userId: String(userId),
      accountId: accountId,
      amountPaid,
    }
  }

  return noAccount
}
