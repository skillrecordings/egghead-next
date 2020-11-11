import {request} from 'graphql-request'

export type Instructor = {
  full_name: string
  avatar_64_url: string
}

const endpoint = 'https://egghead.io/graphql'

export async function loadInstructors(page = 1) {
  const query = `query getInstructors($page: Int!){
    instructors(per_page: 24, page:$page){
      id
      full_name
      avatar_url
      slug
    }
  }`
  const {instructors} = await request(endpoint, query, {page})

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
    }
  }`
  const {instructor} = await request(endpoint, query, {slug})

  return instructor
}
