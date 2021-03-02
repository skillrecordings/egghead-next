import client from '@sanity/client'

export const sanityClient = client({
  projectId: 'sb1i5dlc',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
})
