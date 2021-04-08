import {GraphQLClient} from 'graphql-request'
import config from '../lib/config'

export const setAuthorizationHeaderForClient = (
  client: GraphQLClient,
  authToken: string | undefined,
) => {
  if (authToken) {
    const authorizationHeader = `Bearer ${authToken}`
    client.setHeader('authorization', authorizationHeader)
  }
}

export const getGraphQLClient = (token?: string) => {
  const graphQLClient = new GraphQLClient(config.graphQLEndpoint, {
    headers: config.headers,
  })

  setAuthorizationHeaderForClient(graphQLClient, token)
  return graphQLClient
}
