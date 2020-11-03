import {request} from 'graphql-request'
import config from './config'

export async function loadPlaylist(slug: string) {
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
      }
    }
  `
  const {playlist} = await request(config.graphQLEndpoint, query, {slug})

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
  const {all_playlists} = await request(config.graphQLEndpoint, query)

  return all_playlists
}
