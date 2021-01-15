import {GraphQLClient} from 'graphql-request'
import config from './config'

const graphQLClient = new GraphQLClient(config.graphQLEndpoint)

export async function loadAllPlaylists() {
  const query = /* GraphQL */ `
    query getPlaylists {
      all_playlists {
        slug
        title
        average_rating_out_of_5
        watched_count
        path
        image_thumb_url
        instructor {
          id
          full_name
          path
        }
      }
    }
  `
  const {all_playlists} = await graphQLClient.request(query)

  return all_playlists
}

export async function loadPlaylist(slug: string, token?: string) {
  const query = /* GraphQL */ `
    query getPlaylist($slug: String!) {
      playlist(slug: $slug) {
        slug
        title
        description
        image_thumb_url
        square_cover_480_url
        average_rating_out_of_5
        rating_count
        watched_count
        path
        url
        duration
        type
        primary_tag {
          name
          image_url
          slug
        }
        items {
          ... on Course {
            slug
            title
            summary
            description
            path
            square_cover_url
            type
          }
          ... on Playlist {
            slug
            title
            description
            path
            square_cover_url
            type
            url
            lessons {
              title
              path
              slug
              icon_url
            }
          }
          ... on Lesson {
            slug
            title
            description
            path
            http_url
            icon_url
            type
          }
          ... on File {
            slug
            title
            url
            description
            square_cover_480_url
            square_cover_url
            type
          }
          ... on Download {
            slug
            title
            url
            summary
            description
            square_cover_480_url
            square_cover_url
            type
          }
          ... on Url {
            title
            url
            description
            square_cover_480_url
            square_cover_url
            type
          }
          ... on GenericResource {
            title
            url
            description
            square_cover_480_url
            square_cover_url
            type
          }
        }
        instructor {
          id
          full_name
          slug
          avatar_url
          avatar_64_url
          bio_short
          twitter
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
