import * as React from 'react'
import {find, first} from 'lodash'

import {useViewer} from 'context/viewer-context'
import {loadAccount} from 'lib/accounts'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'

type ViewerAccount = {
  stripe_customer_id: string
  slug: string
  subscriptions: any[]
}

function getAccountWithSubscription(accounts: ViewerAccount[]) {
  // prefer the account with a subscription, otherwise grab the first, or just
  // an empty object (which would be an error state, but possible)
  return (
    find<ViewerAccount>(
      accounts,
      (account: ViewerAccount) => account.subscriptions?.length > 0,
    ) ||
    first<ViewerAccount>(accounts) || {slug: ''}
  )
}

const User: React.FunctionComponent<
  LoginRequiredParams & {account: ViewerAccount}
> = () => {
  const [account, setAccount] = React.useState<ViewerAccount>()
  const {viewer, authToken} = useViewer()
  const {email: currentEmail, accounts, providers} = viewer || {}
  const {slug} = getAccountWithSubscription(accounts)
  const viewerId = viewer?.id

  React.useEffect(() => {
    const loadAccountForSlug = async (slug: string) => {
      if (slug) {
        const account: any = await loadAccount(slug, authToken)
        setAccount(account)
      }
    }
    loadAccountForSlug(slug)
  }, [slug, authToken])

  return (
    <LoginRequired>
      <main className="container py-5 mb-16">
        <div>it's the new user page</div>
      </main>
    </LoginRequired>
  )
}

export default User
