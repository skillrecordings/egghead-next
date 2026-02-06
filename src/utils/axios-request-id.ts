import axios from 'axios'
import {getClientRequestId} from './request-id'

axios.interceptors.request.use(
  function (config) {
    if (typeof window !== 'undefined') {
      const requestId = getClientRequestId()
      if (requestId) {
        config.headers = {
          ...config.headers,
          'x-egghead-request-id': requestId,
        }
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)
