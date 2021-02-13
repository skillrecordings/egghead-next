import axios from 'axios'

export const requestSignInEmail = (email: string) => {
  return axios
    .post(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/send_token`, {
      email,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    })
    .then(({data}) => data)
}
