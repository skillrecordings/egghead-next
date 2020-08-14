import {request} from 'graphql-request'
import config from './config'

export async function loadCourse(slug: string) {
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
  const {course} = await request(config.graphQLEndpoint, query, {slug})

  return course
}

export async function loadAllCourses() {
  const query = /* GraphQL */ `
    query getCourses {
      all_courses {
        title
        slug
        square_cover_480_url
        description
      }
    }
  `
  const {all_courses} = await request(config.graphQLEndpoint, query)

  return all_courses
}
