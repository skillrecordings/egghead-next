import {GraphQLClient} from 'graphql-request'
import config from '../lib/config'
import getAccessTokenFromCookie from './get-access-token-from-cookie'

export const getGraphQLClient = () => {
  const graphQLClient = new GraphQLClient(config.graphQLEndpoint, {
    headers: config.headers,
  })

  const authToken = getAccessTokenFromCookie()

  if (authToken) {
    graphQLClient.setHeader('Authorization', `Bearer ${authToken}`)
  }

  return graphQLClient
}
