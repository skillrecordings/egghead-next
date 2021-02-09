import * as React from 'react'
import LoginRequired from 'components/login-required'
import {GetServerSideProps} from 'next'
import {setupHttpTracing} from '@vercel/tracing-js'
import getTracer from 'utils/honeycomb-tracer'
import axios from 'utils/configured-axios'
import Invoice from 'components/pages/invoice'
import {useRouter} from 'next/router'
import {useViewer} from '../../context/viewer-context'

const tracer = getTracer('invoices-index-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
  return {
    props: {
      transactionId: params?.stripeTransactionId,
    },
  }
}

const InvoicePage: React.FunctionComponent<any> = ({transactionId}) => {
  const all = useRouter()
  console.debug(all)
  const [transaction, setTransaction] = React.useState()
  const {viewer} = useViewer()

  console.debug(all)
  React.useEffect(() => {
    axios
      .get(`/api/stripe/transaction`, {
        params: {
          transaction_id: transactionId,
        },
      })
      .then(({data}) => setTransaction(data))
  }, [])
  return (
    <LoginRequired>
      <main className="pb-10 lg:py-3 lg:px-8">
        {transaction && viewer && (
          <Invoice transaction={transaction} viewer={viewer}></Invoice>
        )}
      </main>
    </LoginRequired>
  )
}

export default InvoicePage
