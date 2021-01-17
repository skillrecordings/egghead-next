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
        square_cover_large_url
        average_rating_out_of_5
        rating_count
        watched_count
        path
        url
        duration
        type
        lessons {
          id
          slug
          title
          description
          path
          icon_url
          duration
          thumb_url
        }
        instructor {
          id
          full_name
          slug
          avatar_url
          avatar_64_url
          bio_short
          twitter
        }
        primary_tag {
          name
          image_url
          slug
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
        slug
        title
        average_rating_out_of_5
        watched_count
        path
        image_thumb_url
        instructor {
          id
          full_name
          path
        }
      }
    }
  `
  const {all_courses} = await request(config.graphQLEndpoint, query)

  return all_courses
}
