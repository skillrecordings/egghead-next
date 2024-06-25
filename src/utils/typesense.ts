import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

export const typesenseInstantsearchAdapter = () =>
  new TypesenseInstantSearchAdapter({
    server: {
      apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY ?? '', // Be sure to use an API key that only allows search operations
      nodes: [
        {
          host: process.env.NEXT_PUBLIC_TYPESENSE_HOST ?? 'test',
          path: '',
          port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT) ?? 8108,
          protocol: 'https',
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60,
    },
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  query_by is required.
    additionalSearchParameters: {
      query_by: 'title,description,_tags,instructor_name,contributors',
    },
  })
export const TYPESENSE_COLLECTION_NAME =
  process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME || 'content_production'

const BASE_SORT = `${TYPESENSE_COLLECTION_NAME}/sort/_eval([ (type:playlist):4, (type:lesson):3, (type:podcast):2], (type:talk):1):desc`

export const SORT_PRESETS = {
  POPULAR: `${BASE_SORT},search_research_sort:asc,rank:asc`,
  RATING: `${BASE_SORT},average_rating_out_of_5:desc,rank:asc`,
  CREATED_AT: `${BASE_SORT},published_at_timestamp:desc,rank:asc`,
  MOST_WATCHED: `${BASE_SORT},watched_count:desc,rank:asc`,
}
