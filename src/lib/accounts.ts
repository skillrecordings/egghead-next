import {getGraphQLClient} from '../utils/configured-graphql-client'

export async function loadAccount(slug: string, token: string) {
  const query = /* GraphQL */ `
    query getAccount($slug: String!) {
      account(slug: $slug) {
        slug
        stripe_customer_id
        subscriptions {
          type
          current_period_end
          stripe_subscription_id
        }
      }
    }
  `
  const variables = {
    slug,
  }

  const graphQLClient = getGraphQLClient(token)

  try {
    const {account} = await graphQLClient.request(query, variables)
    return account
  } catch (e) {
    console.error(e)
    return
  }
}
