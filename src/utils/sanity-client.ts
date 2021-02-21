import client from '@sanity/client'

const config =
  process.env.NODE_ENV === 'development'
    ? {
        projectId: 'sb1i5dlc',
        dataset: 'tester',
        token: process.env.NEXT_PUBLIC_SANITY_PUBLIC_KEY,
        withCredentials: true,
        useCdn: false,
      }
    : {
        projectId: 'sb1i5dlc',
        dataset: 'tester',
        useCdn: true,
      }

export const sanityClient = client(config)
