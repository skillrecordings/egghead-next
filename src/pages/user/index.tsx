import * as React from 'react'
import {loadAccount} from 'lib/accounts'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {useViewer} from 'context/viewer-context'
import RequestEmailChangeForm from 'components/users/request-email-change-form'
import get from 'lodash/get'
import SubscriptionDetails from 'components/users/subscription-details'

type ViewerAccount = {
  stripe_customer_id: string
  slug: string
}

const User: React.FunctionComponent<
  LoginRequiredParams & {account: ViewerAccount}
> = () => {
  const [account, setAccount] = React.useState<any>({})
  const {stripe_customer_id} = account
  const {viewer, authToken} = useViewer()

  const {email: currentEmail, accounts} = viewer || {}
  const {slug} = get(accounts, '[0]', {})

  React.useEffect(() => {
    const loadAccountForSlug = async (slug: undefined | string) => {
      if (slug) {
        const account: any = await loadAccount(slug, authToken)
        setAccount(account)
      }
    }

    loadAccountForSlug(slug)
  }, [slug, authToken])

  return (
    <LoginRequired>
      <main className="pb-10 lg:py-3 lg:px-8">
        <div className="max-w-screen-md mx-auto">
          {/* Account details */}
          <div className="sm:px-6 lg:px-0 lg:col-span-9">
            <RequestEmailChangeForm originalEmail={currentEmail} />
          </div>
          <SubscriptionDetails
            stripeCustomerId={stripe_customer_id}
            slug={slug}
          />
        </div>
      </main>
    </LoginRequired>
  )
}

export default User
