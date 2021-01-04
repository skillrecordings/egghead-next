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
      <div className="mb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Your Bookmarks</h1>
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
                  <li key={bookmark.slug}>
                    <Link href={bookmark.path}>
                      <a>
                        <div className="flex items-center space-x-2">
                          <Image
                            width={32}
                            height={32}
                            src={bookmark.square_cover_128_url}
                          />
                          <div>{bookmark.title}</div>
                          <button
                            className="rounded text-xs px-2 py-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out "
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
                        </div>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </LoginRequired>
  )
}

export default Bookmarks
