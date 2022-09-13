import * as React from 'react'
import {loadAccount} from 'lib/accounts'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {useViewer} from 'context/viewer-context'
import RequestEmailChangeForm from 'components/users/request-email-change-form'
import {get, isEmpty, find, first} from 'lodash'
import SubscriptionDetails from 'components/users/subscription-details'
import {loadUserProgress, loadUserCompletedCourses} from 'lib/users'
import InProgressResource from 'components/pages/users/dashboard/activity/in-progress-resource'
import {convertMintoHours} from 'utils/time-utils'
import {CardResource} from 'types'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import {BadgeCheckIcon} from '@heroicons/react/solid'

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
  const [progress, setProgress] = React.useState<any>([])
  const [completionStats, setCompletionStats] = React.useState<any>({})
  const [courseCompletions, setCourseCompletions] = React.useState<any>([])
  const {email: currentEmail, accounts, providers} = viewer || {}
  const {slug} = getAccountWithSubscription(accounts)
  const isConnectedToGithub = providers?.includes('github')
  const viewerId = viewer?.id

  React.useEffect(() => {
    const loadProgressForUser = async (viewerId: number) => {
      if (viewerId) {
        const {
          progress: {data},
          completionStats,
        } = await loadUserProgress(viewerId)
        setProgress(data.filter((p: any) => !p.is_complete))
        setCompletionStats(completionStats)

        const {completeCourses} = await loadUserCompletedCourses()
        setCourseCompletions(completeCourses)
      }
    }

    loadProgressForUser(viewerId)
  }, [viewerId])

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
        <div className="flex flex-col max-w-screen-md mx-auto space-y-10 sm:space-y-16">
          {/* Account details */}
          <div className="sm:px-6 lg:px-0 lg:col-span-9">
            <div className="flex gap-4 sm:justify-between flex-wrap">
              <RequestEmailChangeForm originalEmail={currentEmail} />
              <LearnerStats completionStats={completionStats} />
            </div>
          </div>
          {/* Connect to GitHub */}
          {isConnectedToGithub ? (
            <div className="sm:px-6 lg:px-0 lg:col-span-9">
              <div className="flex flex-col space-y-2">
                <h2 className="pb-1 text-xl border-b border-gray-200 dark:border-gray-800">
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
                <h2 className="pb-1 text-xl border-b border-gray-200 dark:border-gray-800">
                  Connect to GitHub
                </h2>
                <p>Connect your GitHub account to log in with GitHub Oauth.</p>
                <div className="pt-2">
                  <GithubConnectButton authToken={authToken} />
                </div>
              </div>
            </div>
          )}
          {!isEmpty(courseCompletions) && (
            <div>
              <h2 className="pb-1 text-xl border-b border-gray-200 dark:border-gray-800">
                Completed Courses
              </h2>
              <div className="flex flex-wrap gap-4 justify-evenly">
                {courseCompletions.map(
                  ({collection}: {collection: CardResource}) => {
                    return (
                      <div className="relative mt-4">
                        <span className="absolute z-10 left-40">
                          {<BadgeCheckIcon color="green" width="1.5em" />}
                        </span>
                        <VerticalResourceCard
                          resource={collection}
                          location="user profile"
                          className="text-center w-44 flex flex-col items-center justify-center"
                        />
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          )}
          {account && (
            <SubscriptionDetails
              stripeCustomerId={account.stripe_customer_id}
              slug={slug}
            />
          )}
          {!isEmpty(progress) && (
            <div className="flex flex-col space-y-2">
              <h2 className="pb-1 text-xl border-b border-gray-200 dark:border-gray-800">
                Continue learning
              </h2>
              {progress.map((item: any) => {
                return (
                  <InProgressResource
                    key={item.slug}
                    resource={item.collection}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>
    </LoginRequired>
  )
}

const LearnerStats = ({completionStats}: any) => (
  <div className="flex flex-col space-y-2 sm:grow-0 grow">
    <h2 className="pb-1 text-xl border-b border-gray-200 dark:border-gray-800">
      Learner Stats
    </h2>
    <p>{convertMintoHours(completionStats.minutesWatched)} watched</p>
    <p>{completionStats.completedCourseCount} courses completed</p>
    <p>{completionStats.completedLessonCount} lessons completed</p>
  </div>
)

export default User
