import {GraphQLClient, gql} from 'graphql-request'
import config from './config'

export async function loadNotes(slug: string) {
  const query = /* GraphQL */ gql`
    query getFileContents($owner: String!, $name: String!, $file: String!) {
      repository(owner: $owner, name: $name) {
        object(expression: $file) {
          ... on Blob {
            text
          }
        }
      }
    }
  `

  const variables = {
    owner: 'eggheadio',
    name: 'eggheadio-course-notes',
    file: `master:${slug}/README.md`,
  }
  const client = new GraphQLClient(config.githubEndpoint, {
    headers: {authorization: `Bearer ${process.env.GITHUB_API_KEY}`},
  })
  const data = await client.request(query, variables)
  const text = data?.repository?.object?.text

  return text
}
