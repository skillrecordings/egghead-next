import {cookies} from 'next/headers'
import {pgQuery} from '@/db'
import {stripeAdapter} from '@/adapters/stripe-adapter'
import {z} from 'zod'

/**
 * this will only work in App router
 * @param email
 */
export async function getLastChargeForActiveSubscription(email?: string) {
  const allCookies = cookies()
  const authToken = allCookies.get('eh_token_2020_11_22')

  const eggheadUser = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current?minimal=true`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  ).then((res) => res.json())

  const queryResult = await pgQuery(`
    select account_subscriptions.stripe_subscription_id as stripeSubscriptionId,
           accounts.stripe_customer_id as stripeCustomerId,
           users.email, 
           users.id as userId, 
           accounts.id as accountId 
    from users
    join account_users ON account_users.user_id = users.id
    join accounts on accounts.id = account_users.account_id
    join account_subscriptions on accounts.id = account_subscriptions.account_id
    where (users.email = lower(${email}) OR users.id = ${eggheadUser.id}) AND account_subscriptions.status = 'active'
    LIMIT 1`)

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
        stripeSubscriptionId: z.string(),
        stripeCustomerId: z.string(),
        email: z.string(),
        userId: z.number(),
        accountId: z.number(),
      })
      .safeParse(queryResult.rows[0])

    if (!parsedResult.success) {
      return noAccount
    }

    const {stripeSubscriptionId, stripeCustomerId, email, userId, accountId} =
      parsedResult.data

    const subscription = await stripeAdapter.getSubscription(
      stripeSubscriptionId,
    )

    amountPaid = Number(subscription.latest_invoice.charge.amount) / 100
    return {
      stripeSubscriptionId,
      stripeCustomerId,
      email,
      userId,
      accountId,
      amountPaid,
    }
  }

  return noAccount
}
