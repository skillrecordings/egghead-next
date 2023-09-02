import sanityClient from '@sanity/client'

export const sanityWriteClient = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_ID,
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
})
