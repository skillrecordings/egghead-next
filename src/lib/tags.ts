import axios from 'axios'
import {sanityClient} from 'utils/sanity-client'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import {reactPageQuery} from 'components/search/curated/react'

async function readTags() {
  const endpoint = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/tags?size=40`
  const {data} = await axios.get(endpoint)

  return data
}

export function getTags() {
  const tags = readTags()

  return tags
}

export async function getTag(slug: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/tags/${slug}`
  const {data} = await axios.get(endpoint)

  return data
}

export async function loadTag(slug: string) {
  const query = /* GraphQL */ `
    query getTag($slug: String!) {
      tag(slug: $slug) {
        name
        slug
        label
        description
        image_480_url
        path
      }
    }
  `

  const variables = {
    slug: slug,
  }

  const graphQLClient = getGraphQLClient()
  const {tag} = await graphQLClient.request(query, variables)

  let sanityTag
  if (canLoadSanityTag(slug)) {
    sanityTag = await loadSanityTag(slug)
  }

  return {...tag, ...sanityTag}
}

const sanityTagPageHash = {
  react: reactPageQuery,
}

type SelectedTag = keyof typeof sanityTagPageHash

const canLoadSanityTag = (selectedTag: string): selectedTag is SelectedTag => {
  const keyNames = Object.keys(sanityTagPageHash)

  return keyNames.includes(selectedTag)
}

export const loadSanityTag = async (selectedTag: string) => {
  if (!canLoadSanityTag(selectedTag)) return

  const query = sanityTagPageHash[selectedTag]
  if (!query) return

  return await sanityClient.fetch(query)
}
