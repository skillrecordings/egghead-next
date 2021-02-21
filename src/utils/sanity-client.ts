import client from '@sanity/client'

export const sanityClient = client({
  projectId: 'sb1i5dlc',
  dataset: 'tester',
  token: process.env.NEXT_PUBLIC_SANITY_PUBLIC_KEY,
  withCredentials: true,
  useCdn: false, // `false` if you want to ensure fresh data
})
