import * as React from 'react'
import {isEmpty} from 'lodash'

import Cookies from 'js-cookie'
import {useQuery} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'

import {type Subscriber} from '../schemas/subscriber'
import {identify} from '../utils/analytics/identify'

export type ConvertkitContextType = {
  subscriber?: Subscriber
  loadingSubscriber: boolean
  refetch: () => Promise<any>
}

const defaultConvertKitContext: ConvertkitContextType = {
  loadingSubscriber: true,
  refetch: async () => {},
}

export const ConvertkitContext = React.createContext(defaultConvertKitContext)

export const ConvertkitProvider: React.FC<
  React.PropsWithChildren<{getSubscriberApiUrl?: string; learnerId?: string}>
> = ({children, learnerId}) => {
  const router = useRouter()

  const {
    data: subscriber,
    status,
    refetch,
  } = useQuery<Subscriber>([`convertkit-subscriber`, learnerId], async () => {
    const params = new URLSearchParams(window.location.search)
    const ckSubscriberId =
      params.get(CK_SUBSCRIBER_KEY) || Cookies.get('ck_subscriber_id')

    try {
      const learner = params.get('learner') || learnerId
      const subscriberLoaderParams = new URLSearchParams({
        ...(learner && {learner}),
        ...(ckSubscriberId && {ckSubscriberId}),
      })

      const subscriber = await fetch(
        `/api/skill/subscriber/convertkit?${subscriberLoaderParams}`,
      )
        .then((response) => response.json())
        .catch(() => undefined)

      identify(subscriber)

      if (!isEmpty(ckSubscriberId)) {
        if (router.asPath.match(/confirmToast=true/))
          confirmSubscriptionToast(subscriber.email_address)
        // removeQueryParamsFromRouter(router, [CK_SUBSCRIBER_KEY])
      }

      return subscriber || false
    } catch (e) {
      console.debug(`couldn't load ck subscriber cookie`)
      return false
    }
  })

  return (
    <ConvertkitContext.Provider
      value={{subscriber, loadingSubscriber: status === 'loading', refetch}}
    >
      {children}
    </ConvertkitContext.Provider>
  )
}

export function useConvertkit() {
  return React.useContext(ConvertkitContext)
}

export const confirmSubscriptionToast = (email?: string) => {
  return toast(
    () => (
      <div>
        <strong>Confirm your subscription</strong>
        <p>
          Please check your inbox{' '}
          {email && (
            <>
              (<strong>{email}</strong>)
            </>
          )}{' '}
          for an email that just got sent. Thanks and enjoy!
        </p>
      </div>
    ),
    {
      icon: '✉️',
      duration: 6000,
    },
  )
}
