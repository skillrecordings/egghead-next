import * as React from 'react'
import {loadAccount} from 'lib/accounts'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {useViewer} from 'context/viewer-context'
import RequestEmailChangeForm from 'components/users/request-email-change-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import SubscriptionDetails from 'components/users/subscription-details'
import {loadUserProgress} from 'lib/users'
import InProgressResource from 'components/pages/users/dashboard/activity/in-progress-resource'

const GithubConnectButton: React.FunctionComponent<{
  authToken: string
}> = ({authToken}) => {
  return (
    <a
      href={`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/users/github_passthrough?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&auth_token=${authToken}`}
      className={`text-white bg-blue-600 border-0 py-3 px-4 rounded focus:outline-none hover:bg-blue-700`}
    >
      Connect your GitHub account
    </a>
  )
}

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
  const [progress, setProgress] = React.useState<any>([])

  const {email: currentEmail, accounts, providers} = viewer || {}
  const {slug} = get(accounts, '[0]', {})
  const isConnectedToGithub = providers?.includes('github')

  React.useEffect(() => {
    const loadProgressForUser = async (user_id: number) => {
      if (user_id) {
        const {data} = await loadUserProgress(user_id)
        setProgress(data)
      }
    }

    loadProgressForUser(viewer.id)
  }, [viewer?.id])

  React.useEffect(() => {
    const loadAccountForSlug = async (slug: undefined | string) => {
      if (slug) {
        const account: any = await loadAccount(slug, authToken)
        setAccount(account)
      }
    }

    loadAccountForSlug(slug)
  }, [slug, authToken])

  console.log(progress)
  return (
    <LoginRequired>
      <main className="pb-10 lg:py-3 lg:px-8">
        <div className="max-w-screen-md mx-auto flex flex-col sm:space-y-16 space-y-10">
          {/* Account details */}
          <div className="sm:px-6 lg:px-0 lg:col-span-9">
            <RequestEmailChangeForm originalEmail={currentEmail} />
          </div>
          {/* Connect to GitHub */}
          {isConnectedToGithub ? (
            <div className="sm:px-6 lg:px-0 lg:col-span-9">
              <div className="flex flex-col space-y-2">
                <h2 className="text-xl pb-1 border-b border-gray-200 dark:border-gray-800">
                  Your Account is Connected to Github
                </h2>
                <p>
                  You are able to login to egghead using your Github account!
                </p>
              </div>
            </div>
          ) : (
            <div className="sm:px-6 lg:px-0 lg:col-span-9">
              <div className="flex flex-col space-y-2">
                <h2 className="text-xl pb-1 border-b border-gray-200 dark:border-gray-800">
                  Connect to GitHub
                </h2>
                <p>Connect your GitHub account to log in with GitHub Oauth.</p>
                <div className="pt-2">
                  <GithubConnectButton authToken={authToken} />
                </div>
              </div>
            </div>
          )}
          <SubscriptionDetails
            stripeCustomerId={stripe_customer_id}
            slug={slug}
          />
          {/*{!isEmpty(progress) && (*/}
          {/*  <div className="flex flex-col space-y-2">*/}
          {/*    <h2 className="text-xl pb-1 border-b border-gray-200 dark:border-gray-800">*/}
          {/*      Continue learning*/}
          {/*    </h2>*/}
          {/*    {progress.map((item: any) => {*/}
          {/*      return (*/}
          {/*        <InProgressResource*/}
          {/*          key={item.slug}*/}
          {/*          resource={item.collection}*/}
          {/*        />*/}
          {/*      )*/}
          {/*    })}*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </main>
    </LoginRequired>
  )
}

export default User
