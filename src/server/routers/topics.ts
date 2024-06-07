import {router, baseProcedure} from '../trpc'
import {z} from 'zod'

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const TYPESENSE = {
  apiKey: process.env.TYPESENSE_API_KEY ?? '',
  host: process.env.TYPESENSE_HOST ?? 'localhost',
  port: Number(process.env.TYPESENSE_PORT) ?? 8108,
}

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: TYPESENSE.apiKey, // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: TYPESENSE.host,
        port: TYPESENSE.port,
        protocol: 'https',
      },
    ],
    cacheSearchResultsForSeconds: 0,
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: 'title',
  },
})

const searchClient = typesenseInstantsearchAdapter.searchClient

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
      const index = searchClient.initIndex('content_production')
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
