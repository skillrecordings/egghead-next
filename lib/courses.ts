import {request} from 'graphql-request'

export async function loadCourse(slug) {
  const endpoint = 'https://egghead.io/graphql'

  const query = /* GraphQL */ `
    query getCourse($slug: String!) {
      course(slug: $slug) {
        slug
        title
        description
        square_cover_480_url
        average_rating_out_of_5
        rating_count
        watched_count
        lessons {
          slug
          title
          summary
          path
        }
        instructor {
          full_name
          avatar_64_url
        }
      }
    }
  `
  const {course} = await request(endpoint, query, {slug})

  return course
}
