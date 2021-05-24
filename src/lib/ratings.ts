import {getGraphQLClient} from '../utils/configured-graphql-client'
import {get} from 'lodash'
import getAccessTokenFromCookie from 'utils/get-access-token-from-cookie'

const CourseRatingsQuery = `
  query RatingsQuery($slug: String!, $per_page: Int!, $type: String!) {
    ratings(rateable_id:$slug, rateable_type: $type, with_comment: true, per_page: $per_page) {
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
  }
`

export async function loadRatings(slug: string, type: string = 'Series') {
  const SIZE_OF_PAGE = 6

  const token = getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const variables = {
    slug,
    type,
    per_page: SIZE_OF_PAGE,
  }

  try {
    const result = await graphQLClient.request(CourseRatingsQuery, variables)
    return get(result, 'ratings.data', [])
  } catch {
    return []
  }
}
