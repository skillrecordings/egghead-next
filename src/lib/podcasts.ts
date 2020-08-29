import axios from 'axios'

export async function loadPodcasts() {
  const endpoint = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/podcasts?per_page=100`

  const {data} = await axios.get(endpoint)

  return data
}

export async function loadPodcast(slug: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/podcasts/${slug}`

  const {data} = await axios.get(endpoint)

  return data
}
