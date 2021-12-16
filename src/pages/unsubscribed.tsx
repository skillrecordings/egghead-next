import * as React from 'react'
import EmailConfirmation from 'components/pages/email-confirmation'
import getTracer from '../utils/honeycomb-tracer'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from 'utils/tracing-js/dist/src/index'
import useCio from '../hooks/use-cio'
import Link from 'next/link'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  query,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  return {
    props: {
      from: query?.from || 'all',
    },
  }
}

const Unsubscribed: React.FunctionComponent<{from: string}> = ({from}) => {
  const {subscriber, cioIdentify} = useCio()
  const subscriberId = subscriber?.id

  React.useEffect(() => {
    if (subscriberId) {
      switch (from) {
        case 'all':
          cioIdentify(subscriberId, {
            unsubscribed: true,
          })
          break
        default:
          cioIdentify(subscriberId, {
            [`unsubscribed_from_${from.toLowerCase()}`]: true,
          })
          break
      }
    }
  }, [subscriberId, from])

  return (
    <EmailConfirmation>
      <h1>You've been unsubscribed from {from} emails.</h1>
      <p>
        If this was a mistake{' '}
        <Link href={`/confirmed?to=${from}`}>
          <a>click here</a>
        </Link>
        .
      </p>
      <p>
        If you need additional support, please email{' '}
        <a href="mailto:support@egghead.io">support@egghead.io</a> and we will
        do everything we can to get it sorted.
      </p>
    </EmailConfirmation>
  )
}

export default Unsubscribed
