import {GraphQLClient} from 'graphql-request'
import config from './config'

const graphQLClient = new GraphQLClient(config.graphQLEndpoint)

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

  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }

  graphQLClient.setHeaders({
    ...authorizationHeader,
  })

  try {
    const {account} = await graphQLClient.request(query, variables)
    return account
  } catch (e) {
    console.error(e)
    return
  }
}
