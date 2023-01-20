import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import {ActivityTabContent} from 'components/pages/user'

const Activity = () => {
  return (
    <div>
      <ActivityTabContent />
    </div>
  )
}

export default Activity

Activity.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
