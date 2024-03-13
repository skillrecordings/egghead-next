import {ActivityTabContent} from '@/components/pages/user'
import {cookies} from 'next/headers'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import fetchEggheadUser from '@/api/egghead/users/from-token'
import {loadUserCompletedCourses, loadUserProgress} from '@/lib/users'
import {Suspense} from 'react'

const Activity = async () => {
  const cookieStore = cookies()
  const eggheadToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value ?? ''

  const user = await fetchEggheadUser(eggheadToken, false)

  const completedCoursesLoader = loadUserCompletedCourses(eggheadToken)
  const userProgressLoader = loadUserProgress(user.id)

  return (
    <div className="w-full">
      <Suspense>
        <ActivityTabContent
          completedCoursesLoader={completedCoursesLoader}
          userProgressLoader={userProgressLoader}
        />
      </Suspense>
    </div>
  )
}

export default Activity
