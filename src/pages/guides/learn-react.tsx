import groq from 'groq'
import {NextSeo} from 'next-seo'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {sanityClient} from 'utils/sanity-client'
import removeMarkdown from 'remove-markdown'
import {
  ArrowDownIcon,
  SparklesIcon,
  LightningBoltIcon,
} from '@heroicons/react/solid'
import Link from 'next/link'
import {twMerge} from 'tailwind-merge'
import React from 'react'
import {truncate} from 'lodash'
import Balancer from 'react-wrap-balancer'
import analytics from 'utils/analytics'

const LearnReact: React.FC<React.PropsWithChildren<{reactGuide: any}>> = ({
  reactGuide,
}) => {
  const scrollRef = React.useRef<null | HTMLHeadingElement>(null)

  const {sections, ogImage} = reactGuide

  const [
    fundamentalSection,
    stateSection,
    appDevSection,
    commonPatternSection,
  ] = sections

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  return (
    <>
      <NextSeo
        title={truncate(reactGuide.title, {length: 65})}
        description={truncate(removeMarkdown(reactGuide.description), {
          length: 155,
        })}
        openGraph={{
          title: truncate(reactGuide.title, {length: 65}),
          description: truncate(removeMarkdown(reactGuide.description), {
            length: 155,
          }),
          url,
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
              alt: truncate(reactGuide.title, {length: 65}),
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'eggheadio',
        }}
        canonical={url}
      />
      <div className="w-full mt-8 md:mt-14 lg:mt-32 mb-20">
        <header className="w-full mx-auto max-w-screen-lg">
          <div className="z-10 flex flex-wrap w-full justify-center sm:justify-between gap-4 mx-auto">
            <Image
              src={reactGuide.featureImage}
              alt={reactGuide.title}
              objectFit="cover"
              width={430}
              height={400}
              objectPosition="center"
              className="shrink-0"
            />
            <div className="p-4 w-fit">
              <h1 className="text-center sm:text-left self-center mb-2 font-medium text-2xl h-fit sm:w-96">
                <Balancer>{reactGuide.title}</Balancer>
              </h1>
              <p className="sm:w-[40ch] mt-4">
                <Balancer className="whitespace-pre-wrap">
                  {reactGuide.description}
                </Balancer>
              </p>
            </div>
          </div>

          <div className="p-2 mx-auto mt-20 sm:mt-32 rounded-full  w-fit bg-gray-50 dark:bg-opacity-20 dark:text-gray-200 hover:bg-gray-100 relative z-10 cursor-pointer transition-all hover:scale-110">
            <ArrowDownIcon
              className="w-5 h-5 text-gray-900 dark:text-white "
              onClick={() =>
                scrollRef?.current &&
                scrollRef?.current.scrollIntoView({behavior: 'smooth'})
              }
            />
          </div>
        </header>
        <main className="w-full">
          {/* Fundamentals */}
          <section className="w-full pb-20">
            <div className="max-w-screen-lg mx-auto">
              <div className="flex flex-col-reverse lg:flex-row lg:justify-between mt-20 mb-8 relative">
                <h2
                  className="lg:mt-20 lg:mb-8 font-medium text-2xl text-center lg:text-left"
                  ref={scrollRef}
                >
                  {fundamentalSection.title}
                </h2>
                <div
                  aria-hidden
                  className="flex flex-col lg:mt-20 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-700 self-center relative z-10 text-right"
                >
                  <span className="text-xl">Week </span>
                  01
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4">
                <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-center">
                  <Balancer>{fundamentalSection.description}</Balancer>
                </div>

                <HorizontalCourseCard
                  course={fundamentalSection.courses[0]}
                  location={router.asPath}
                />
              </div>
            </div>
          </section>
          {/* State Management */}
          <section className="w-full pt-2 dark:bg-gray-800 bg-gray-50 pb-20">
            <div className="max-w-screen-lg mx-auto">
              <div className="flex flex-col-reverse lg:flex-row lg:justify-between mt-20 mb-8 relative">
                <h2 className="lg:mt-20 lg:mb-8 font-medium text-2xl text-center lg:text-left">
                  {stateSection.title}
                </h2>
                <div
                  aria-hidden
                  className="flex flex-col lg:mt-16 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-600 self-center relative z-10 text-right pt-4"
                >
                  <span className="text-xl">Week </span>
                  02-03
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4">
                <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-start">
                  <Balancer>{stateSection.description}</Balancer>
                </div>
                {stateSection?.challenge && (
                  <ChallengeCard
                    challenge={stateSection.challenge}
                    location={router.asPath}
                  />
                )}
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <HorizontalCourseCard
                  location={router.asPath}
                  course={stateSection.courses[0]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
                <HorizontalCourseCard
                  location={router.asPath}
                  course={stateSection.courses[1]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
                <HorizontalCourseCard
                  location={router.asPath}
                  course={stateSection.courses[2]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
            </div>
          </section>
          {/* Application development */}
          <section className="w-full  pb-20">
            <div className="max-w-screen-lg mx-auto">
              <div className="flex flex-col-reverse lg:flex-row lg:justify-between mt-20 mb-8 relative">
                <h2 className="lg:mt-20 lg:mb-8 font-medium text-2xl text-center lg:text-left">
                  {appDevSection.title}
                </h2>
                <div
                  aria-hidden
                  className="flex flex-col lg:mt-16 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-600 self-center relative z-10 text-right pt-4"
                >
                  <span className="text-xl">Week </span>
                  04-05
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4">
                <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-start">
                  <Balancer>{appDevSection.description}</Balancer>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                  <HorizontalCourseCard
                    location={router.asPath}
                    course={appDevSection.courses[0]}
                    className="dark:bg-gray-900 bg-gray-50 col-span-4"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4">
                <HorizontalCourseCard
                  location={router.asPath}
                  course={appDevSection.courses[1]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
                <HorizontalCourseCard
                  location={router.asPath}
                  course={appDevSection.courses[2]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
              <ChallengeCardFull
                challenge={stateSection.challenge}
                location={router.asPath}
              />
            </div>
          </section>
          {/* Common Patterns */}
          <section className="w-full pt-2 dark:bg-gray-800 bg-gray-50 pb-20">
            <div className="max-w-screen-lg mx-auto">
              <div className="flex flex-col-reverse lg:flex-row lg:justify-between mt-20 mb-8 relative">
                <h2 className="lg:mt-20 lg:mb-8 font-medium text-2xl text-center lg:text-left">
                  {commonPatternSection.title}
                </h2>
                <div
                  aria-hidden
                  className="flex flex-col lg:mt-16 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-600 self-center relative z-10 text-right pt-4"
                >
                  <span className="text-xl">Week </span>
                  06-07
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4 mb-4">
                <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-start">
                  <Balancer>{commonPatternSection.description}</Balancer>
                </div>
                <HorizontalCourseCard
                  location={router.asPath}
                  course={commonPatternSection.courses[0]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-4">
                <HorizontalCourseCard
                  location={router.asPath}
                  course={commonPatternSection.courses[1]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
                <HorizontalCourseCard
                  location={router.asPath}
                  course={commonPatternSection.courses[2]}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default LearnReact

const HorizontalCourseCard: React.FC<
  React.PropsWithChildren<{
    course: any
    className?: string
    location?: string
  }>
> = ({course, className = '', location = ''}) => {
  return (
    <Link href={course.path} legacyBehavior>
      <div
        onClick={() => {
          console.log('track')
          analytics.events.activityInternalLinkClick(
            'course',
            location,
            'React',
          )
        }}
        className={twMerge(
          'flex justify-center flex-wrap sm:flex-nowrap  sm:flex-row gap-5 items-center px-5 py-8 group dark:bg-gray-800 bg-gray-100 dark:bg-opacity-60 hover:shadow-none transition-all shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 rounded sm:h-64 sm:w-[500px] cursor-pointer',
          className,
        )}
      >
        <div className="w-fit shrink-0 hover:scale-105 transition-all">
          <Image
            src={course.image}
            height={150}
            width={150}
            alt={course.title}
          />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-semibold leading-tight max-w-[20ch]">
            {course.title}
          </h3>

          <p className="mt-1 uppercase font-medium sm:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60">
            {course.byline}
          </p>
          <p className="sm:w-[35ch] text-sm">{course.description}</p>
        </div>
      </div>
    </Link>
  )
}

const ChallengeCard = ({
  challenge,
  location = '',
}: {
  challenge: any
  location?: string
}) => {
  const isExternal = !!challenge?.externalPath

  if (isExternal) {
    return (
      <a
        href={challenge.externalPath}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div
          className="flex justify-center flex-wrap sm:flex-nowrap  sm:flex-row gap-5 items-center p-8 group bg-blue-500 hover:shadow-none transition-all shadow-smooth hover:bg-blue-600 sm:min-w-[500px] w-full rounded h-fit mb-4 cursor-pointer"
          onClick={() =>
            analytics.events.activityExternalLinkClick(
              location,
              'React',
              challenge.externalPath,
            )
          }
        >
          <div className="text-center sm:text-left">
            <div className="flex gap-2">
              <SparklesIcon className="h-10 w-10 text-amber-300" />
              <h3 className="text-xl font-semibold leading-tight self-center text-white">
                {challenge.title}
              </h3>
            </div>

            <p className="sm:w-[35ch] leading-relaxed mt-4  text-white">
              {challenge.description}
            </p>

            <button className="bg-white p-4 rounded text-blue-500 font-medium mt-14 transition-all hover:scale-105">
              {challenge.ctaText}
            </button>
          </div>
        </div>
      </a>
    )
  }

  return (
    <Link href={challenge?.eggheadPath} legacyBehavior>
      <div
        className="flex justify-center flex-wrap sm:flex-nowrap  sm:flex-row gap-5 items-center p-8 group bg-blue-500 hover:shadow-none transition-all shadow-smooth hover:bg-blue-600 w-fit rounded h-fit mb-4 cursor-pointer"
        onClick={() =>
          analytics.events.activityInternalLinkClick(
            'project',
            location,
            'React',
            challenge.eggheadPath,
          )
        }
      >
        <div className="text-center sm:text-left">
          <div className="flex gap-2">
            <SparklesIcon className="h-10 w-10 text-amber-300" />
            <h3 className="text-xl font-semibold leading-tight self-center text-white">
              {challenge.title}
            </h3>
          </div>

          <p className="w-[35ch] leading-relaxed mt-4  text-white">
            {challenge.description}
          </p>

          <button className="bg-white p-4 rounded text-blue-500 font-medium mt-14 transition-all hover:scale-105">
            {challenge.ctaText}
          </button>
        </div>
      </div>
    </Link>
  )
}

const ChallengeCardFull = ({
  challenge,
  location = '',
}: {
  challenge: any
  location?: string
}) => {
  const isExternal = !!challenge?.externalPath

  if (isExternal) {
    return (
      <a
        href={challenge.externalPath}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mt-4"
          onClick={() =>
            analytics.events.activityExternalLinkClick(
              location,
              'React',
              challenge.externalPath,
            )
          }
        >
          <div className="px-5 py-8 group bg-blue-500 shadow-smooth dark:hover:bg-blue-600 w-full rounded h-fit mb-4 hover:bg-blue-600 hover:shadow-none transition-all">
            <div className="flex flex-row justify-center sm:justify-between text-center flex-wrap sm:text-left lg:mx-20 gap-4">
              <div className="flex flex-wrap justify-center gap-4">
                <LightningBoltIcon className="h-10 w-10 text-amber-300" />
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold leading-tight self-center  text-white">
                    {challenge.title}
                  </h3>
                  <p className="w-[35ch] leading-relaxed self-center sm:self-auto  text-white">
                    {challenge.description}
                  </p>
                </div>
              </div>

              <button className="bg-white p-4 rounded text-blue-500 font-medium self-center hover:scale-105 transition-all">
                {challenge.ctaText}
              </button>
            </div>
          </div>
        </div>
      </a>
    )
  }

  return (
    <Link href={challenge.eggheadPath} legacyBehavior>
      <div
        className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mt-4"
        onClick={() =>
          analytics.events.activityInternalLinkClick(
            'project',
            location,
            'React',
            challenge.eggheadPath,
          )
        }
      >
        <div className="px-5 py-8 group bg-blue-500 shadow-smooth dark:hover:bg-blue-600 w-full rounded h-fit mb-4 hover:bg-blue-600 hover:shadow-none transition-all">
          <div className="flex flex-row justify-center sm:justify-between text-center flex-wrap sm:text-left lg:mx-20 gap-4">
            <div className="flex flex-wrap justify-center gap-4">
              <LightningBoltIcon className="h-10 w-10 text-amber-300" />
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold leading-tight self-center  text-white">
                  {challenge.title}
                </h3>
                <p className="w-[35ch] leading-relaxed self-center sm:self-auto  text-white">
                  {challenge.description}
                </p>
              </div>
            </div>
            <button className="bg-white p-4 rounded text-blue-500 font-medium self-center hover:scale-105 transition-all">
              {challenge.ctaText}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

const query = groq`*[_type == 'resource' && type == 'landing-page' && slug.current == 'learn-react'][0]{
  title,
  'featureImage': images[label == 'feature-image'][0].url,
  'ogImage': images[label == 'og-image'][0].url,
  description,
  'sections': resources[] {
    title,
    description,
    'challenge': resources[type == 'project'][0] {
      title,
      description,
      'eggheadPath': path,
      'externalPath': url,
      'ctaText': content[label == "CTA"][0].text,
     },
    'courses': resources[]->{
      title,
      'description': summary,
      path,
      byline,
      path,
      image,
      'background': images[label == 'feature-card-background'][0].url,
      'instructor': collaborators[@->.role == 'instructor'][0]->{
        'name': person->.name
      },
    },
  }
}`

export async function getStaticProps(context: any) {
  const reactGuide = await sanityClient.fetch(query)

  return {
    props: {reactGuide},
  }
}
