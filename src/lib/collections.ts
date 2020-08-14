import axios from 'axios'

export async function loadCollection(slug: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/playlists/${slug}`

  const {data} = await axios.get(endpoint)

  return data
}
