import * as React from 'react'

import {find, first} from 'lodash'
import {loadAccount} from 'lib/accounts'
import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import SubscriptionDetails from 'components/pages/user/components/subscription-details'

import {useViewer} from 'context/viewer-context'
import {
  AvatarForm,
  RequestEmailChangeForm,
  // RequestNameChangeForm,
} from '../components'

type ViewerAccount = {
  stripe_customer_id: string
  slug: string
  subscriptions: any[]
}

function getAccountWithSubscription(accounts: ViewerAccount[]) {
  return (
    find<ViewerAccount>(
      accounts,
      (account: ViewerAccount) => account.subscriptions?.length > 0,
    ) ||
    first<ViewerAccount>(accounts) || {slug: ''}
  )
}

const AccountInfoTabContent: React.FC<any> = () => {
  const {viewer, authToken, loading} = useViewer()
  const {email: currentEmail, accounts, providers} = viewer || {}
  const isConnectedToGithub = providers?.includes('github')
  const [account, setAccount] = React.useState<ViewerAccount>()
  const {slug} = getAccountWithSubscription(accounts)
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
    <div className="space-y-10 md:space-y-14 xl:space-y-16">
      <ItemWrapper title="Email address">
        <RequestEmailChangeForm originalEmail={currentEmail} />
      </ItemWrapper>
      {/* <ItemWrapper title="Preferred Name">
        <RequestNameChangeForm originalEmail={currentEmail} />
      </ItemWrapper> */}
      <ItemWrapper title="Avatar">
        <AvatarForm avatarUrl={viewer.avatar_url} />
      </ItemWrapper>
      <ItemWrapper
        title={
          isConnectedToGithub
            ? 'Your Account is Connected to Github'
            : 'Connect to GitHub'
        }
      >
        {isConnectedToGithub ? (
          <p>You are able to login to egghead using your Github account!</p>
        ) : (
          <>
            <p>Connect your GitHub account to log in with GitHub Oauth.</p>
            <div className="mt-2">
              <GithubConnectButton authToken={authToken} />
            </div>
          </>
        )}
      </ItemWrapper>
      <ItemWrapper title="Subscription">
        {account && (
          <SubscriptionDetails
            stripeCustomerId={account.stripe_customer_id}
            slug={slug}
          />
        )}
      </ItemWrapper>
    </div>
  )
}

export default AccountInfoTabContent

const GithubConnectButton: React.FunctionComponent<{
  authToken: string
}> = ({authToken}) => {
  return (
    <a
      href={`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/users/github_passthrough?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&auth_token=${authToken}`}
      className="inline-block px-4 py-3 text-white bg-blue-600 border-0 rounded focus:outline-none hover:bg-blue-700"
    >
      Connect your GitHub account
    </a>
  )
}

// import {loadAccount} from 'lib/accounts'
// function getAccountWithSubscription(accounts: ViewerAccount[]) {
//   return (
//     find<ViewerAccount>(
//       accounts,
//       (account: ViewerAccount) => account.subscriptions?.length > 0,
//     ) ||
//     first<ViewerAccount>(accounts) || {slug: ''}
//   )
// }

// const [account, setAccount] = React.useState<ViewerAccount>()
// const {authToken} = useViewer()
// const {accounts} = viewer || {}
// const {slug} = getAccountWithSubscription(accounts)

// React.useEffect(() => {
//   const loadAccountForSlug = async (slug: string) => {
//     if (slug) {
//       const account: any = await loadAccount(slug, authToken)
//       setAccount(account)
//     }
//   }
//   loadAccountForSlug(slug)
// }, [slug, authToken])
