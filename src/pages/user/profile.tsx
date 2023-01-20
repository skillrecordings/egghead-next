import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import {AccountInfoTabContent} from 'components/pages/user'

const Profile = () => {
  return (
    <div>
      <AccountInfoTabContent />
    </div>
  )
}

export default Profile

Profile.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
