import axios from 'axios'
import gql from 'graphql-tag'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import {getGraphQLClient} from '../utils/configured-graphql-client'

const eggAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
})

export async function loadUserAccounts({
  token,
  user_id,
}: {
  token: string
  user_id: number
}) {
  const query = gql`
    query UserAccounts($user_id: Int!) {
      user(id: $user_id) {
        accounts {
          slug
          name
          stripe_customer_id
          capacity
          is_full
          number_of_members
          members {
            id
            name
            email
          }
          owner {
            id
            name
            email
          }
          additional_billing_info
          invite_token
          subscriptions {
            type
            current_period_end
            stripe_subscription_id
            status
          }
        }
      }
    }
  `
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)
  const variables = {
    user_id,
  }
  const {user} = await graphQLClient.request(query, variables)
  return user?.accounts || null
}

export async function loadCurrentUser(
  token: string,
  loadMinimalUser: boolean = true,
) {
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const user = await eggAxios
    .get(`/api/v1/users/current?minimal=${loadMinimalUser}`, {
      headers: {
        ...authorizationHeader,
      },
    })
    .then(({data}) => data)

  return user
}

export async function loadUserProgress(
  user_id: number,
  page = 1,
  per_page = 5,
  token?: string,
): Promise<any> {
  const query = `
    query AllProgress($user_id: Int!, $page: Int!, $per_page: Int!) {
      user(id: $user_id) {
        lessons_completed
        minutes_watched
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
                    id
                    title
                    slug
                    path
                  }
                }
                items {
                  ... on Lesson {
                    id
                    title
                    slug
                    path
                    type
                  }
                }
                instructor {
                  full_name
                  avatar_64_url
                }
              }
              ... on Course {
                id
                title
                lessons {
                  id
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
                    id
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

  const {user} = await graphQLClient.request(query, variables)

  if (user) {
    return {
      completionStats: {
        minutesWatched: user.minutes_watched,
        completedCourseCount: user.all_progress.data.filter(
          (p: any) => p.is_complete,
        ).length,
        completedLessonCount: user.lessons_completed,
      },
      progress: user.all_progress,
    }
  }
}

export async function loadUserCompletedCourses(token?: string): Promise<any> {
  const query = gql`
    query completedCourses {
      user_progress {
        completed_at
        lesson_count
        is_complete
        collection {
          ... on Playlist {
            slug
            title
            image: image_thumb_url
            path
            id
          }
          ... on Course {
            title
            lessons {
              title
              slug
              path
            }
            image: image_thumb_url
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
  `
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const {user_progress} = await graphQLClient.request(query)

  let completeCourses = user_progress.filter((p: any) => p.is_complete)

  if (user_progress) {
    return {
      completeCourses,
    }
  }
}

export async function getContactId({
  token,
  email,
}: {
  token: string
  email: string
}): Promise<any> {
  const query = gql`
    query getContactIdForEmail($email: String!) {
      user_for_email(email: $email) {
        contact_id
      }
    }
  `
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const {user_for_email} = await graphQLClient.request(query, {email})

  return user_for_email?.contact_id || null
}
