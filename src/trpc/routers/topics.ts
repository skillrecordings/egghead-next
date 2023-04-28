import {router, baseProcedure} from '../trpc.server'
import algoliasearchLite from 'algoliasearch/lite'

import {z} from 'zod'

const fullTextSearch = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP || '',
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_KEY || '',
}

const ALGOLIA_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'content_production'

const searchClient = algoliasearchLite(
  fullTextSearch.appId,
  fullTextSearch.searchApiKey,
)

export const topicRouter = router({
  top: baseProcedure
    .input(
      z
        .object({
          topic: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({input, ctx}) => {
      const index = searchClient.initIndex(ALGOLIA_INDEX_NAME)
      // top 10 free playlists for a topic
      const filters = `access_state:free AND type:playlist ${
        input?.topic ? ` AND _tags:${input.topic}` : ''
      }`
      const {hits} = await index.search(input?.topic || '', {
        hitsPerPage: 10,
        filters,
      })
      return hits
    }),
})
