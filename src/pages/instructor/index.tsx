import AppLayout from '@/components/app/layout'
import UserLayout from '@/components/pages/user/components/user-layout'
import {GetServerSideProps} from 'next/types'
import {withSSRLogging} from '@/lib/logging'
import {getAbilityFromToken} from '@/server/ability'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'

const Instructor = () => {
  return (
    <>
      <div className="sm:h-[50vh] md:w-[75ch] mx-auto">
        <div className="w-full mt-8 leading-relaxed text-center place-items-center">
          <h3 className="text-xl font-medium text-center">
            🛠 course building functionality is under construction
          </h3>
          <p className="max-w-lg mx-auto mt-4">
            If you are trying to create or update a course, visit the{' '}
            <a
              href="https://app.egghead.io/production"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              current production page
            </a>{' '}
            or reach out in your instructor channel with any questions you might
            have.
          </p>
        </div>
      </div>
    </>
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

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async function ({req}) {
    const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

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
  },
)
