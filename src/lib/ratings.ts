import {GraphQLClient} from 'graphql-request'
import config from './config'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import {get} from 'lodash'

const graphQLClient = new GraphQLClient(config.graphQLEndpoint)

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
  const SIZE_OF_PAGE = 3

  const token = getAccessTokenFromCookie()
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const variables = {
    slug,
    type,
    per_page: SIZE_OF_PAGE,
  }
  graphQLClient.setHeaders({
    ...authorizationHeader,
  })

  try {
    const result = await graphQLClient.request(CourseRatingsQuery, variables)
    return get(result, 'ratings.data', [])
  } catch {
    return []
  }
}
