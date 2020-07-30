import {request} from 'graphql-request'

export async function loadInstructors(page = 1) {
  const endpoint = 'https://egghead.io/graphql'

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
