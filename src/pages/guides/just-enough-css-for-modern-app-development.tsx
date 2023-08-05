import groq from 'groq'
import {NextSeo} from 'next-seo'
import Image from 'next/image'
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
import analytics from 'utils/analytics'

const HorizontalCourseCard: React.FC<
  React.PropsWithChildren<{
    course: any
    className?: string
    location?: string
  }>
> = ({course, className = '', location = ''}) => {
  return (
    <Link href={course.path}>
      <div
        onClick={() => {
          console.log('track')
          analytics.events.activityInternalLinkClick('course', location, 'CSS')
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
          <p className="w-[35ch] text-sm">{course.description}</p>
        </div>
      </div>
    </Link>
  )
}

const CssChallengeCard = ({
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
          className="flex justify-center flex-wrap sm:flex-nowrap  sm:flex-row gap-5 items-center p-8 group bg-blue-500 hover:shadow-none transition-all shadow-smooth hover:bg-blue-600 w-fit rounded h-fit mb-4 cursor-pointer"
          onClick={() =>
            analytics.events.activityExternalLinkClick(
              location,
              'CSS',
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

            <p className="w-[35ch] leading-relaxed mt-4  text-white">
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
    <Link href={challenge.eggheadPath}>
      <div
        className="flex justify-center flex-wrap sm:flex-nowrap  sm:flex-row gap-5 items-center p-8 group bg-blue-500 hover:shadow-none transition-all shadow-smooth hover:bg-blue-600 w-fit rounded h-fit mb-4 cursor-pointer"
        onClick={() =>
          analytics.events.activityInternalLinkClick(
            'project',
            location,
            'CSS',
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

const CssChallengeCardFull = ({
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
              'CSS',
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
    <Link href={challenge.eggheadPath}>
      <div
        className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mt-4"
        onClick={() =>
          analytics.events.activityInternalLinkClick(
            'project',
            location,
            'CSS',
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

const JustEnoughCssForModernAppDevelopment: React.FC<
  React.PropsWithChildren<{cssGuide: any}>
> = ({cssGuide}) => {
  const scrollRef = React.useRef<null | HTMLHeadingElement>(null)

  const {sections, ogImage} = cssGuide

  const [fundamentalSection, layoutSection, modernSection] = sections

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  return (
    <>
      <NextSeo
        title={truncate(cssGuide.title, {length: 65})}
        description={truncate(removeMarkdown(cssGuide.description), {
          length: 155,
        })}
        openGraph={{
          title: truncate(cssGuide.title, {length: 65}),
          description: truncate(removeMarkdown(cssGuide.description), {
            length: 155,
          }),
          url,
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
              alt: truncate(cssGuide.title, {length: 65}),
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
        <header className="relative w-full mx-auto">
          <img
            className="absolute -top-[100px] object-fill overflow-visible bg-no-repeat left-[10px]"
            src={cssGuide.backgroundGrid}
          />
          <div className="relative z-10 flex flex-wrap w-full justify-center sm:justify-evenly gap-4 mx-auto">
            <div>
              <Image
                src={cssGuide.featureImage}
                alt={cssGuide.title}
                objectFit="cover"
                width={325}
                height={325}
                objectPosition="center"
                className="shrink-0"
              />
            </div>
            <div>
              <h1 className="self-center mb-2 text-xl font-medium sm:text-2xl h-fit w-96">
                Just enough <strong>CSS</strong> to build Modern UI
              </h1>
              <p className="whitespace-pre-wrap w-[40ch] mt-4">
                {cssGuide.description}
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
              <img
                className="absolute object-fill overflow-visible bg-no-repeat -top-20 right-1/4 sm:right-1/3 lg:-right-16 lg:-top-0 w-60 lg:w-64"
                src={cssGuide.backgroundGrid}
              />
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4">
              <div className="w-[40ch] mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-center">
                {fundamentalSection.description}
              </div>

              <HorizontalCourseCard
                course={fundamentalSection.courses[0]}
                location={router.asPath}
              />
            </div>
          </div>
        </section>

        <section className="w-full pt-2 dark:bg-gray-800 bg-gray-50 pb-20">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col-reverse lg:flex-row lg:justify-between mt-20 mb-8 relative">
              <h2 className="lg:mt-20 lg:mb-8 font-medium text-2xl text-center lg:text-left">
                {layoutSection.title}
              </h2>
              <div
                aria-hidden
                className="flex flex-col lg:mt-16 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-600 self-center relative z-10 text-right pt-4"
              >
                <span className="text-xl">Week </span>
                02-03
              </div>
              <img
                className="absolute object-fill overflow-visible bg-no-repeat -top-16 right-1/4 sm:right-1/3 lg:-right-16 lg:-top-0 w-60 lg:w-64"
                src={cssGuide.backgroundGrid}
              />
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4">
              <p className="w-[40ch] mb-8 whitespace-pre-wrap mx-auto sm:mx-0">
                {layoutSection.description}
              </p>
              <CssChallengeCard
                challenge={layoutSection.challenge}
                location={router.asPath}
              />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <HorizontalCourseCard
                location={router.asPath}
                course={layoutSection.courses[0]}
                className="dark:bg-gray-900 bg-gray-50 col-span-4"
              />
              <HorizontalCourseCard
                location={router.asPath}
                course={layoutSection.courses[1]}
                className="dark:bg-gray-900 bg-gray-50 col-span-4"
              />
              <HorizontalCourseCard
                location={router.asPath}
                course={layoutSection.courses[2]}
                className="dark:bg-gray-900 bg-gray-50 col-span-4"
              />
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col-reverse lg:flex-row lg:justify-between mt-20 mb-8 relative">
              <h2 className="lg:mt-20 lg:mb-8 font-medium text-2xl text-center lg:text-left">
                {modernSection.title}
              </h2>
              <div
                aria-hidden
                className="flex flex-col lg:mt-16 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-600 self-center relative z-10 text-right pt-4"
              >
                <span className="text-xl">Week </span>
                04-05
              </div>
              <img
                className="absolute object-fill overflow-visible bg-no-repeat -top-16 right-1/4 sm:right-1/3 lg:-right-16 lg:-top-0 w-60 lg:w-64"
                src={cssGuide.backgroundGrid}
              />
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4">
              <p className="w-[40ch] mb-8 whitespace-pre-wrap mx-auto sm:mx-0">
                {modernSection.description}
              </p>
              <HorizontalCourseCard
                location={router.asPath}
                course={modernSection.courses[0]}
                className=" col-span-4"
              />
            </div>
            <CssChallengeCardFull
              challenge={modernSection.challenge}
              location={router.asPath}
            />
          </div>
        </section>
      </div>
    </>
  )
}

export default JustEnoughCssForModernAppDevelopment

const query = groq`*[_type == 'resource' && type == 'landing-page' && slug.current == 'just-enough-css-for-modern-app-development'][0]{
  title,
  'featureImage': images[label == 'feature-image'][0].url,
  'backgroundGrid': images[label == 'background-grid'][0].url,
  'weekGrid': images[label == 'week-grid'][0].url,
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
      'instructor': collaborators[]->[role == 'instructor'][0]{
        'name': person->.name
      },
    },
  }
}`

export async function getStaticProps(context: any) {
  const cssGuide = await sanityClient.fetch(query)

  return {
    props: {cssGuide},
  }
}
