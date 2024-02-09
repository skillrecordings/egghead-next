import * as React from 'react'
import LoginRequired from '@/components/login-required'
import Invoices from '@/components/invoices'
import {NextSeo} from 'next-seo'

const InvoicesPage: React.FunctionComponent<
  React.PropsWithChildren<any>
> = () => {
  return (
    <>
      <NextSeo noindex={true} />
      <LoginRequired>
        <Invoices headingAs="h1" />
      </LoginRequired>
    </>
  )
}

export default InvoicesPage
