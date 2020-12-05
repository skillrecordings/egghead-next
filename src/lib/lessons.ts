import {LessonResource} from 'types'
import {request} from 'graphql-request'
import config from './config'

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
  const {lessons} = await request(config.graphQLEndpoint, query)

  return lessons
}

export async function loadLesson(slug: string) {
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
  const {lesson} = await request(config.graphQLEndpoint, query, {slug})

  return lesson as LessonResource
}
