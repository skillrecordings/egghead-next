'use client'
import * as React from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {reject, isEmpty} from 'lodash'
import {XIcon} from '@heroicons/react/solid'
import CheckIcon from '@/components/icons/check'

import axios from '@/utils/configured-axios'
import {track} from '@/utils/analytics'
import {convertTimeWithTitles} from '@/utils/time-utils'
import {LoginRequiredParams} from '@/components/login-required'
import Eggo from '@/components/icons/eggo'
import {trpc} from '@/app/_trpc/client'

type BookmarkProps = LoginRequiredParams & {
  bookmarks: any
}

const Bookmark: React.FunctionComponent<React.PropsWithChildren<any>> = ({
  bookmark,
  bookmarks,
  setBookmarks,
}) => {
  const {data: courseProgress} = trpc.progress.forPlaylist.useQuery({
    slug: bookmark.slug,
  })
  const isCourseCompleted = courseProgress?.is_complete
  return (
    <>
      {bookmark?.path ? (
        <Link href={bookmark.path} className="blok shrink-0 w-8 h-8 relative">
          {bookmark?.square_cover_128_url ? (
            <Image
              src={bookmark.square_cover_128_url}
              alt=""
              objectFit="contain"
              layout="fill"
            />
          ) : (
            <Eggo className="w-8" />
          )}
        </Link>
      ) : (
        <Eggo className="w-8 shrink-0" />
      )}
      <div className="grow">
        <div className="flex space-x-2 w-full justify-between">
          <Link
            href={bookmark.path}
            className="inline-flex items-center space-x-2 group"
          >
            <div className="font-medium leading-tight group-hover:underline md:text-lg text-normal">
              {bookmark.title}
            </div>
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
          <div className="text-gray-600 text-sm dark:text-gray-400">
            {bookmark.duration &&
              `${convertTimeWithTitles(bookmark.duration)} • `}
            {bookmark.instructor.full_name}
          </div>
          {courseProgress && (
            <div className="text-xs sm:text-sm sm:space-x-1 flex items-center text-gray-600 dark:text-white mt-1/2 sm:mt-0">
              <span className="hidden sm:inline">•</span>
              {isCourseCompleted ? (
                <>
                  <span
                    title="Course completed"
                    className=" text-green-500 mr-1"
                  >
                    <CheckIcon className="translate-x-0 w-5 h-5" />
                  </span>
                  <span className="opacity-80 dark:opacity-30">Completed</span>
                </>
              ) : (
                <span className="opacity-80 dark:opacity-30">
                  (watched {courseProgress.completed_lesson_count} from{' '}
                  {courseProgress.lesson_count} lessons)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const BookmarksList: React.FunctionComponent<
  React.PropsWithChildren<BookmarkProps>
> = ({bookmarks}) => {
  const [currentBookmarks, setBookmarks] = React.useState(bookmarks)

  return (
    <>
      {isEmpty(currentBookmarks) ? (
        <div className="text-gray-600 dark:text-gray-400">
          You haven't bookmarked any courses yet.
        </div>
      ) : (
        <ul>
          {currentBookmarks.map((bookmark: any) => {
            return (
              <li
                key={bookmark.slug}
                className="flex border-b border-gray-200 dark:border-gray-700 items-center space-x-2 last:border-0 py-3 first:pt-0 last:pb-0"
              >
                <Bookmark
                  bookmark={bookmark}
                  bookmarks={bookmarks}
                  setBookmarks={setBookmarks}
                />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default BookmarksList
