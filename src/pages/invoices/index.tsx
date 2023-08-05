import * as React from 'react'
import LoginRequired from 'components/login-required'
import Invoices from 'components/invoices'

const InvoicesPage: React.FunctionComponent<
  React.PropsWithChildren<any>
> = () => {
  return (
    <LoginRequired>
      <Invoices headingAs="h1" />
    </LoginRequired>
  )
}

export default InvoicesPage
