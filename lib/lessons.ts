import {request} from 'graphql-request'
import config from './config'

export async function loadLesson(slug) {
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
