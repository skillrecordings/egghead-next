import {GraphQLClient} from 'graphql-request'
import config from './config'

const graphQLClient = new GraphQLClient(config.graphQLEndpoint)

export async function loadPlaylist(slug: string, token: string) {
  const query = /* GraphQL */ `
    query getPlaylist($slug: String!) {
      playlist(slug: $slug) {
        slug
        title
        description
        image_thumb_url
        path
        lessons {
          slug
          title
          summary
          path
        }
        owner {
          id
          full_name
          avatar_url
        }
      }
    }
  `
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const variables = {
    slug: slug,
  }

  graphQLClient.setHeaders({
    ...authorizationHeader,
  })

  const {playlist} = await graphQLClient.request(query, variables)

  return playlist
}

export async function loadAllPlaylists() {
  const query = /* GraphQL */ `
    query getPlaylists {
      all_playlists {
        title
        slug
        description
      }
    }
  `
  const {all_playlists} = await graphQLClient.request(query)

  return all_playlists
}
