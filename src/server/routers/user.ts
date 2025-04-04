import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {getContactId, loadCurrentUser, loadUserAccounts} from '../../lib/users'
import {getGraphQLClient} from '@/utils/configured-graphql-client'
import {gql} from 'graphql-request'

const transactionsSchema = z.array(
  z.object({
    stripe_transaction_id: z.string(),
    amount: z.number(),
    created_at: z.string(),
  }),
)

export const userRouter = router({
  current: baseProcedure.query(async ({input, ctx}) => {
    // we want to load the token from cookie
    // could also pass in here, but cookie
    // is secure HTTP only so let's use it
    const token = ctx?.userToken

    if (!token) return null

    return await loadCurrentUser(token)
  }),
  contactIdForEmail: baseProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const token = ctx?.userToken || process.env.EGGHEAD_SUPPORT_BOT_TOKEN

      if (!token) return null

      return await getContactId({token, email: input.email})
    }),
  transactionsForCurrent: baseProcedure.query(async ({input, ctx}) => {
    const token = ctx?.userToken

    if (!token) return []

    const transactions =
      (await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID as string,
          },
        },
      ).then((res) => res.json())) || []

    if (transactions?.error) {
      console.error('error fetching transactions: ', transactions.error)
      return null
    }

    return transactionsSchema.parse(transactions)
  }),
  accountsForCurrent: baseProcedure.query(async ({input, ctx}) => {
    // we want to load the token from cookie
    // could also pass in here, but cookie
    // is secure HTTP only so let's use it
    const token = ctx?.userToken

    if (!token) return null

    const user = await loadCurrentUser(token)

    return await loadUserAccounts({token, user_id: user.id})
  }),
  removeGithubLink: baseProcedure.mutation(async ({input, ctx}) => {
    const token = ctx?.userToken

    if (!token) return null

    const graphQLClient = getGraphQLClient(token)

    const mutation = gql`
      mutation RemoveGithubLink {
        remove_github_link {
          user {
            id
          }
          errors {
            message
          }
        }
      }
    `

    let res = await graphQLClient
      .request(mutation)
      .then((data) => {
        return data
      })
      .catch((err) => {
        console.error(err)
      })
    return res
  }),
  deleteAccount: baseProcedure.mutation(async ({input, ctx}) => {
    const token = ctx?.userToken

    if (!token) return null

    const graphQLClient = getGraphQLClient(token)

    const mutation = gql`
      mutation DeleteAccount {
        delete_user {
          deleted_user_id
          errors {
            message
          }
        }
      }
    `

    let res = await graphQLClient
      .request(mutation)
      .then((data) => {
        return data
      })
      .catch((err) => {
        console.error(err)
      })

    return res
  }),
})
