import {GraphQLClient} from 'graphql-request'
import config from './config'

const graphQLClient = new GraphQLClient(config.graphQLEndpoint)

export async function loadTeams(token: string) {
  const query = /* GraphQL */ `
    query getAccounts {
      accounts {
        data {
          id
          slug
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
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }

  graphQLClient.setHeaders({
    ...authorizationHeader,
  })

  try {
    const {accounts} = await graphQLClient.request(query)
    console.log({accounts})
    return accounts
  } catch (e) {
    console.error(e)
    console.error(e.response.errors)
    return
  }
}
