import {router, baseProcedure} from '../trpc'
import {z} from 'zod'
import {
  typesenseInstantsearchAdapter,
  TYPESENSE_COLLECTION_NAME,
} from '@/utils/typesense'
import {logEvent} from '@/utils/structured-log'

// Lazy-init: avoid module-level crash when env vars are missing
let _searchClient: ReturnType<
  ReturnType<typeof typesenseInstantsearchAdapter>['searchClient'] & any
> | null = null
let _searchClientFailed = false

function getSearchClient() {
  if (_searchClient) return _searchClient
  if (_searchClientFailed) return null
  try {
    _searchClient = typesenseInstantsearchAdapter().searchClient
    return _searchClient
  } catch (e) {
    _searchClientFailed = true
    logEvent('error', 'topics.searchClient.init_failed', {
      error: e instanceof Error ? e.message : String(e),
    })
    return null
  }
}

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
      const searchClient = getSearchClient()
      if (!searchClient?.initIndex) {
        logEvent('warn', 'topics.top.search_unavailable', {
          topic: input?.topic ?? null,
        })
        return []
      }
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
