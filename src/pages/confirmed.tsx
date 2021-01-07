import * as React from 'react'
import EmailConfirmation from 'components/pages/email-confirmation'
import getTracer from '../utils/honeycomb-tracer'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import useCio from '../hooks/use-cio'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  return {
    props: {
      to: params?.to || 'all',
    },
  }
}

const Confirmed: React.FunctionComponent<{to: string}> = ({to}) => {
  const {subscriber, cioIdentify} = useCio()

  React.useEffect(() => {
    if (subscriber) {
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
  return (
    <EmailConfirmation>
      <h1>You've confirmed your subscription to emails.</h1>
      <p>You can unsubscribe at any time.</p>
    </EmailConfirmation>
  )
}

export default Confirmed
