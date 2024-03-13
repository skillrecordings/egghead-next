import UserLayout from '@/components/pages/user/components/user-layout'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {cookies} from 'next/headers'
import fetchEggheadUser from '@/api/egghead/users/from-token'

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
    <UserLayout
      isTeamAccountOwner={isTeamAccountOwner}
      isInstructor={user.is_instructor}
    >
      {children}
    </UserLayout>
  )
}
