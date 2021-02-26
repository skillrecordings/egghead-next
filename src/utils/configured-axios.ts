import axios from 'axios'
import {getAuthorizationHeader} from './auth'

axios.interceptors.request.use(
  function (config) {
    const headers = {
      ...config.headers,
      ...getAuthorizationHeader(),
      'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID,
    }

    return {...config, headers}
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default axios
