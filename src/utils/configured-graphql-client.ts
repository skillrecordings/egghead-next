import {GraphQLClient} from 'graphql-request'
import config from '../lib/config'
import getAccessTokenFromCookie from './get-access-token-from-cookie'

type GraphQLClientOptions = {
  allowStoredTokenFallback?: boolean
}

export const getGraphQLClient = (
  token?: string,
  options: GraphQLClientOptions = {},
) => {
  const {allowStoredTokenFallback = true} = options
  const graphQLClient = new GraphQLClient(config.graphQLEndpoint, {
    headers: config.headers,
  })

  const authToken =
    token ||
    getAccessTokenFromCookie({
      allowLocalStorageFallback: allowStoredTokenFallback,
    })

  if (authToken) {
    graphQLClient.setHeader('Authorization', `Bearer ${authToken}`)
  }

  return graphQLClient
}
