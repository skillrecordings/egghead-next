export async function sanityMutation(mutations: any[]) {
  return await fetch(
    `https://${process.env.SANITY_STUDIO_PROJECT_ID}.api.sanity.io/v${process.env.SANITY_STUDIO_API_VERSION}/data/mutate/${process.env.SANITY_STUDIO_DATASET}`,
    {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
      body: JSON.stringify({mutations}),
    },
  ).then((response) => response.json())
}

export async function sanityQuery<T = any>(
  query: string,
  useCdn: boolean = true,
): Promise<T> {
  return await fetch(
    `https://${process.env.SANITY_STUDIO_PROJECT_ID}.${
      useCdn ? 'apicdn' : 'api'
    }.sanity.io/v${process.env.SANITY_STUDIO_API_VERSION}/data/query/${
      process.env.SANITY_STUDIO_DATASET
    }?query=${encodeURIComponent(query)}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
      next: {revalidate: 10},
    },
  )
    .then(async (response) => {
      const {result} = await response.json()
      return result as T
    })
    .catch((error) => {
      console.error(error)
      throw error
    })
}
