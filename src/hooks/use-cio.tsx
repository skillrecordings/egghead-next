import * as React from 'react'
import queryString from 'query-string'
import {isEmpty, get} from 'lodash'
import cookie from '../utils/cookies'
import axios from 'axios'

export const CioContext = React.createContext<{
  subscriber?: any
  loadingSubscriber: boolean
}>({loadingSubscriber: true})

export const CioProvider: React.FunctionComponent = ({children}) => {
  const [subscriber, setSubscriber] = React.useState()
  const [loadingSubscriber, setLoadingSubscriber] = React.useState(true)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = queryString.parse(window.location.search)
      const cioSubscriberId = get(queryParams, 'cio_id')

      if (!isEmpty(cioSubscriberId)) {
        cookie.set('cio_id', cioSubscriberId)
        console.log(window.location.pathname, document.title)
        setTimeout(() => {
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname,
          )
        }, 250)
      }
    }

    axios
      .get(`/api/cio-subscriber`)
      .then(({data}) => {
        setSubscriber(data)

        if (data.id) {
          window._cio.identify({
            id: data.id,
          })
        }
      })
      .finally(() => setLoadingSubscriber(false))
  }, [])

  return (
    <CioContext.Provider value={{subscriber, loadingSubscriber}}>
      {children}
    </CioContext.Provider>
  )
}

export default function useCio() {
  return React.useContext(CioContext)
}
