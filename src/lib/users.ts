import axios from 'axios'
import gql from 'graphql-tag'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'
import {getGraphQLClient} from '../utils/configured-graphql-client'

const eggAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
})

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
                    type
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

  const {user} = await graphQLClient.request(query, variables)

  if (user) {
    return user.all_progress
  }
}

/**
 * Loads a user from the database.
 * @param token
 * @param timeout The amount of time to wait for the user to load. Needs to be
 *                short because this is used in the middleware which has a 1.5s
 *                total execution time.
 */
async function fetchEggheadUser(token: string, timeout: number = 600) {
  return new Promise(async (resolve, reject) => {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    })

    let timedOut = false

    const id = setTimeout(() => {
      timedOut = true
      reject(`timeout loading user [${token}]`)
    }, timeout)

    const url = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current?minimal=true`

    await fetch(url, {
      headers,
    })
      .then((response) => {
        response.json().then((user) => {
          if (!timedOut) resolve(user)
        })
      })
      .catch((error) => {
        console.log({error})
        if (!timedOut) reject(error)
      })
      .finally(() => {
        clearTimeout(id)
      })
  })
}

export const loadUser = async (token: string, user?: any) => {
  try {
    if (user) {
      user = JSON.parse(user)
      if (user !== 'undefined') {
        return user
      }
    }
  } catch (error) {
    console.error(error)
  }

  try {
    const user: any = await fetchEggheadUser(token)
    return user
  } catch (error) {
    console.error(error)
  }
}
