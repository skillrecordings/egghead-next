import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {format} from 'date-fns'
import cx from 'classnames'
import {isEmpty} from 'lodash'

import Eggo from 'components/icons/eggo'

type Collection = {
  image: string
  path: string
  slug: string
  title: string
}

type CourseData = {
  collection: Collection
  completed_at: string
  is_complete: boolean
  lesson_count: number
}

const byDate = (a: CourseData, b: CourseData) => {
  return a?.completed_at > b?.completed_at ? -1 : 1
}

const byTitle = (a: CourseData, b: CourseData) => {
  return a?.collection?.title > b?.collection?.title ? 1 : -1
}

const CompletedCourses: React.FC<{completeCourseData: CourseData[]}> = ({
  completeCourseData = [],
}) => {
  const [courseData, setCourseData] = React.useState<CourseData[] | []>(
    completeCourseData,
  )
  const [filter, setFilter] = React.useState<string>('byDate')

  if (!completeCourseData) {
    return null
  }

  if (completeCourseData.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center pb-1 text-xl border-b border-gray-200 dark:border-gray-800">
          <h2>Completed Courses</h2>
        </div>
        <p className="text-center mt-6">
          You haven't finished any courses yet, pick up where you left off 👇
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center pb-1 text-xl border-b border-gray-200 dark:border-gray-800">
        <h2>Completed Courses</h2>
        <div className="flex space-x-2 text-sm items-center">
          <span className="font-bold hidden dark:text-white md:block">
            Sort by:
          </span>
          <span className="font-bold sm:hidden dark:text-white">By:</span>
          <button
            onClick={() => {
              setFilter('byDate')
              setCourseData([...courseData].sort(byDate))
            }}
            className={cx('rounded-md text-sm border  py-1 px-2 leading-none', {
              'border-blue-600 bg-blue-600 text-white cursor-default':
                filter === 'byDate',
              'border-gray-200 dark:border-gray-100 bg-gray-100 dark:text-black':
                filter === 'byTitle',
            })}
          >
            date
          </button>
          <button
            onClick={() => {
              setFilter('byTitle')
              setCourseData([...courseData].sort(byTitle))
            }}
            className={cx('rounded-md text-sm border py-1 px-2 leading-none', {
              'border-gray-200 dark:border-gray-100 bg-gray-100 dark:text-black':
                filter === 'byDate',
              'border-blue-600 bg-blue-600 text-white cursor-default':
                filter === 'byTitle',
            })}
          >
            title
          </button>
        </div>
      </div>
      <div className="mt-3 max-h-[400px] md:max-h-[570px] overscroll-contain overflow-y-auto">
        {courseData.map(
          ({
            collection,
            completed_at,
          }: {
            collection: Collection
            completed_at: string
          }) => {
            if (isEmpty(collection)) {
              return null
            }
            return (
              <div
                key={collection.slug}
                className="flex border-b border-gray-200 dark:border-gray-800 py-3 items-center space-x-2 pr-3"
              >
                <Link href={collection?.path || '/'}>
                  <a className="blok shrink-0 w-8 h-8 relative">
                    {collection?.image ? (
                      <Image
                        src={collection.image}
                        alt=""
                        objectFit="contain"
                        layout="fill"
                      />
                    ) : (
                      <Eggo className="w-8" />
                    )}
                  </a>
                </Link>
                <div className="grow">
                  <Link href={collection?.path || '/'}>
                    <a className="blok shrink-0 w-8 h-8 relative dark:hover:text-blue-300 hover:text-blue-700 duration-100">
                      {collection?.title && (
                        <h3 className="text-base font-bold leading-snug md:leading-tighter">
                          {collection.title}
                        </h3>
                      )}
                    </a>
                  </Link>
                </div>
                <div className="text-xs text-gray-600 self-start md:self-center dark:text-gray-400">
                  <span className="hidden sm:inline">Completed on</span>{' '}
                  {format(new Date(completed_at), 'yyyy/MM/dd')}
                </div>
              </div>
            )
          },
        )}
      </div>
    </div>
  )
}

export default CompletedCourses
