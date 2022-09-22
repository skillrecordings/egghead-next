import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {format} from 'date-fns'
import {isEmpty} from 'lodash'

import Eggo from 'components/icons/eggo'
import WidgetWrapper from 'components/pages/user/components/widget-wrapper'
import Spinner from 'components/spinner'

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

const CompletedCourses: React.FC<{
  completeCourseData: CourseData[]
  completedCourseStatus: 'loading' | 'success' | 'error'
}> = ({completeCourseData = [], completedCourseStatus}) => {
  return (
    <WidgetWrapper title="Completed Courses">
      {completedCourseStatus === 'loading' ? (
        <div className="relative flex justify-center">
          <Spinner className="w-6 h-6 text-gray-600" />
        </div>
      ) : completedCourseStatus === 'error' ? (
        <span>There was an error fetching stats</span>
      ) : completeCourseData.length === 0 ? (
        <span>You haven't finished any courses yet</span>
      ) : (
        <div className="max-h-[400px] md:max-h-[570px] overscroll-contain overflow-y-auto">
          {completeCourseData.map(
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
                  className="flex border-b border-gray-200 dark:border-gray-800 py-3 items-center space-x-2 pr-3 first:pt-0 last:pb-0 last:border-0"
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
      )}
    </WidgetWrapper>
  )
}

export default CompletedCourses
