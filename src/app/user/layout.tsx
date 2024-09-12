import UserLayout from '@/components/pages/user/components/user-layout'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {cookies} from 'next/headers'
import fetchEggheadUser from '@/api/egghead/users/from-token'
import {Providers} from '../providers'
import Header from '@/components/app/header'
import Main from '@/components/app/app-main'
import Footer from '@/components/app/app-footer'
import '@/styles/index.css'

export default async function UserPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const eggheadToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value ?? ''

  const user = await fetchEggheadUser(eggheadToken, false)

  const isTeamAccountOwner = user?.memberships?.some(
    (membership: {owner: {email: string}; status: string}) => {
      return (
        membership?.owner?.email === user.email &&
        membership?.status === 'active'
      )
    },
  )

  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen">
          <Providers>
            <Header />
            <Main>
              <UserLayout
                isTeamAccountOwner={isTeamAccountOwner}
                isInstructor={user.is_instructor}
              >
                {children}
              </UserLayout>
            </Main>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  )
}
