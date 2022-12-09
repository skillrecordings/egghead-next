import type {ReactElement} from 'react'

import AppLayout from 'components/app/layout'
import UserLayout from './components/user-layout'
import {AccountInfoTabContent} from 'components/pages/user'

const Account = () => {
  return (
    <div>
      <AccountInfoTabContent />
    </div>
  )
}

export default Account

Account.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
