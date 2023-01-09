import * as React from 'react'
import LoginRequired from 'components/login-required'
import Invoices from 'components/invoices'

const InvoicesPage: React.FunctionComponent<any> = () => {
  return (
    <LoginRequired>
      <main className="mt-16">
        <div className="container">
          <Invoices headingAs="h1" />
        </div>
      </main>
    </LoginRequired>
  )
}

export default InvoicesPage
