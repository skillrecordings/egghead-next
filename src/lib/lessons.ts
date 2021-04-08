import {LessonResource} from 'types'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import config from './config'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'

export async function loadLessons(): Promise<LessonResource[]> {
  const query = /* GraphQL */ `
    query getLessons {
      lessons(per_page: 25) {
        title
        slug
        icon_url
        instructor {
          full_name
          avatar_64_url
        }
      }
    }
  `

  const graphQLClient = getGraphQLClient()

  const {lessons} = await graphQLClient.request(config.graphQLEndpoint, query)

  return lessons
}

export async function loadLesson(slug: string, token?: string) {
  const query = /* GraphQL */ `
    query getLesson($slug: String!) {
      lesson(slug: $slug) {
        slug
        title
        duration
        transcript_url
        transcript
        subtitles_url
        next_up_url
        description
        hls_url
        dash_url
        free_forever
        http_url
        media_url
        lesson_view_url
        thumb_url
        path
        icon_url
        download_url
        created_at
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
        repo_url
        code_url
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

export async function loadBasicLesson(slug: string) {
  const query = /* GraphQL */ `
    query getLesson($slug: String!) {
      lesson(slug: $slug) {
        slug
        title
        transcript
        description
        free_forever
        media_url
        thumb_url
        subtitles_url
        path
        icon_url
        created_at
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
              media_url
              duration
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
              media_url
              duration
            }
          }
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

  const variables = {
    slug: slug,
  }

  const graphQLClient = getGraphQLClient()
  const {lesson} = await graphQLClient.request(query, variables)

  return lesson as LessonResource
}
