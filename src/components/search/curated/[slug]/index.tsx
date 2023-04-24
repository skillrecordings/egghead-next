import * as React from 'react'
import Grid from 'components/grid'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import cx from 'classnames'
import {NextSeo} from 'next-seo'
import {CARD_TYPES} from 'components/search/curated/curated-essential'
import {useRouter} from 'next/router'
import {useViewer} from 'context/viewer-context'
import {loadUserCompletedCourses} from 'lib/users'
import {twMerge} from 'tailwind-merge'
import {trpc} from 'trpc/trpc.client'

type CuratedTopicProps = {
  topicData: any
  topic: any
}

const DynamicCardGrid = ({
  section,
  completedCoursesIds,
  location,
  className,
}: {
  section: any
  completedCoursesIds: string[]
  location: string
  className?: string
}) => {
  return (
    <Grid
      className={twMerge(
        'grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:gap-3 gap-2',
        className,
      )}
    >
      {section.resources.map((resource: any, i: number) => {
        switch (section.resources.length) {
          case 2:
            return (
              <HorizontalResourceCard
                className="col-span-2"
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            )
          case 3:
            return i === 0 ? (
              <HorizontalResourceCard
                className="col-span-2"
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            ) : (
              <VerticalResourceCard
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            )
          case 6:
            return i === 0 || i === 1 ? (
              <HorizontalResourceCard
                className="col-span-2"
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            ) : (
              <VerticalResourceCard
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            )
          case 7:
            return i === 0 ? (
              <HorizontalResourceCard
                className="col-span-2"
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            ) : (
              <VerticalResourceCard
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            )
          default:
            return (
              <VerticalResourceCard
                key={resource.title}
                resource={resource}
                location={location}
                completedCoursesIds={completedCoursesIds}
              />
            )
        }
      })}
    </Grid>
  )
}

const CuratedTopic: React.FC<CuratedTopicProps> = ({topic, topicData}) => {
  const {title, description, image, ogImage, sections, levels, jumbotron} =
    topicData
  const location = `${topic.name} landing`
  const pageDescription = `Life is too short for long boring videos. Learn ${topic.label} using the best screencast tutorial videos online led by working professionals that learn in public.`
  const pageTitle = `In-Depth ${
    topic.label
  } Tutorials for ${new Date().getFullYear()}`
  const router = useRouter()
  const {data: completeCourseData} = trpc.progress.completedCourses.useQuery()
  const completedCoursesIds =
    !isEmpty(completeCourseData) &&
    completeCourseData.map((course: any) => course.collection.id)

  return (
    <>
      <NextSeo
        title={pageTitle}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        description={pageDescription}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: CARD_TYPES.SUMMARY_LARGE_IMAGE,
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          description: pageDescription,
          site_name: 'egghead',
          images: [
            {
              url:
                ogImage ||
                `https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=landscape&v=20201105`,
            },
          ],
        }}
      />
      <header className="dark:bg-gray-1000 dark:bg-opacity-50 bg-white bg-opacity-100">
        <div className="relative">
          <div className="flex sm:flex-row flex-col items-center justify-between sm:py-10 py-5 sm:px-12 px-5 gap-5">
            <div className="h-full flex flex-col justify-center">
              <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold tracking-tight flex items-center flex-wrap space-x-2">
                <Image
                  src={image}
                  alt={`${title} logo`}
                  width={50}
                  height={50}
                  priority
                />
                <span>{title}</span>
              </h1>
              <ReactMarkdown className="prose dark:prose-dark sm:prose sm:dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 dark:prose-sm prose-sm max-w-md sm:pt-8 pt-5 opacity-80">
                {description}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </header>
      <div>
        {!isEmpty(levels) && (
          <div className="relative sm:pt-16 pt-8 sm:pb-12 pb-2">
            <p className="sm:text-sm text-xs font-mono text-medium tracking-wide uppercase opacity-80 sm:pl-12 sm:text-left text-center sm:pb-0 pb-8">
              {levels.subTitle}
            </p>
            <div className="sm:grid sm:space-y-0 space-y-5 lg:grid-cols-3 grid-cols-2 xl:gap-8 sm:gap-5 gap-3 sm:px-5 px-3">
              {levels.resources.map((section: any, i: number) => {
                return (
                  <section
                    className={cx({
                      'sm:pt-24': i === 1,
                      'sm:pt-48': i === 0,
                    })}
                    key={section.title}
                  >
                    <div className="flex flex-col w-full pb-6">
                      <h2 className="lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
                        {section.title}
                      </h2>
                      <h3 className="opacity-80">{section.subTitle}</h3>
                    </div>
                    <div className="grid xl:gap-5 gap-3">
                      {section.resources.map((resource: any) => {
                        return (
                          <HorizontalResourceCard
                            key={resource.id}
                            resource={resource}
                            location={location}
                            completedCoursesIds={completedCoursesIds}
                          />
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        )}
        <div className="sm:px-5 px-3 sm:pt-16 pt-8">
          {!isEmpty(sections) &&
            sections.map((section: any, i: number) => {
              switch (true) {
                case !section.image && !section.description:
                  return (
                    <section className="pb-16" key={section.title}>
                      <div className="flex w-full pb-6 items-center justify-start">
                        <h2 className="lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
                          {section.title}
                        </h2>
                      </div>
                      <DynamicCardGrid
                        section={section}
                        completedCoursesIds={completedCoursesIds}
                        location={location}
                      />
                    </section>
                  )
                case section.resources.length === 2:
                  return (
                    // section with image and description
                    <div className="flex md:flex-row flex-col md:items-start items-center justify-start w-full mb-5 pb-8 md:space-x-10">
                      {section.image && (
                        <div className="flex-shrink-0 md:max-w-none max-w-[200px]">
                          <Image
                            aria-hidden
                            src={section.image}
                            quality={100}
                            width={240}
                            height={240}
                            alt=""
                          />
                        </div>
                      )}
                      <div className="grid md:grid-cols-4 gap-4 ">
                        <div className={`col-span-2  `}>
                          <h2 className="w-full lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight pb-4">
                            {section.title}
                          </h2>
                          {section.description && (
                            <ReactMarkdown className="prose sm:prose prose-sm dark:prose-dark dark:text-gray-300 text-gray-700 dark:prose-sm">
                              {section.description}
                            </ReactMarkdown>
                          )}
                        </div>
                        {section.resources.map((resource: any) => {
                          return (
                            <div className="self-center">
                              <VerticalResourceCard
                                key={resource.title}
                                resource={resource}
                                location={location}
                                completedCoursesIds={completedCoursesIds}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                case section.resources.length === 4 && !section.image:
                  let primarySections = section.resources.slice(0, 2)
                  let secondarySections = section.resources.slice(2, 4)

                  return (
                    <div>
                      <div className="flex md:flex-row flex-col md:items-start items-center justify-start w-full mb-5 pb-8 md:space-x-10">
                        <div className="grid lg:grid-cols-4 gap-4">
                          <div className="col-span-2">
                            <h2 className="w-full lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight pb-4">
                              {section.title}
                            </h2>
                            {section.description && (
                              <ReactMarkdown className="prose sm:prose prose-sm dark:prose-dark dark:text-gray-300 text-gray-700 dark:prose-sm">
                                {section.description}
                              </ReactMarkdown>
                            )}
                          </div>
                          {secondarySections.map((resource: any) => {
                            return (
                              <div className="hidden lg:block self-center">
                                <VerticalResourceCard
                                  key={resource.title}
                                  resource={resource}
                                  location={location}
                                  completedCoursesIds={completedCoursesIds}
                                />
                              </div>
                            )
                          })}
                          {primarySections.map((resource: any) => {
                            return (
                              <HorizontalResourceCard
                                className="col-span-2  hidden lg:block"
                                key={resource.title}
                                resource={resource}
                                location={location}
                                completedCoursesIds={completedCoursesIds}
                              />
                            )
                          })}
                          {section.resources.map((resource: any) => {
                            return (
                              <VerticalResourceCard
                                className="lg:hidden"
                                key={resource.title}
                                resource={resource}
                                location={location}
                                completedCoursesIds={completedCoursesIds}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
              }

              return (
                <section className="pb-16" key={section.title}>
                  <div className="flex md:flex-row flex-col md:items-start items-center justify-start w-full mb-5 pb-8 md:space-x-10 sm:px-7 px-5">
                    {section.image && (
                      <div className="flex-shrink-0 md:max-w-none max-w-[200px]">
                        <Image
                          aria-hidden
                          src={section.image}
                          quality={100}
                          width={240}
                          height={240}
                          alt=""
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="w-full lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight pb-4">
                        {section.title}
                      </h2>
                      {section.description && (
                        <ReactMarkdown className="prose sm:prose prose-sm dark:prose-dark dark:text-gray-300 text-gray-700 dark:prose-sm">
                          {section.description}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                  <DynamicCardGrid
                    section={section}
                    completedCoursesIds={completedCoursesIds}
                    location={location}
                  />
                </section>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default CuratedTopic
