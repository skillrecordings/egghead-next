import {createClient} from '@sanity/client'

export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_ID || 'production',
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_EDITOR_TOKEN,
})

export async function sanityQuery<T = any>(query: string): Promise<T> {
  return await fetch(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${
      process.env.NEXT_PUBLIC_SANITY_API_VERSION
    }/data/query/${
      process.env.NEXT_PUBLIC_SANITY_DATASET_ID
    }?query=${encodeURIComponent(query)}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${process.env.SANITY_EDITOR_TOKEN}`,
      },
      next: {revalidate: 3600},
    },
  )
    .then(async (response) => {
      const {result} = await response.json()
      return result as T
    })
    .catch((error) => {
      console.log(error)
      throw error
    })
}

export async function sanityMutation(mutations: any[]) {
  return await fetch(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${process.env.NEXT_PUBLIC_SANITY_API_VERSION}/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET_ID}`,
    {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${process.env.SANITY_EDITOR_TOKEN}`,
      },
      body: JSON.stringify({mutations}),
    },
  ).then((response) => response.json())
}
