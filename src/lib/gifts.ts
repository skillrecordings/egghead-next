import axios from 'axios'

const eggAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
})

export async function getGift(guid: string, token: string) {
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const gift = await eggAxios
    .get(`/api/v1/gifts/${guid}`, {
      headers: {
        ...authorizationHeader,
      },
    })
    .then(({data}) => data)
  return gift
}
