import {LessonResource} from 'types'
import {GraphQLClient} from 'graphql-request'
import config from './config'

const graphQLClient = new GraphQLClient(config.graphQLEndpoint)

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
  const {lessons} = await graphQLClient.request(config.graphQLEndpoint, query)

  return lessons
}

export async function loadLesson(slug: string, token?: string) {
  const query = /* GraphQL */ `
    query getLesson($slug: String!) {
      lesson(slug: $slug) {
        slug
        title
        transcript_url
        subtitles_url
        next_up_url
        summary
        hls_url
        dash_url
        free_forever
        http_url
        media_url
        path
        course {
          title
          square_cover_480_url
          slug
        }
        tags {
          name
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

  const {lesson} = await graphQLClient.request(query, variables)

  return lesson as LessonResource
}
