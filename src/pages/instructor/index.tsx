import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import {InstructorTabContent} from 'components/pages/user'

const Instructor = () => {
  return (
    <div className="w-full h-full">
      <InstructorTabContent />
    </div>
  )
}

export default Instructor

Instructor.getLayout = function getLayout(Page: any, pageProps: any) {
  return (
    <AppLayout>
      <UserLayout>
        <Page {...pageProps} />
      </UserLayout>
    </AppLayout>
  )
}
