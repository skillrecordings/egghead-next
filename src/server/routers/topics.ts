import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {
  typesenseInstantsearchAdapter,
  TYPESENSE_COLLECTION_NAME,
} from '@/utils/typesense'

const searchClient = typesenseInstantsearchAdapter().searchClient

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
      const index = searchClient.initIndex(TYPESENSE_COLLECTION_NAME)
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
