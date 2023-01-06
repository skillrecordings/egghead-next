import {getGraphQLClient} from '../utils/configured-graphql-client'

type TeamResponse = {data: Array<any> | undefined}

export async function loadTeams(token: string): Promise<TeamResponse> {
  const query = /* GraphQL */ `
    query getAccounts {
      accounts {
        data {
          id
          slug
          name
          is_full
          capacity
          number_of_members
          invite_token
          stripe_customer_id
          members {
            id
            roles
            email
            name
            date_added
          }
        }
      }
    }
  `
  const graphQLClient = getGraphQLClient(token)

  try {
    const {accounts} = await graphQLClient.request(query)
    return accounts
  } catch (e) {
    console.error(e)
    return {data: undefined}
  }
}
