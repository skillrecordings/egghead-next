import axios from 'axios'

const AXIOS_PARAMS = {
  baseURL: process.env.NEXT_PUBLIC_AUTH_DOMAIN || '',
  headers: {
    Authorization: `Bearer ${process.env.EGGHEAD_ADMIN_TOKEN || ''}`,
  },
}

export const createEggAxios = () => {
  return axios.create(AXIOS_PARAMS)
}
