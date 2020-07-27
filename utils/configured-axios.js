import axios from 'axios'

axios.interceptors.request.use(
  function (config) {
    const headers = {...config.headers}

    return {...config, headers}
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default axios
