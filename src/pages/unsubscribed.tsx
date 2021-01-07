import * as React from 'react'
import EmailConfirmation from 'components/pages/email-confirmation'
import getTracer from '../utils/honeycomb-tracer'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import useCio from '../hooks/use-cio'
import Link from 'next/link'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  return {
    props: {
      from: params?.from || 'all',
    },
  }
}

const Unsubscribed: React.FunctionComponent<{from: string}> = ({from}) => {
  const {subscriber, cioIdentify} = useCio()

  React.useEffect(() => {
    if (subscriber) {
      switch (from) {
        case 'all':
          cioIdentify(subscriber.id, {
            unsubscribed: true,
          })
          break
        default:
          cioIdentify(subscriber.id, {
            [`unsubscribed_from_${from.toLowerCase()}`]: true,
          })
          break
      }
    }
  }, [subscriber])
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
    </EmailConfirmation>
  )
}

export default Unsubscribed
