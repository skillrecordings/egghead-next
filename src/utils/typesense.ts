import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import {getTypesenseNodes} from '@/utils/typesense-host'

const typesensePort = Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT) || 443

export const typsenseAdapterConfig = {
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY ?? '', // Be sure to use an API key that only allows search operations
    nearestNode: {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: typesensePort,
      protocol: 'https',
    },
    nodes: getTypesenseNodes(typesensePort),

    cacheSearchResultsForSeconds: 2 * 60,
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: 'title,description,_tags,instructor_name,contributors',
    preset: 'created_at',
  },
}

// _eval([ (type:playlist):4, (type:lesson):3, (type:podcast):2], (type:talk):1):desc,published_at_timestamp:desc,rank:asc

export const typesenseInstantsearchAdapter = () =>
  new TypesenseInstantSearchAdapter({...typsenseAdapterConfig})
export const TYPESENSE_COLLECTION_NAME =
  process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION_NAME || 'content_production'
