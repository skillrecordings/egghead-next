import AppLayout from 'components/app/layout'
import UserLayout from 'components/pages/user/components/user-layout'
import {InstructorTabContent} from 'components/pages/user'
import {GetServerSideProps} from 'next/types'
import {getAbilityFromToken} from 'server/ability'
import {ACCESS_TOKEN_KEY} from 'utils/auth'

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

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])
  console.log('ability', ability, 'canUpload', ability.can('upload', 'Video'))

  if (ability.can('upload', 'Video')) {
    return {
      props: {},
    }
  } else {
    return {
      redirect: {
        destination: '/user/membership',
        permanent: false,
      },
    }
  }
}
