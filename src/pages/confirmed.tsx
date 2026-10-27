import * as React from 'react'
import EmailConfirmation from '@/components/pages/email-confirmation'
import getTracer from '../utils/honeycomb-tracer'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src/index'
import useCio from '../hooks/use-cio'
import Link from 'next/link'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async function ({req, res, query}) {
    setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

    return {
      props: {
        to: query?.to || 'all',
      },
    }
  },
)

const Confirmed: React.FunctionComponent<
  React.PropsWithChildren<{to: string}>
> = ({to}) => {
  const {subscriber, loadingSubscriber, cioIdentify} = useCio()
  // /api/cio-subscriber only includes the email for the logged-in owner of the
  // contact, the same check /api/cio/identify uses to allow re-subscribing.
  const canResubscribe = Boolean(subscriber?.email)

  React.useEffect(() => {
    if (subscriber && canResubscribe) {
      switch (to) {
        case 'all':
          cioIdentify(subscriber.id, {
            unsubscribed: false,
          })
          break
        default:
          cioIdentify(subscriber.id, {
            [`unsubscribed_from_${to.toLowerCase()}`]: false,
          })
          break
      }
    }
  }, [subscriber])

  if (loadingSubscriber) return <EmailConfirmation>{null}</EmailConfirmation>

  if (!canResubscribe) {
    return (
      <EmailConfirmation>
        <h1>Log in to re-subscribe to emails.</h1>
        <p>
          <Link href="/login">Sign in</Link>, then open this page again.
        </p>
      </EmailConfirmation>
    )
  }

  return (
    <EmailConfirmation>
      <h1>You've confirmed your subscription to emails.</h1>
      <p>You can unsubscribe at any time.</p>
    </EmailConfirmation>
  )
}

export default Confirmed
