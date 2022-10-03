import * as React from 'react'
import {find, first} from 'lodash'

import {useViewer} from 'context/viewer-context'
import {loadAccount} from 'lib/accounts'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'

import {
  ActivityTabContent,
  AccountInfoTabContent,
  BookmarksTabContent,
} from 'components/pages/user'

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

const User: React.FunctionComponent<
  LoginRequiredParams & {account: ViewerAccount}
> = () => {
  const [account, setAccount] = React.useState<ViewerAccount>()
  const {viewer, authToken} = useViewer()
  const {accounts} = viewer || {}
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

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const [currentTab, setCurrentTab] = React.useState<string>('Activity')

  return (
    <LoginRequired>
      <main className="container">
        <main className="flex-1">
          <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
            <div className="pt-10 pb-16">
              <div className="px-4 sm:px-6 md:px-0">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Hello, {viewer?.full_name || viewer?.username}!
                </h1>
              </div>
              <div className="px-4 sm:px-6 md:px-0">
                <div className="mt-6">
                  <div className="md:hidden">
                    <label htmlFor="selected-tab" className="sr-only">
                      Select a tab
                    </label>
                    <select
                      id="selected-tab"
                      name="selected-tab"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-600 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      defaultValue={
                        tabs.find((tab) => tab.label === currentTab)?.label
                      }
                      onChange={(e) => {
                        setCurrentTab(e.target.value)
                      }}
                    >
                      {tabs.map((tab) => (
                        <option key={tab.label}>{tab.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden md:block">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                          <button
                            key={tab.label}
                            className={classNames(
                              tab.label === currentTab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 dark:text-white/70 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white duration-150',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                            )}
                            onClick={() => setCurrentTab(tab.label)}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  <div className="mt-10">
                    {tabs.find((tab) => tab.label === currentTab)?.component}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </main>
    </LoginRequired>
  )
}

export default User

const tabs = [
  {label: 'Activity', component: <ActivityTabContent />},
  // {
  //   label: 'Membership',
  //   component: () => {
  //     return (
  //       <div>
  //         <div>Membership</div>
  //       </div>
  //     )
  //   },
  // },
  {label: 'Bookmarks', component: <BookmarksTabContent />},
  {label: 'Account Info', component: <AccountInfoTabContent />},
  // {
  //   label: 'Payment',
  //   component: () => {
  //     return (
  //       <div>
  //         <div>Payment</div>
  //       </div>
  //     )
  //   },
  // },
]
