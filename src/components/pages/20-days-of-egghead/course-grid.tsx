import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import first from 'lodash/first'
import {CardResource} from 'types'
import classNames from 'classnames'
import {Textfit} from 'react-textfit'
import PlayIcon from '../courses/play-icon'
import {isBefore, add, isFuture} from 'date-fns'

type CourseGridProps = {
  data: CardResource
}

const CourseGrid: React.FC<CourseGridProps> = ({data}) => {
  const startDate = new Date('11/29/2021')
  const numberOfDays = 20
  const today = new Date()
  const calendar = new Array(numberOfDays).fill({}).map((_, i) => {
    const date = add(startDate, {days: i})
    return {
      date,
      isPublished: isBefore(date, today),
    }
  })

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 md:grid-cols-3 xl:gap-5 sm:gap-3">
        {data?.resources?.map((resource, i) => {
          if (!resource.title) return null

          const published = calendar[i].isPublished
          const LinkOrDiv: React.FC<any> = ({className, children, ...props}) =>
            published && resource.path ? (
              <Link href={resource.path}>
                <a className={className}>{children}</a>
              </Link>
            ) : (
              <div className={className}>{children}</div>
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
                <div className="flex items-center justify-center row-span-4">
                  <div className="relative flex items-center justify-center w-full xl:max-w-[180px] sm:max-w-[150px] max-w-[90px]">
                    <Image
                      src={resource.image as string}
                      alt={resource.title}
                      width={240}
                      height={240}
                      quality={100}
                      loading="eager"
                      className={`group-hover:scale-90 group-hover:opacity-90 transition-all ease-in-out duration-300 ${classNames(
                        {
                          'saturate-0 opacity-20': !published,
                        },
                      )}`}
                    />
                    {published && (
                      <div className="absolute flex items-center justify-center w-10 h-10 font-mono text-xs leading-none transition-all duration-300 ease-in-out origin-center scale-0 bg-white rounded-full opacity-0 group-hover:scale-100 bg-opacity-90 shadow-smooth group-hover:opacity-100">
                        <PlayIcon className="w-3 dark:text-gray-900" />
                      </div>
                    )}
                  </div>
                </div>
                {published && (
                  <div className="row-span-2 px-5 text-center">
                    <h4>
                      <Textfit
                        aria-hidden
                        mode="multi"
                        className="sm:h-[70px] h-[50px] font-medium text-center leading-tight flex items-center justify-center"
                        max={22}
                      >
                        {resource.title}
                      </Textfit>
                    </h4>
                    {resource.instructor && (
                      <div className="flex items-center justify-center pt-4">
                        <div className="w-5 h-5 overflow-hidden rounded-full sm:w-7 sm:h-7">
                          <Image
                            src={resource.instructor.image}
                            alt={resource.instructor.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-left pl-2 dark:text-indigo-100 text-gray-700 sm:text-sm text-[0.65rem] opacity-80 leading-none">
                          {resource.instructor.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {upcoming && (
                  <div className="absolute flex items-center justify-center w-full text-xs text-center text-gray-500 lg:bottom-9 sm:bottom-6 bottom-5 sm:text-sm leading-tighter dark:text-gray-300">
                    Check back tomorrow!
                    {/* {formatDistanceToNow(calendar[i].date, {addSuffix: true,})} */}
                  </div>
                )}
                {!published && (
                  <div className="font-mono sm:text-xs text-[0.6rem] leading-none absolute top-2 right-2 sm:w-8 sm:h-8 w-6 h-6 dark:bg-gray-800 bg-white rounded-full flex items-center justify-center border dark:border-transparent border-gray-200">
                    {i + 1}
                  </div>
                )}
              </div>
            </LinkOrDiv>
          )
        })}
      </div>
    </>
  )
}

const Header = () => {
  return (
    <header className="relative flex flex-col items-center justify-center w-full max-w-screen-xl px-5 py-24 mx-auto text-center sm:py-40">
      <h3 className="relative z-10 pb-2 text-2xl font-bold leading-none tracking-tight md:text-4xl sm:text-3xl">
        Holiday Course <br /> Release Extravaganza
      </h3>
      <p className="max-w-md pt-2 text-sm text-blue-500 opacity-90 dark:text-pink-200 sm:text-base">
        We'll be releasing 20 badass courses during the holiday season, that'll
        help you jumpstart your career in 2022
      </p>
      <Image
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637069708/egghead-next-pages/20-days-of-egghead/bg_2x.png"
        quality={100}
        layout="fill"
        objectFit="cover"
        objectPosition="50% 50%"
        alt=""
        aria-hidden
        className="pointer-events-none sm:opacity-100 opacity-20"
      />
    </header>
  )
}

export default CourseGrid
