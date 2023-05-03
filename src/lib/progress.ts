import gql from 'graphql-tag'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import {z} from 'zod'

const PlaylistProgressSchema = z
  .object({
    is_complete: z.boolean(),
    lesson_count: z.number(),
    completed_lesson_count: z.number(),
    completed_lessons: z.array(
      z.object({
        slug: z.string(),
      }),
    ),
  })
  .nullish()

const LessonProgressSchema = z
  .object({
    lessonProgress: z.object({
      completed: z.boolean(),
      title: z.string(),
      slug: z.string(),
      path: z.string(),
    }),
  })

  .nullish()

export type PlaylistProgress = z.infer<typeof PlaylistProgressSchema>

export async function loadPlaylistProgress({
  token,
  slug,
}: {
  token?: string
  slug: string
}) {
  const query = gql`
    query getPlaylistProgress($slug: String!) {
      playlist_progress(slug: $slug) {
        is_complete
        lesson_count
        completed_lesson_count
        completed_lessons {
          slug
        }
      }
    }
  `
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)
  const variables = {
    slug,
  }
  const {playlist_progress: progress} = await graphQLClient.request(
    query,
    variables,
  )
  return PlaylistProgressSchema.parse(progress)
}

export async function loadLessonProgress({
  token,
  slug,
}: {
  token?: string
  slug: string
}) {
  const query = gql`
    query getLessonProgress($slug: String!) {
      lesson(slug: $slug) {
        title
        slug
        path
        completed
      }
    }
  `
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)
  const variables = {
    slug,
  }
  const {lesson} = await graphQLClient.request(query, variables)
  return LessonProgressSchema.parse({lessonProgress: lesson})
}

export type LessonProgress = z.infer<typeof LessonProgressSchema>
