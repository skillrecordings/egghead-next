import {GraphQLClient} from 'graphql-request'
import config from '../lib/config'
import getAccessTokenFromCookie from './get-access-token-from-cookie'

export const getGraphQLClient = (token?: string) => {
  const graphQLClient = new GraphQLClient(config.graphQLEndpoint, {
    headers: config.headers,
  })

  const authToken = token || getAccessTokenFromCookie()

  if (authToken) {
    graphQLClient.setHeader('Authorization', `Bearer ${authToken}`)
  }

  return graphQLClient
}
