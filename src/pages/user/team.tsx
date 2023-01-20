import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import {TeamTabContent} from 'components/pages/user'

const Team = () => {
  return (
    <div>
      <TeamTabContent />
    </div>
  )
}

export default Team

Team.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
