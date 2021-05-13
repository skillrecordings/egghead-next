import algoliasearch from 'algoliasearch'
import client, {SanityDocumentStub} from '@sanity/client'
import indexer from 'sanity-algolia'
import {WebhookBody} from 'sanity-algolia/dist/types'
import strip from 'remove-markdown-and-html'

const algoliaAdminKey = process.env.ALGOLIA_ADMIN_KEY
const nodeEnv = process.env.NODE_ENV

if (!algoliaAdminKey) {
  throw new Error('ALGOLIA_ADMIN_KEY is not set')
}

const sanityClient = client({
  projectId: 'sb1i5dlc',
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false, // `false` if you want to ensure fresh data
})

const algolia = algoliasearch('78FD8NWNJK', algoliaAdminKey)

const getAlgoliaIndex = () => `sanity_content_${nodeEnv}`

async function handleSanityAlgoliaWebhook(body: WebhookBody) {
  const indexName = getAlgoliaIndex()
  const algoliaIndex = algolia.initIndex(indexName)

  const sanityAlgolia = indexer(
    {
      post: {
        index: algoliaIndex,
        projection: `{
          title,
          body,
          "authorNames": authors[].author->name,
          excerpt,
          publishedAt,
          "coverImage": coverImage.url,
          "slug": slug.current,
        }`,
      },
    },
    (document: SanityDocumentStub) => {
      switch (document._type) {
        case 'post': {
          const {
            _id,
            _rev,
            _type,
            title,
            body,
            authorNames,
            excerpt,
            publishedAt,
            coverImage,
            slug,
          } = document

          const base = {
            _id,
            _rev,
            _type,
            type: _type,
            title,
            authorNames,
            excerpt,
            publishedAt,
            coverImage,
            slug,
            path: `/blog/${slug}`,
          }

          const chunks = strip(body).split('\n\n')
          return chunks.map((text: string, index: number) => ({
            ...base,
            objectID: `${slug}-${index}`,
            text,
          }))
        }
        default:
          return document
      }
    },
    (document: SanityDocumentStub) => {
      if (document.hasOwnProperty('publishedAt')) {
        const now = new Date()
        const publishedAt = new Date(document.publishedAt)
        // published at is in the past to index the document
        return now.getTime() > publishedAt.getTime()
      }
      return true
    },
  )

  return sanityAlgolia.webhookSync(sanityClient, body)
}

export default handleSanityAlgoliaWebhook
