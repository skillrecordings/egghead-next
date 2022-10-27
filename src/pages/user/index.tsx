import * as React from 'react'
import cx from 'classnames'
import {useViewer} from 'context/viewer-context'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {
  ActivityTabContent,
  AccountInfoTabContent,
  BookmarksTabContent,
} from 'components/pages/user'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'

type ViewerAccount = {
  stripe_customer_id: string
  slug: string
  subscriptions: any[]
}

const User: React.FunctionComponent<
  LoginRequiredParams & {account: ViewerAccount}
> = () => {
  const {viewer} = useViewer()
  const [currentTab, setCurrentTab] = React.useState<string>('Activity')
  const router = useRouter()

  return (
    <>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          site_name: 'egghead',
        }}
      />
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
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-300 sm:text-sm"
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
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                          {tabs.map((tab) => (
                            <button
                              key={tab.label}
                              className={cx(
                                tab.label === currentTab
                                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400  cursor-default'
                                  : 'border-transparent text-gray-500 dark:text-white/70 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white',
                                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm duration-150',
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
    </>
  )
}

export default User

const tabs = [
  {label: 'Activity', component: <ActivityTabContent />},
  {label: 'Bookmarks', component: <BookmarksTabContent />},
  {label: 'Account Info', component: <AccountInfoTabContent />},
]
