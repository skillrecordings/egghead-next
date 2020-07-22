import {request} from 'graphql-request'

export async function loadLesson(slug) {
  const endpoint = 'https://egghead.io/graphql'

  const query = /* GraphQL */ `
    query getLesson($slug: String!) {
      lesson(slug: $slug) {
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
  const {lesson} = await request(endpoint, query, {slug})

  return lesson
}
