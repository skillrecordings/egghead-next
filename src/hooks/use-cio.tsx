import * as React from 'react'
import queryString from 'query-string'
import {isEmpty, get} from 'lodash'
import cookie from '../utils/cookies'
import axios from 'axios'

export const CIO_KEY = 'cio_id'

export const cioIdentify = (id: string, options?: any) => {
  if (id || options?.email) {
    window._cio.identify({
      ...(!!id && {id}),
      ...options,
    })
  }
}

export type CIOSubscriber = {
  id: string
  email: string
  attributes: any
}

export const CioContext = React.createContext<{
  subscriber?: CIOSubscriber
  loadingSubscriber: boolean
  cioIdentify: (id: string, options?: any) => void
}>({loadingSubscriber: true, cioIdentify})

export const CioProvider: React.FunctionComponent = ({children}) => {
  const [subscriber, setSubscriber] = React.useState<CIOSubscriber>()
  const [loadingSubscriber, setLoadingSubscriber] = React.useState(true)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = queryString.parse(window.location.search)
      const cioSubscriberId = get(queryParams, CIO_KEY)

      if (!isEmpty(cioSubscriberId)) {
        cookie.set(CIO_KEY, cioSubscriberId)
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
        cioIdentify(data.id)
      })
      .finally(() => setLoadingSubscriber(false))
  }, [])

  return (
    <CioContext.Provider
      value={{
        subscriber,
        loadingSubscriber,
        cioIdentify: React.useCallback(cioIdentify, []),
      }}
    >
      {children}
    </CioContext.Provider>
  )
}

export default function useCio() {
  return React.useContext(CioContext)
}
