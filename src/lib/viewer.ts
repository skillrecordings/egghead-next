import {getGraphQLClient} from '../utils/configured-graphql-client'
import gql from 'graphql-tag'

export async function loadCurrentViewerRoles(token: string) {
  const query = gql`
    query viewer {
      viewer {
        roles
      }
    }
  `
  const graphQLClient = getGraphQLClient(token)
  const {viewer} = await graphQLClient.request(query)

  return viewer ? viewer.roles : []
}
