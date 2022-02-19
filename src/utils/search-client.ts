import algoliasearch from 'algoliasearch/lite'

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP || '',
  process.env.NEXT_PUBLIC_ALGOLIA_KEY || '',
)
