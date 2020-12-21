import axios from 'axios'
import {getAuthorizationHeader} from './auth'

axios.interceptors.request.use(
  function (config) {
    const headers = {...config.headers, ...getAuthorizationHeader()}

    return {...config, headers}
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default axios
