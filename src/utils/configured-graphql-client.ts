import {GraphQLClient} from 'graphql-request'
import config from '../lib/config'

const graphQLClient = new GraphQLClient(config.graphQLEndpoint, {
  headers: config.headers,
})

export const setAuthorizationHeaderForClient = (
  client: GraphQLClient,
  authToken: string | undefined,
) => {
  if (authToken) {
    const authorizationHeader = `Bearer ${authToken}`
    client.setHeader('authorization', authorizationHeader)
  }
}

export default graphQLClient
