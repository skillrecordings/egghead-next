import {Resource} from '@interfaces/resource'
import {request} from 'graphql-request'
import config from './config'

export async function loadLessons(): Promise<Resource[]> {
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
        summary
        hls_url
        dash_url
        instructor {
          full_name
        }
      }
    }
  `
  const {lesson} = await request(config.graphQLEndpoint, query, {slug})

  return lesson
}
