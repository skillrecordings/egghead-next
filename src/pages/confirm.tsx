import * as React from 'react'
import EmailConfirmation from 'components/pages/email-confirmation'

const Confirm: React.FunctionComponent = () => {
  return (
    <EmailConfirmation>
      <h1>Please check your inbox to confirm your email.</h1>
      <p>
        If you have any trouble, you can email <code>support@egghead.io</code>{' '}
        for help at any time.
      </p>
    </EmailConfirmation>
  )
}

export default Confirm
