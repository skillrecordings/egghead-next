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

const CodeYourWay: React.FC<React.PropsWithChildren<{codeGuide: any}>> = ({
  codeGuide,
}) => {
  const scrollRef = React.useRef<null | HTMLHeadingElement>(null)

  const {sections, ogImage} = codeGuide

  const [
    onlineSection,
    practiceSection,
    standSection,
    salarySection,
    studySection,
  ] = sections

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  return (
    <>
      <NextSeo
        title={truncate(codeGuide.title, {length: 65})}
        description={codeGuide.summary}
        openGraph={{
          title: truncate(codeGuide.title, {length: 65}),
          description: truncate(removeMarkdown(codeGuide.description), {
            length: 155,
          }),
          url,
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
              alt: truncate(codeGuide.title, {length: 65}),
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
        <header className="w-full mx-auto max-w-screen-lg pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 mx-auto">
            <Image
              src={codeGuide.featureImage}
              alt={codeGuide.title}
              objectFit="cover"
              width={430}
              height={400}
              objectPosition="center"
              className="shrink-0"
            />
            <div className="p-4 max-w-xl">
              <h1 className="text-center sm:text-left mb-2 font-medium text-2xl">
                <Balancer>{codeGuide.title}</Balancer>
              </h1>
              <p className="mt-4">
                <Balancer className="whitespace-pre-wrap">
                  {codeGuide.description}
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

        {/* Online Presence */}
        <section className="w-full pb-20 ">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between mt-20 mb-8 relative">
              <div className="flex-grow" />
              <div
                aria-hidden
                className="flex flex-col lg:mt-20 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-700 self-center relative z-10 text-right"
              >
                <span className="text-xl">Week </span>
                01
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4 items-center">
              <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-center">
                <h2
                  className="lg:mb-8 font-medium text-2xl text-center lg:text-left"
                  ref={scrollRef}
                >
                  {onlineSection.title}
                </h2>
                <Balancer>{onlineSection.description}</Balancer>
              </div>
              <HorizontalResourceCard
                resource={onlineSection.resources[0]}
                location={router.asPath}
              />
            </div>
          </div>
        </section>

        {/* practiceSection */}
        <section className="w-full dark:bg-gray-800 bg-gray-50 pb-20">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between mb-8 relative">
              <div
                aria-hidden
                className="flex flex-col lg:mt-20 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-700 self-center relative z-10 text-left"
              >
                <span className="text-xl">Week </span>
                02
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4 items-center">
              <HorizontalResourceCard
                resource={practiceSection.resources[0]}
                location={router.asPath}
                className="dark:bg-gray-900 bg-gray-50 col-span-4"
              />
              <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-center">
                <h2
                  className="lg:mb-8 font-medium text-2xl text-center lg:text-left"
                  ref={scrollRef}
                >
                  {practiceSection.title}
                </h2>
                <Balancer>{practiceSection.description}</Balancer>
              </div>
            </div>
            <h2
              className="lg:mb-8 font-medium text-2xl text-center lg:text-left"
              ref={scrollRef}
            >
              Read Some Examples:
            </h2>
            <div className="flex">
              <div className="mr-4">
                <HorizontalResourceCard
                  resource={practiceSection.resources[1]}
                  location={router.asPath}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
              <div>
                <HorizontalResourceCard
                  resource={practiceSection.resources[2]}
                  location={router.asPath}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* standSection */}
        <section className="w-full pb-20">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between mb-8 relative">
              <div className="flex-grow" />
              <div
                aria-hidden
                className="flex flex-col lg:mt-20 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-700 self-center relative z-10 text-right"
              >
                <span className="text-xl">Week </span>
                03
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4 items-center">
              <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-center">
                <h2
                  className="lg:mb-8 font-medium text-2xl text-center lg:text-left"
                  ref={scrollRef}
                >
                  {standSection.title}
                </h2>
                <Balancer>{standSection.description}</Balancer>
              </div>
              <Image
                src={standSection.image}
                alt={standSection.title}
                objectFit="cover"
                width={450}
                height={450}
                objectPosition="center"
                className="shrink-0"
              />
            </div>
            <div className="flex">
              <div className="mr-4">
                <HorizontalResourceCard
                  resource={standSection.resources[0]}
                  location={router.asPath}
                />
              </div>
              <div>
                <HorizontalResourceCard
                  resource={standSection.resources[1]}
                  location={router.asPath}
                />
              </div>
            </div>
          </div>
        </section>

        {/* salarySection */}
        <section className="w-full dark:bg-gray-800 bg-gray-50 pb-20">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between mb-8 relative">
              <div
                aria-hidden
                className="flex flex-col lg:mt-20 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-700 self-center relative z-10 text-left"
              >
                <span className="text-xl">Week </span>
                04
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4 items-center">
              <Image
                src={salarySection.image}
                alt={salarySection.title}
                objectFit="cover"
                width={400}
                height={200}
                objectPosition="center"
                className="shrink-0"
              />
              <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-center">
                <h2
                  className="lg:mb-8 font-medium text-2xl text-center lg:text-left"
                  ref={scrollRef}
                >
                  {salarySection.title}
                </h2>
                <Balancer>{salarySection.description}</Balancer>
              </div>
            </div>
            <div className="flex">
              <div className="mr-4">
                <HorizontalResourceCard
                  resource={salarySection.resources[0]}
                  location={router.asPath}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
              <div>
                <HorizontalResourceCard
                  resource={salarySection.resources[1]}
                  location={router.asPath}
                  className="dark:bg-gray-900 bg-gray-50 col-span-4"
                />
              </div>
            </div>
          </div>
        </section>
        {/* studySection */}
        <section className="w-full ">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between  relative">
              <div className="flex-grow" />
              <div
                aria-hidden
                className="flex flex-col lg:mt-20 mb-8 font-mono text-2xl font-bold leading-[0.9] text-gray-400 dark:text-gray-700 self-center relative z-10 text-right"
              >
                <span className="text-xl">Week </span>
                05
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-between lg:flex-nowrap gap-4 items-center">
              <div className="sm:w-[40ch] p-4 sm:p-0 mb-8 whitespace-pre-wrap mx-auto sm:mx-0 self-center">
                <h2
                  className="lg:mb-8 font-medium text-2xl text-center lg:text-left"
                  ref={scrollRef}
                >
                  {studySection.title}
                </h2>
                <Balancer>{studySection.description}</Balancer>
              </div>
              <Image
                src={studySection.image}
                alt={studySection.title}
                objectFit="cover"
                width={250}
                height={250}
                objectPosition="center"
                className="shrink-0"
              />
            </div>
            <div className="flex">
              <div className="mr-4">
                <HorizontalResourceCard
                  resource={studySection.resources[0]}
                  location={router.asPath}
                />
              </div>
              <div>
                <HorizontalResourceCard
                  resource={studySection.resources[1]}
                  location={router.asPath}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default CodeYourWay

const HorizontalResourceCard: React.FC<
  React.PropsWithChildren<{
    resource: any
    className?: string
    location?: string
  }>
> = ({resource, className = '', location = ''}) => {
  return (
    <Link
      href={resource.path ? resource.path : resource.externalPath}
      legacyBehavior
    >
      <div
        onClick={() => {
          console.log('track')
          analytics.events.activityInternalLinkClick(
            'resource',
            location,
            'Get Hired Guide',
          )
        }}
        className={twMerge(
          'flex justify-center items-center flex-wrap sm:flex-nowrap sm:flex-row gap-5 px-5 py-4 group dark:bg-gray-800 bg-gray-100 dark:bg-opacity-60 hover:shadow-none transition-all shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 rounded sm:h-64 sm:w-[500px] cursor-pointer',
          className,
        )}
      >
        <div className="w-fit shrink-0 hover:scale-105 transition-all">
          <Image
            src={resource.image}
            height={150}
            width={150}
            alt={resource.title}
          />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-semibold leading-tight max-w-[20ch]">
            {resource.title}
          </h3>

          <p className="mt-1 uppercase font-medium sm:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100 opacity-60">
            {resource.byline}
          </p>
          <p className="sm:w-[35ch] text-sm">{resource.description}</p>
        </div>
      </div>
    </Link>
  )
}

const query = groq`*[_type == 'resource' && type == 'landing-page' && slug.current == 'coding-your-way-to-the-job'][0]{
  title,
  'featureImage': images[label == 'feature-image'][0].url,
  'ogImage': images[label == 'og-image'][0].url,
  description,
  'sections': resources[] {
    title,
    description,
    image,
    'challenge': resources[type == 'project'][0] {
      title,
      description,
      'eggheadPath': path,
      'externalPath': url,
      'ctaText': content[label == "CTA"][0].text,
     },
    'resources': resources[]{
      title,
      description,
      path,
      image,
      'externalPath': url,
      type,
    },
  }
}`

export async function getStaticProps(context: any) {
  const codeGuide = await sanityClient.fetch(query)

  return {
    props: {codeGuide},
  }
}
