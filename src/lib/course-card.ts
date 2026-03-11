import {getGraphQLClient} from '@/utils/configured-graphql-client'

export async function loadCourseCardBySlug(slug: string, token?: string) {
  const query = /* GraphQL */ `
    query getCourseCard($slug: String!) {
      playlist(slug: $slug) {
        slug
        title
        summary
        path
        square_cover_480_url
        instructor {
          full_name
          avatar_url
        }
      }
    }
  `

  const graphQLClient = getGraphQLClient(token)
  const {playlist} = await graphQLClient.request(query, {slug})

  return playlist
}
