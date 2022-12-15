import {request} from 'graphql-request'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import config from './config'
import {loadCourseMetadata} from './courses'

export async function loadAllPlaylistsByPage(retryCount = 0): Promise<any> {
  const query = /* GraphQL */ `
    query PagedPlaylists($page: Int!, $per_page: Int!) {
      playlists(page: $page, per_page: $per_page) {
        data {
          slug
          title
          average_rating_out_of_5
          watched_count
          path
          description
          access_state
          created_at
          tags {
            name
            label
            image_url
          }
          image_thumb_url
          instructor {
            id
            full_name
            path
          }
        }
        count
        current_page
        total_pages
      }
    }
  `
  try {
    let currentPage = 1
    let allPlaylists: any[] = []
    let hasNextPage = true

    while (hasNextPage) {
      const {
        playlists: {data, count},
      } = await request(config.graphQLEndpoint, query, {
        page: currentPage,
        per_page: 25,
      })

      currentPage = currentPage + 1
      allPlaylists = [...allPlaylists, ...data]

      console.debug(
        `\n\n~> loading playlists: ${allPlaylists.length}/${count}\n`,
      )

      hasNextPage = allPlaylists.length < count
    }

    return allPlaylists
  } catch (error) {
    if (retryCount <= 4) {
      return loadAllPlaylistsByPage(retryCount + 1)
    } else {
      throw error
    }
  }
}

export async function loadAllPlaylists() {
  const query = /* GraphQL */ `
    query getPlaylists {
      all_playlists {
        slug
        title
        average_rating_out_of_5
        watched_count
        path
        description
        access_state
        created_at
        tags {
          name
          label
          image_url
        }
        image_thumb_url
        instructor {
          id
          full_name
          path
        }
      }
    }
  `
  const graphQLClient = getGraphQLClient()
  const {all_playlists} = await graphQLClient.request(query)

  return all_playlists
}

export async function loadAuthedPlaylistForUser(slug: string) {
  const query = /* GraphQL */ `
    query getPlaylist($slug: String!) {
      playlist(slug: $slug) {
        favorited
        toggle_favorite_url
        download_url
        rss_url
      }
    }
  `
  const token = getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const variables = {
    slug: slug,
  }

  const {playlist} = await graphQLClient.request(query, variables)

  return playlist
}

/**
 * in the database a Course is called a Playlist
 * @param slug
 * @param token
 */
export async function loadPlaylist(slug: string, token?: string) {
  const query = /* GraphQL */ `
    query getPlaylist($slug: String!) {
      playlist(slug: $slug) {
        id
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
        created_at
        updated_at
        published_at
        access_state
        visibility_state
        state
        tags {
          name
          image_url
          label
        }
        ratings_with_comment {
          count
          data {
            id
            created_at
            rating_out_of_5
            user {
              full_name
              avatar_url
            }
            comment {
              id
              state
              hide_url
              restore_url
              prompt
              comment
            }
          }
        }
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
            duration
          }
          ... on Playlist {
            slug
            title
            description
            path
            square_cover_url
            type
            url
            duration
            lessons {
              title
              path
              slug
              icon_url
              duration
              thumb_url
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
            duration
            thumb_url
            created_at
            updated_at
            published_at
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
          ... on Podcast {
            transcript
            simplecast_uid
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
  const variables = {
    slug: slug,
  }

  const graphQLClient = getGraphQLClient(token)

  const {playlist} = await graphQLClient.request(query, variables)
  const courseMeta = await loadCourseMetadata(playlist.id)

  return {...playlist, ...courseMeta}
}
