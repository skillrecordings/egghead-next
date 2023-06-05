import * as React from 'react'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import Topics from 'components/pages/home/topics'
import ReactMarkdown from 'react-markdown'
import {CardResource} from 'types'
import Grid from 'components/grid'
import Image from 'next/image'
import Link from 'next/link'
import EggheadForTeamsCta from 'components/pages/home/egghead-for-teams-cta'
import analytics from 'utils/analytics'
import {SanitySectionType} from 'pages/learn'

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
          <Link href={section.path} passHref>
            <a
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
            </a>
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
