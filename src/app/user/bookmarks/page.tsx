import fetchEggheadUser from '@/api/egghead/users/from-token'
import {BookmarksTabContent} from '@/components/pages/user'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {cookies} from 'next/headers'
import {Suspense} from 'react'

const Bookmarks = async () => {
  const cookieStore = cookies()
  const eggheadToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value ?? ''

  const user = await fetchEggheadUser(eggheadToken, false)
  const bookmarkLoader = fetch(user.watch_later_bookmarks_url, {
    headers: {
      Authorization: `Bearer ${eggheadToken}`,
    },
  }).then((res) => res.json())

  return (
    <div className="min-h-[20rem] w-full">
      <Suspense>
        <BookmarksTabContent bookmarkLoader={bookmarkLoader} />
      </Suspense>
    </div>
  )
}

export default Bookmarks
