import {pgQuery} from '@/db'
import Typesense from 'typesense'
import {Feed} from 'feed'
import removeMarkdown from 'remove-markdown'

export async function getInstructorFeed(slug: string) {
  const siteURL = 'https://egghead.io'
  const date = new Date()

  const instructorResources = await pgQuery(`
      SELECT
        *
      FROM instructors
      WHERE slug = '${slug}'
    `)

  const instructor = instructorResources.rows[0]

  if (!instructor) {
    return null
  }

  let client = new Typesense.Client({
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
        port: 443,
        protocol: 'https',
      },
    ],
    apiKey: process.env.TYPESENSE_WRITE_API_KEY!,
    connectionTimeoutSeconds: 2,
  })

  const stuff = await client
    .collections(process.env.TYPESENSE_COLLECTION_NAME!)
    .documents()
    .search({
      q: '',
      query_by: 'title,description,_tags,instructor_name,contributors',
      filter_by: `instructor.slug:=${slug}`,
      sort_by: 'published_at_timestamp:desc',
      per_page: 100,
    })

  const allPosts = stuff.hits || []

  const author = {
    name: `${instructor.first_name} ${instructor.last_name}'s egghead.io Feed`,
    email: instructor.email,
    link: `https://egghead.io/q/resources-by-${instructor.slug}`,
  }
  const feed = new Feed({
    title: `${instructor.first_name} ${instructor.last_name}'s egghead.io Feed`,
    description: '',
    id: siteURL || 'ds',
    link: siteURL,
    image: `${siteURL}/logo.svg`,
    favicon: `${siteURL}/favicon.png`,
    copyright: `All rights reserved ${date.getFullYear()}, egghead.io & ${
      instructor.first_name
    } ${instructor.last_name}`,
    updated: date,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${siteURL}/i/${slug}/rss.xml`,
      json: `${siteURL}/i/${slug}/feed.json`,
      atom: `${siteURL}/i/${slug}/atom.xml`,
    },
    author,
  })

  allPosts.map(async ({document: post}: any) => {
    const url = `${siteURL}${post.path}`
    return feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: removeMarkdown(post.summary),
      content: removeMarkdown(post.description),
      author: [author],
      contributor: [author],
      date: new Date(
        Number(post.updated_at_timestamp) < 17256758682
          ? Number(post.published_at_timestamp * 1000)
          : Number(post.published_at_timestamp),
      ),
    })
  })

  return feed
}
