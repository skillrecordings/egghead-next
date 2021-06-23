import axios from 'axios'

export const requestContactGuid = (email: string) => {
  return axios
    .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/contacts`, {
      email,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    })
    .then(({data}) => data)
}
