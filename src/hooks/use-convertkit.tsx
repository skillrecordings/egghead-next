import * as React from 'react'
import queryString from 'query-string'
import {isEmpty, get} from 'lodash'
import cookie from '../utils/cookies'
import axios from 'axios'

export const ConverkitContext = React.createContext<{
  subscriber?: any
  loadingSubscriber: boolean
}>({loadingSubscriber: true})

export const ConvertkitProvider: React.FunctionComponent = ({children}) => {
  const [subscriber, setSubscriber] = React.useState()
  const [loadingSubscriber, setLoadingSubscriber] = React.useState(true)
  React.useEffect(() => {
    // if (typeof window !== 'undefined') {
    // const queryParams = queryString.parse(window.location.search)
    // const ckSubscriberId = get(queryParams, 'ck_subscriber_id')
    // if (!isEmpty(ckSubscriberId)) {
    //   cookie.set('ck_subscriber_id', ckSubscriberId)
    //
    //   window.history.replaceState(
    //     null,
    //     document.title,
    //     window.location.pathname,
    //   )
    // }
    // }

    axios
      .get(`/api/subscriber`)
      .then(({data}) => {
        setSubscriber(data)
      })
      .finally(() => setLoadingSubscriber(false))
  }, [])

  return (
    <ConverkitContext.Provider value={{subscriber, loadingSubscriber}}>
      {children}
    </ConverkitContext.Provider>
  )
}

export default function useConvertkit() {
  return React.useContext(ConverkitContext)
}
