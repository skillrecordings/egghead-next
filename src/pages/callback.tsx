import React from 'react'
import queryString from 'query-string'
import get from 'lodash/get'
import axios from 'axios'

const CallbackPage = () => {
  React.useEffect(() => {
    async function connectUser() {
      const queryHash = queryString.parse(window.location.search)
      const accessCode = get(queryHash, 'code')

      const user = await axios
        .post('/api/discord', {code: accessCode})
        .then(({data}) => data)

      console.log(user)
    }
    connectUser()
  }, [])

  return <div></div>
}

export default CallbackPage
