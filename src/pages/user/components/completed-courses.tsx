import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {CardResource} from 'types'
import {format} from 'date-fns'
import cx from 'classnames'

const byDate = (a: any, b: any) => (a.completed_at > b.completed_at ? -1 : 1)

const byTitle = (a: any, b: any) =>
  a.collection.title.localeCompare(b.collection.title)

const CompletedCourses: React.FC<any> = ({completeCourseData}) => {
  const [filter, setFilter] = React.useState<string>('byDate')
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
            onClick={() => setFilter('byDate')}
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
            onClick={() => setFilter('byTitle')}
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
        {[...completeCourseData]
          .sort(filter === 'byDate' ? byDate : byTitle)
          .map(
            ({
              collection,
              completed_at,
            }: {
              collection: CardResource
              completed_at: string
            }) => {
              return (
                <div
                  key={collection.slug}
                  className="flex border-b border-gray-200 dark:border-gray-800 py-3 items-center space-x-2"
                >
                  <Link href={collection.path}>
                    <a className="blok shrink-0 w-8 h-8 relative">
                      <Image
                        src={collection.image}
                        alt=""
                        objectFit="contain"
                        layout="fill"
                      />
                    </a>
                  </Link>
                  <div className="grow">
                    <Link href={collection.path}>
                      <a className="blok shrink-0 w-8 h-8 relative dark:hover:text-blue-300 hover:text-blue-700">
                        <h3 className="text-base font-bold leading-snug md:leading-tighter">
                          {collection.title}
                        </h3>
                      </a>
                    </Link>
                  </div>
                  <div className="text-xs text-gray-600 font-medium md:font-bold self-start md:self-center dark:text-white/80">
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
