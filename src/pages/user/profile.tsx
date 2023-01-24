import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import {ProfileTabContent} from 'components/pages/user'

const Profile = () => {
  return (
    <div className="w-full">
      <ProfileTabContent />
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
