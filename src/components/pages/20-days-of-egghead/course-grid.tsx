import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {CardResource} from 'types'
import classNames from 'classnames'
import {Textfit} from 'react-textfit'
import PlayIcon from '../courses/play-icon'
import {isBefore, add, isFuture} from 'date-fns'
import {useTheme} from 'next-themes'
import first from 'lodash/first'

type CourseGridProps = {
  data: CardResource
}

const CourseGrid: React.FC<CourseGridProps> = ({data}) => {
  const {resolvedTheme} = useTheme()
  const startDate = new Date('12/01/2021')
  const numberOfDays = 20
  const calendar = new Array(numberOfDays).fill({}).map((_, i) => {
    const date = add(startDate, {days: i})
    return {
      date,
      isPublished: isBefore(date, new Date()),
    }
  })

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-5 gap-3">
      {data?.resources?.map((resource, i) => {
        if (!resource.title) return null

        const published = calendar[i].isPublished
        const LinkOrDiv: React.FC<any> = ({className, children, ...props}) =>
          published && resource.path ? (
            <Link href={resource.path}>
              <a className={className}>{children}</a>
            </Link>
          ) : (
            <article className={className}>{children}</article>
          )
        const upcoming =
          !isFuture(startDate) &&
          first(calendar.filter((day) => !day.isPublished))?.date ===
            calendar[i].date

        return (
          <LinkOrDiv
            key={resource.id}
            className={`rounded-md aspect-w-3 aspect-h-4 h-full w-full transition-all ease-in-out duration-200 relative overflow-hidden 
            ${classNames({
              'group dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 ':
                published,
              'dark:bg-gray-1000 bg-gray-50 dark:bg-opacity-50 border-2 border-dotted border-collapse dark:border-gray-800 border-gray-200':
                !published,
            })}`}
          >
            <div className="grid grid-rows-7">
              <header className="row-span-4 flex items-center justify-center">
                <div className="relative flex items-center justify-center w-full xl:max-w-none lg:max-w-[150px] sm:max-w-[150px] max-w-none">
                  <Image
                    src={
                      published && resource.image
                        ? (resource.image as string)
                        : resolvedTheme === 'light'
                        ? 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637086767/egghead-next-pages/20-days-of-egghead/questionmark-light_2x.png'
                        : 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637086767/egghead-next-pages/20-days-of-egghead/questionmark-dark_2x.png'
                    }
                    alt={resource.title}
                    width={180}
                    height={180}
                    quality={100}
                    loading="eager"
                    className="group-hover:scale-90 group-hover:opacity-90 transition-all ease-in-out duration-300"
                  />
                  {published && (
                    <div className="origin-center group-hover:scale-100 scale-0 font-mono text-xs leading-none absolute w-10 h-10 bg-white bg-opacity-90 shadow-smooth rounded-full flex items-center justify-center duration-300 group-hover:opacity-100 opacity-0 transition-all ease-in-out">
                      <PlayIcon className="w-3 dark:text-gray-900" />
                    </div>
                  )}
                </div>
              </header>
              {published && (
                <main className="row-span-2 text-center px-5">
                  <h4>
                    <Textfit
                      mode="multi"
                      className="h-[70px] font-medium text-center leading-tight flex items-center justify-center"
                      max={20}
                    >
                      {resource.title}
                    </Textfit>
                  </h4>
                  {resource.instructor && (
                    <div className="flex items-center justify-center leading-none text-sm opacity-80 pt-4">
                      <Image
                        src={resource.instructor.image}
                        alt={resource.instructor.name}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span className="pl-2 dark:text-indigo-100 text-gray-700">
                        {resource.instructor.name}
                      </span>
                    </div>
                  )}
                </main>
              )}
              {upcoming && (
                <footer className="absolute bottom-6 text-center w-full flex text-sm items-center justify-center dark:text-gray-200 text-gray-500">
                  Out tomorrow
                  {/* {formatDistanceToNow(calendar[i].date, {addSuffix: true,})} */}
                </footer>
              )}
              {!published && (
                <div className="font-mono text-xs leading-none absolute top-2 right-2 w-8 h-8 dark:bg-gray-800 bg-white rounded-full flex items-center justify-center border dark:border-transparent border-gray-200">
                  {i + 1}
                </div>
              )}
            </div>
          </LinkOrDiv>
        )
      })}
    </div>
  )
}

export default CourseGrid
