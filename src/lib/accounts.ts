import graphQLClient, {
  setAuthorizationHeaderForClient,
} from '../utils/configured-graphql-client'
import config from './config'

export async function loadAccount(slug: string, token: string) {
  const query = /* GraphQL */ `
    query getAccount($slug: String!) {
      account(slug: $slug) {
        slug
        stripe_customer_id
        subscriptions {
          stripe_subscription_id
        }
      }
    }
  `
  const variables = {
    slug,
  }

  setAuthorizationHeaderForClient(graphQLClient, token)

  try {
    const {account} = await graphQLClient.request(query, variables)
    return account
  } catch (e) {
    console.error(e)
    return
  }
}
