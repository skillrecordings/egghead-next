import axios from 'utils/configured-axios'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'

export type Comment = {
  title?: string
  comment: string
  role?: string
}

export async function saveCommentForLesson(slug: string, comment: Comment) {
  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/lessons/${slug}/comments`,
      {comment},
    )
    .then(({data}) => data)
}

type GraphQLComment = {
  comment: string
  commentable_id: number
  commentable_type: string
  created_at: string
  id: number
  is_commentable_owner: boolean
  state: string
  user: {
    avatar_url: string
    full_name: string
    instructor: {
      first_name: string
    }
  }
}

export async function loadLessonComments(
  slug: string,
  token?: string,
): Promise<GraphQLComment[]> {
  token = token || getAccessTokenFromCookie()
  const graphQLClient = getGraphQLClient(token)

  const variables = {
    slug: slug,
  }

  const query = /* GraphQL */ `
    query getLessonComments($slug: String!) {
      lesson_comments(slug: $slug) {
        comment
        commentable_id
        commentable_type
        created_at
        id
        is_commentable_owner
        state
        user {
          avatar_url
          full_name
          instructor {
            first_name
          }
        }
      }
    }
  `

  try {
    const {lesson_comments} = await graphQLClient.request(query, variables)

    return lesson_comments
  } catch (e) {
    console.log('Error fetching lesson comments: ', e)

    return []
  }
}
