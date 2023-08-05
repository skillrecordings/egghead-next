import * as React from 'react'
import {useViewer} from 'context/viewer-context'
import axios from 'utils/configured-axios'
import {Resource} from 'types'
import Link from 'next/link'
import Image from 'next/image'
import {reject, isEmpty} from 'lodash'
import {track} from 'utils/analytics'
import {convertTimeWithTitles} from 'utils/time-utils'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from '../../utils/auth'
import {XIcon} from '@heroicons/react/solid'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'

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

const Bookmarks: React.FunctionComponent<
  React.PropsWithChildren<LoginRequiredParams>
> = ({loginRequired}) => {
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

  const router = useRouter()

  return (
    <>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          site_name: 'egghead',
        }}
      />
      <LoginRequired loginRequired={loginRequired}>
        <div className="container w-full max-w-screen-md mt-10 mb-24 md:mt-16">
          <h1 className="mb-6 text-xl font-bold leading-tight sm:text-2xl">
            Your Bookmarks
          </h1>
          {loadingBookmarks || isEmpty(bookmarks) ? (
            <div className="text-gray-600 dark:text-gray-400">
              {loadingBookmarks
                ? 'Loading...'
                : `You haven't bookmarked any courses yet.`}
            </div>
          ) : (
            <ul className="space-y-6">
              {bookmarks.map((bookmark: any) => {
                return (
                  <li
                    className="flex items-center space-x-5"
                    key={bookmark.slug}
                  >
                    {bookmark.square_cover_128_url && (
                      <div className="flex items-center flex-shrink-0">
                        <Image
                          width={48}
                          height={48}
                          src={bookmark.square_cover_128_url}
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="flex space-x-2">
                        <Link href={bookmark.path}>
                          <a className="inline-flex items-center space-x-2 group">
                            <div className="font-medium leading-tight group-hover:underline md:text-lg text-normal">
                              {bookmark.title}
                            </div>
                          </a>
                        </Link>
                        <button
                          aria-label="remove"
                          className="p-2 text-gray-600 transition-colors duration-200 ease-in-out rounded-full hover:text-gray-900 dark:hover:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
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
                          <XIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {bookmark.duration &&
                          `${convertTimeWithTitles(bookmark.duration)} • `}
                        {bookmark.instructor.full_name}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </LoginRequired>
    </>
  )
}

export default Bookmarks
