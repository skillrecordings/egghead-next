import gql from 'graphql-tag'
import {getGraphQLClient} from '../utils/configured-graphql-client'

export async function loadContactAvatars(
  contact_ids: string[],
  token?: string,
): Promise<any> {
  const query = gql`
    query allAvatars($contact_ids: [String!]) {
      contact_avatars(contact_ids: $contact_ids) {
        name
        avatar_url
      }
    }
  `
  const graphQLClient = getGraphQLClient(token)

  const {contact_avatars} = await graphQLClient.request(query, {contact_ids})

  return contact_avatars
}
