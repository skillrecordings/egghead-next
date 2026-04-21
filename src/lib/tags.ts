import axios from 'axios'
import {sanityClient} from '@/utils/sanity-client'
import {getGraphQLClient} from '../utils/configured-graphql-client'
import {reactPageQuery} from '@/components/search/curated/react'
import {nextPageQuery} from '@/components/search/curated/next'
import {remixPageQuery} from '@/components/search/curated/remix'
import {getCourseBuilderTagBySlug} from '@/lib/cb-tags'

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

type ResolvedTag = {
  name: string
  slug: string
  label: string | null
  description: string | null
  image_480_url: string | null
  path: string | null
}

async function loadTagFromRails(slug: string): Promise<ResolvedTag | null> {
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
  const graphQLClient = getGraphQLClient()
  const response = await graphQLClient.request<{tag: ResolvedTag | null}>(
    query,
    {slug},
  )
  return response?.tag ?? null
}

export async function loadTag(slug: string) {
  const cbTag = await getCourseBuilderTagBySlug(slug)

  let tag: ResolvedTag | null = null
  if (cbTag) {
    tag = {
      name: cbTag.name,
      slug: cbTag.slug,
      label: cbTag.label,
      description: cbTag.description,
      image_480_url: cbTag.image_480_url,
      path: cbTag.path,
    }
    if (!tag.image_480_url || !tag.description || !tag.label) {
      try {
        const railsTag = await loadTagFromRails(slug)
        if (railsTag) {
          tag = {
            ...railsTag,
            name: tag.name,
            slug: tag.slug,
            label: tag.label ?? railsTag.label,
            description: tag.description ?? railsTag.description,
            image_480_url: tag.image_480_url ?? railsTag.image_480_url,
            path: tag.path ?? railsTag.path,
          }
        }
      } catch (error) {
        console.error('rails tag fallback failed for slug', slug, error)
      }
    }
  } else {
    try {
      tag = await loadTagFromRails(slug)
    } catch (error) {
      console.error('rails tag lookup failed for slug', slug, error)
    }
  }

  let sanityTag
  if (canLoadSanityTag(slug)) {
    sanityTag = await loadSanityTag(slug)
  }

  return {...tag, ...sanityTag}
}

const sanityTagPageHash = {
  react: reactPageQuery,
  next: nextPageQuery,
  remix: remixPageQuery,
}

type SelectedTag = keyof typeof sanityTagPageHash

export const canLoadSanityTag = (
  selectedTag: string,
): selectedTag is SelectedTag => {
  const keyNames = Object.keys(sanityTagPageHash)

  return keyNames.includes(selectedTag)
}

export const loadSanityTag = async (selectedTag: string) => {
  if (!canLoadSanityTag(selectedTag)) return

  const query = sanityTagPageHash[selectedTag]
  if (!query) return

  return await sanityClient.fetch(query)
}
