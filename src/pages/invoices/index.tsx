import * as React from 'react'
import LoginRequired from '@/components/login-required'
import Invoices from '@/components/invoices'

const InvoicesPage: React.FunctionComponent<
  React.PropsWithChildren<any>
> = () => {
  return (
    <LoginRequired>
      <div className="min-h-[75vh] mx-auto">
        <Invoices headingAs="h1" />
      </div>
    </LoginRequired>
  )
}

export default InvoicesPage
