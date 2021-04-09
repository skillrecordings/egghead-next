import axios from 'axios'
import gql from 'graphql-tag'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import {getGraphQLClient} from '../utils/configured-graphql-client'

export async function loadCurrentUser(
  token: string,
  loadFullUser: boolean = true,
) {
  const user = await axios
    .get(`/api/users/current?minimal=${loadFullUser}`)
    .then(({data}) => data)

  return user
}

export async function loadUserProgress(
  user_id: number,
  page = 1,
  per_page = 5,
  token?: string,
): Promise<any> {
  const query = gql`
    query AllProgress($user_id: Int!, $page: Int!, $per_page: Int!) {
      user(id: $user_id) {
        email
        all_progress(page: $page, per_page: $per_page) {
          count
          current_page
          total_pages
          data {
            lesson_count
            completed_lesson_count
            completed_at
            is_complete
            created_at
            updated_at
            collection {
              ... on Playlist {
                title
                square_cover_480_url
                type
                path
                progress {
                  lesson_count
                  completed_lesson_count
                  is_completed
                  completed_at
                  completed_lessons {
                    title
                    slug
                    path
                  }
                }
                items {
                  ... on Lesson {
                    title
                    slug
                    path
                  }
                }
                instructor {
                  full_name
                  avatar_64_url
                }
              }
              ... on Course {
                title
                lessons {
                  title
                  slug
                  path
                }
                square_cover_480_url
                type
                path
                progress {
                  lesson_count
                  completed_lesson_count
                  is_completed
                  completed_at
                  completed_lessons {
                    title
                    slug
                    path
                  }
                }
                instructor {
                  full_name
                  avatar_64_url
                }
              }
            }
          }
        }
      }
    }
  `
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const variables = {
    page,
    per_page,
    user_id,
  }

  const {
    user: {all_progress},
  } = await graphQLClient.request(query, variables)

  return all_progress
}
