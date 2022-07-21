import {LessonResource} from 'types'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'

export async function loadLesson(slug: string, token?: string) {
  const query = /* GraphQL */ `
    query getLesson($slug: String!) {
      lesson(slug: $slug) {
        slug
        title
        description
        duration
        next_up_url
        free_forever
        path
        transcript
        transcript_url
        subtitles_url
        hls_url
        dash_url
        http_url
        media_url
        lesson_view_url
        thumb_url
        icon_url
        download_url
        staff_notes_url
        repo_url
        code_url
        created_at
        updated_at
        published_at
        collection {
          ... on Playlist {
            title
            slug
            type
            square_cover_480_url
            path
            lessons {
              slug
              type
              path
              title
              completed
              duration
              thumb_url
              media_url
            }
          }
          ... on Course {
            title
            slug
            type
            square_cover_480_url
            path
            lessons {
              slug
              type
              path
              title
              completed
              duration
              thumb_url
              media_url
            }
          }
        }
        course {
          title
          square_cover_480_url
          slug
        }
        tags {
          name
          label
          http_url
          image_url
        }
        instructor {
          full_name
          avatar_64_url
          slug
          twitter
        }
        comments {
          comment
          commentable_id
          commentable_type
          created_at
          id
          is_commentable_owner
          state
          user {
            avatar_url
            full_name
            instructor {
              first_name
            }
          }
        }
      }
    }
  `

  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const variables = {
    slug: slug,
  }

  const {lesson} = await graphQLClient.request(query, variables)

  return lesson as LessonResource
}

export async function loadLessonForUser(slug: string) {
  const query = /* GraphQL */ `
    query getLesson($slug: String!) {
      lesson(slug: $slug) {
        slug
        hls_url
        dash_url
        transcript_url
        toggle_favorite_url
        download_url
        favorited
        completed
      }
    }
  `

  const token = getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const variables = {
    slug: slug,
  }

  const {lesson} = await graphQLClient.request(query, variables)

  return lesson as LessonResource
}
