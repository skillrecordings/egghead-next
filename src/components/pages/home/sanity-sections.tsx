import * as React from 'react'
import {HorizontalResourceCard} from '@/components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from '@/components/card/new-vertical-resource-card'
import Topics from '@/components/pages/home/topics'
import ReactMarkdown from 'react-markdown'
import {CardResource} from '@/types'
import Grid from '@/components/grid'
import Image from 'next/legacy/image'
import Link from 'next/link'
import EggheadForTeamsCta from '@/components/pages/home/egghead-for-teams-cta'
import analytics from '@/utils/analytics'
import {SanitySectionType} from '@/pages/learn'
import {trpc} from '@/app/_trpc/client'
import {convertTimeWithTitles} from '@/utils/time-utils'
import Spinner from '@/components/spinner'
import {Balancer} from 'react-wrap-balancer'

const DynamicGridComponent = ({
  section,
  location,
  completedCoursesIds,
}: {
  section: SanitySectionType
  location?: string
  completedCoursesIds?: number[]
}) => {
  return (
    <section className="pb-16" key={section.slug}>
      {!section.image && !section.description ? (
        // simple section
        <div className="flex items-center justify-between w-full pb-6">
          <h2 className="text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
            {section.title}
          </h2>
        </div>
      ) : (
        // section with image and description
        <div className="flex flex-col items-center justify-center w-full pb-8 mb-5 md:flex-row md:items-start">
          {section.image && (
            <div className="flex-shrink-0 md:max-w-none max-w-[200px]">
              <Image
                aria-hidden
                src={section.image}
                quality={100}
                width={320}
                height={320}
                alt=""
              />
            </div>
          )}
          <div>
            <h2 className="w-full pb-4 text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
              {section.title}
            </h2>
            {section.description && (
              <ReactMarkdown className="prose-sm prose text-gray-700 sm:prose dark:prose-dark dark:text-gray-300 dark:prose-a:text-blue-300 prose-a:text-blue-500">
                {section.description}
              </ReactMarkdown>
            )}
          </div>
        </div>
      )}
      <Grid>
        {section?.resources?.map((resource: CardResource, i: number) => {
          switch (section?.resources?.length) {
            case 3:
              return i === 0 ? (
                <HorizontalResourceCard
                  className="col-span-2"
                  key={resource.id}
                  resource={resource}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              ) : (
                <VerticalResourceCard
                  key={resource.id}
                  resource={resource}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              )
            case 6:
              return i === 0 || i === 1 ? (
                <HorizontalResourceCard
                  className="col-span-2"
                  key={resource.id}
                  resource={resource}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              ) : (
                <VerticalResourceCard
                  key={resource.id}
                  resource={resource}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              )
            case 7:
              return i === 0 ? (
                <HorizontalResourceCard
                  className="col-span-2"
                  key={resource.id}
                  resource={resource}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              ) : (
                <VerticalResourceCard
                  key={resource.id}
                  resource={resource}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              )
            default:
              return (
                <VerticalResourceCard
                  key={resource.id}
                  resource={resource}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              )
          }
        })}
      </Grid>
      {section.path && (
        <div className="flex justify-end mt-3">
          <Link
            href={section.path}
            passHref
            onClick={() => {
              analytics.events.activityInternalLinkClick(
                'curated topic page',
                'home page-curated section',
                section.title,
                section.path,
              )
            }}
            className="flex items-center px-4 py-3 text-sm transition-all duration-200 ease-in-out bg-transparent border-b-2 border-gray-200 dark:border-gray-800 border-opacity-70 dark:hover:bg-gray-800 dark:hover:bg-opacity-50 opacity-80 hover:opacity-100 group"
          >
            Browse all{' '}
            <span
              className="pl-1 transition-all duration-200 ease-in-out group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      )}
    </section>
  )
}

const DynamicGridComponentWithTips = ({
  section,
  location,
  completedCoursesIds,
}: {
  section: SanitySectionType
  location?: string
  completedCoursesIds?: number[]
}) => {
  const {data, status: tipsStatus} = trpc.tips.published.useQuery({limit: 5})

  const publishedTips = data || []

  const rowOneResources = section?.resources?.slice(0, 2)
  const rowTwoResources = section?.resources?.slice(2, 8)

  return (
    <section className="pb-16" key={section.slug}>
      {!section.image && !section.description ? (
        // simple section
        <div className="flex items-center justify-between w-full pb-6">
          <h2 className="text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
            {section.title}
          </h2>
        </div>
      ) : (
        // section with image and description
        <div className="flex flex-col items-center justify-center w-full pb-8 mb-5 md:flex-row md:items-start">
          {section.image && (
            <div className="flex-shrink-0 md:max-w-none max-w-[200px]">
              <Image
                aria-hidden
                src={section.image}
                quality={100}
                width={320}
                height={320}
                alt=""
              />
            </div>
          )}
          <div>
            <h2 className="w-full pb-4 text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
              {section.title}
            </h2>
            {section.description && (
              <ReactMarkdown className="prose-sm prose text-gray-700 sm:prose dark:prose-dark dark:text-gray-300 dark:prose-a:text-blue-300 prose-a:text-blue-500">
                {section.description}
              </ReactMarkdown>
            )}
          </div>
        </div>
      )}
      <Grid>
        {rowOneResources?.map((resource: CardResource, i: number) => {
          return (
            <VerticalResourceCard
              key={resource.id}
              resource={resource}
              location={location}
              completedCoursesIds={completedCoursesIds}
            />
          )
        })}
        <div className="col-span-2 row-span-2 rounded dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth p-4 flex flex-col">
          <Link
            href="/tips"
            passHref
            onClick={() => {
              analytics.events.activityInternalLinkClick(
                'tips page',
                'home new section browse all',
                section.title,
                section.path,
              )
            }}
          >
            <h3 className="text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white hover:underline transition-all">
              Latest Tips
            </h3>
          </Link>
          <div className="h-full">
            {tipsStatus === 'loading' ? (
              <div className="flex h-full items-center justify-center ">
                <Spinner size={10} className={`text-black dark:text-white`} />
              </div>
            ) : (
              publishedTips.map((tip) => (
                <div
                  key={tip.slug}
                  className="mt-4 px-4 py-2 rounded shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50  transition-all"
                >
                  <Link href={`/tips/${tip.slug}`}>
                    <div className="flex flex-shrink-0 gap-4">
                      <div className="flex items-center flex-shrink-0 w-8">
                        {tip?.tags ? (
                          <Image
                            src={tip?.tags[0].image_url}
                            width={32}
                            height={32}
                            alt=""
                          />
                        ) : (
                          <Image
                            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1566948117/transcript-images/Eggo_Notext.png"
                            width={32}
                            height={32}
                            layout="fixed"
                            alt=""
                            className=" "
                          />
                        )}
                      </div>

                      <div>
                        <h4 className="dark:text-white text-lg  hover:underline">
                          {tip.title}
                        </h4>
                        <div className="flex gap-2 items-center pt-2">
                          <div className="flex items-center justify-center">
                            {tip?.instructor && tip?.instructor.image && (
                              <div className="w-5 h-5 overflow-hidden flex-shrink-0 rounded-full lg:w-7 lg:h-7">
                                <Image
                                  aria-hidden
                                  src={tip.instructor.image}
                                  alt={tip.instructor.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              </div>
                            )}
                            <span className="text-left pl-2 dark:text-indigo-100 text-gray-700 lg:text-sm text-[0.65rem] opacity-80 leading-none">
                              <span className="sr-only">{tip.title} by </span>
                              {tip?.instructor?.name}
                            </span>
                          </div>
                          {tip?.duration && (
                            <span className="text-xs dark:text-indigo-100 text-gray-700">
                              {convertTimeWithTitles(Math.floor(tip.duration), {
                                showSeconds: true,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end mt-3 self-end">
            <Link
              href="/tips"
              passHref
              onClick={() => {
                analytics.events.activityInternalLinkClick(
                  'tips page',
                  'home new section browse all',
                  section.title,
                  section.path,
                )
              }}
              className="flex items-center px-4 py-3 text-sm transition-all duration-200 ease-in-out bg-transparent border-b-2 border-gray-200 dark:border-gray-800 border-opacity-70 dark:hover:bg-gray-800 dark:hover:bg-opacity-50 opacity-80 hover:opacity-100 group"
            >
              Browse all tips{' '}
              <span
                className="pl-1 transition-all duration-200 ease-in-out group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </div>
        {rowTwoResources?.map((resource: CardResource, i: number) => {
          return (
            <VerticalResourceCard
              key={resource.id}
              resource={resource}
              location={location}
              completedCoursesIds={completedCoursesIds}
            />
          )
        })}
      </Grid>
      {section.path && (
        <div className="flex justify-end mt-3">
          <Link
            href={section.path}
            passHref
            onClick={() => {
              analytics.events.activityInternalLinkClick(
                'curated topic page',
                'home page-curated section',
                section.title,
                section.path,
              )
            }}
            className="flex items-center px-4 py-3 text-sm transition-all duration-200 ease-in-out bg-transparent border-b-2 border-gray-200 dark:border-gray-800 border-opacity-70 dark:hover:bg-gray-800 dark:hover:bg-opacity-50 opacity-80 hover:opacity-100 group"
          >
            Browse all{' '}
            <span
              className="pl-1 transition-all duration-200 ease-in-out group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      )}
    </section>
  )
}

const SanitySections = ({
  sections,
  location,
  completedCoursesIds,
}: {
  sections: SanitySectionType[]
  location: string
  completedCoursesIds?: number[]
}) => {
  return (
    <>
      {sections
        .filter((s: any) => s.slug !== 'jumbotron')
        .map((section: any, i: number) => {
          switch (true) {
            case section.slug === 'topics':
              return <Topics data={section} key={i} />
            case section.slug === 'new':
              return (
                <DynamicGridComponentWithTips
                  section={section}
                  key={i}
                  location={location}
                  completedCoursesIds={completedCoursesIds}
                />
              )
            case section.displayComponent === 'eggheadForTeamsCta':
              return <EggheadForTeamsCta location={location} />
          }

          return (
            <DynamicGridComponent
              section={section}
              key={i}
              location={location}
              completedCoursesIds={completedCoursesIds}
            />
          )
        })}
    </>
  )
}

export default SanitySections
