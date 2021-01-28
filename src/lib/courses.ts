import {request} from 'graphql-request'
import config from './config'
import {last} from 'lodash'

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
        created_at
        updated_at
        free_forever
        tags {
          name
          image_url
          label
        }
        ratings_with_comment {
          count
          data {
            id
            created_at
            rating_out_of_5
            user {
              full_name
              avatar_url
            }
            comment {
              id
              state
              hide_url
              restore_url
              prompt
              comment
            }
          }
        }
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

export async function loadAllCourseByPage(retryCount = 0): Promise<any> {
  const query = /* GraphQL */ `
    query PagedCourses($page: Int!, $per_page: Int!) {
      courses(page: $page, per_page: $per_page) {
        data {
          slug
          title
          average_rating_out_of_5
          watched_count
          path
          image_thumb_url
          description
          summary
          tags {
            name
            label
            image_url
          }
          instructor {
            id
            full_name
            path
          }
        }
        count
        current_page
        total_pages
      }
    }
  `
  try {
    let currentPage = 1
    let allCourses: any[] = []
    let hasNextPage = true

    while (hasNextPage) {
      const {
        courses: {data, count},
      } = await request(config.graphQLEndpoint, query, {
        page: currentPage,
        per_page: 25,
      })

      currentPage = currentPage + 1
      allCourses = [...allCourses, ...data]

      console.debug(`\n\n~> loading courses: ${allCourses.length}/${count}\n`)

      hasNextPage = allCourses.length < count
    }

    return allCourses
  } catch (error) {
    if (retryCount <= 4) {
      return loadAllCourseByPage(retryCount + 1)
    } else {
      throw error
    }
  }
}

export async function loadAllCourses(retryCount = 0): Promise<any> {
  console.debug(`\n\n ~> loading all courses [retries${retryCount}]`)
  const query = /* GraphQL */ `
    query getCourses {
      all_courses {
        slug
        title
        average_rating_out_of_5
        watched_count
        path
        image_thumb_url
        description
        summary
        tags {
          name
          label
          image_url
        }
        instructor {
          id
          full_name
          path
        }
      }
    }
  `
  try {
    const {all_courses} = await request(config.graphQLEndpoint, query)

    return all_courses
  } catch (error) {
    if (retryCount <= 4) {
      return loadAllCourses(retryCount + 1)
    } else {
      throw error
    }
  }
}
