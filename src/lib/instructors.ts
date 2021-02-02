import {request} from 'graphql-request'
import config from './config'

export type Instructor = {
  full_name: string
  avatar_64_url: string
}

export async function loadInstructors(page = 1) {
  const query = `query getInstructors($page: Int!){
    instructors(per_page: 24, page:$page){
      id
      full_name
      avatar_url
      slug
    }
  }`
  const {instructors} = await request(config.graphQLEndpoint, query, {page})

  return instructors
}

export async function loadInstructor(slug: string) {
  const query = `query getInstructor($slug: String!){
    instructor(slug: $slug){
      id
      full_name
      avatar_url
      slug
      bio_short
      twitter
      website
    }
  }`
  const {instructor} = await request(config.graphQLEndpoint, query, {slug})

  return instructor
}
