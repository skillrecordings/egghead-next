import * as React from 'react'
import {useViewer} from 'context/viewer-context'
import axios from 'utils/configured-axios'
import {Resource} from 'types'
import Link from 'next/link'
import Image from 'next/image'
import {reject, isEmpty} from 'lodash'
import {track} from 'utils/analytics'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from '../../utils/auth'
import {loadAccount} from '../../lib/accounts'

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  params,
}) {
  const {loginRequired} = getTokenFromCookieHeaders(
    req.headers.cookie as string,
  )

  return {
    props: {
      loginRequired,
    },
  }
}

const Bookmarks: React.FunctionComponent<LoginRequiredParams> = ({
  loginRequired,
}) => {
  const {viewer} = useViewer()
  const [bookmarks, setBookmarks] = React.useState([])
  const [loadingBookmarks, setLoadingBookmarks] = React.useState(true)
  const watchLaterUrl = viewer?.watch_later_bookmarks_url

  React.useEffect(() => {
    setLoadingBookmarks(true)
    if (watchLaterUrl) {
      axios
        .get(watchLaterUrl)
        .then(({data}) => {
          setBookmarks(data.items)
        })
        .finally(() => setLoadingBookmarks(false))
    }
  }, [watchLaterUrl])

  return (
    <LoginRequired loginRequired={loginRequired}>
      <div className="mb-32 max-w-screen-md w-full mx-auto">
        <h1 className="sm:text-3xl text-xl font-bold mb-3 leading-tight">
          Your Bookmarks
        </h1>
        {loadingBookmarks || isEmpty(bookmarks) ? (
          <div>
            {loadingBookmarks
              ? 'loading...'
              : `You don't have any content bookmarked to watch later.`}
          </div>
        ) : (
          <ul className="space-y-5">
            {bookmarks.map((bookmark: any) => {
              return (
                <li className="flex items-center space-x-2" key={bookmark.slug}>
                  {bookmark.square_cover_128_url && (
                    <div className="flex items-center flex-shrink-0">
                      <Image
                        width={32}
                        height={32}
                        src={bookmark.square_cover_128_url}
                      />
                    </div>
                  )}
                  <Link href={bookmark.path}>
                    <a className="group inline-flex items-center space-x-2">
                      <div className="group-hover:underline font-medium md:text-lg text-normal leading-tight">
                        {bookmark.title}
                      </div>
                    </a>
                  </Link>
                  <button
                    className="rounded text-xs px-2 py-1 justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out "
                    onClick={(e) => {
                      e.preventDefault()
                      axios.post(bookmark.toggle_favorite_url)
                      const lessBookmarks = reject(bookmarks, {
                        slug: bookmark.slug,
                      }) as []
                      track('removed bookmark', {
                        resource: bookmark.slug,
                      })
                      setBookmarks(lessBookmarks)
                    }}
                  >
                    remove
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </LoginRequired>
  )
}

export default Bookmarks
