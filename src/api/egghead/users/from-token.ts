import axios from 'axios'
import {Viewer} from '../../../types'
const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN

export default async function fetchEggheadUser(token: string, minimal = false) {
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const current: Viewer = await axios
    .get(`${EGGHEAD_AUTH_DOMAIN}/api/v1/users/current?minimal=${minimal}`, {
      responseType: 'json',
      headers: {
        ...authorizationHeader,
      },
    })
    .then(({data}) => data)

  return current
}
