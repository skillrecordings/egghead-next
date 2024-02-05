import React from 'react'
import {Guide, GuideResource, GuideSection} from '@/lib/guides'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import {ChevronLeft} from 'lucide-react'
import Balancer from 'react-wrap-balancer'
import {NextSeo} from 'next-seo'
import {truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'
import PlayIcon from '@/components/pages/courses/play-icon'
import {cn} from '@/ui/utils'
import {router} from '@/server/trpc'
import {useRouter} from 'next/router'

type GuideTemplateProps = {
  guide: Guide
}

const GuideTemplate: React.FC<GuideTemplateProps> = ({guide}) => {
  const {title, description, image, sections} = guide
  const router = useRouter()

  return (
    <div className="bg-gray-50 dark:bg-black/40 flex flex-col items-center justify-center relative">
      <Header guide={guide} />
      <main className="w-full relative flex flex-col items-center justify-center border-y border-black/[0.03] dark:border-white/[0.08]">
        <div
          className="sm:opacity-100 opacity-0 grid grid-cols-12 w-full max-w-screen-xl absolute top-0 h-full pointer-events-none select-none"
          aria-hidden="true"
        >
          {new Array(12).fill('').map((_, i) => (
            <div
              key={i + '-col'}
              className={cn(
                'w-px h-full dark:bg-white/[0.05] bg-black/[0.03]',
                {
                  'opacity-0': i % 4 !== 0 || i === 8,
                },
              )}
            />
          ))}
          <div className="w-px h-full dark:bg-white/[0.05] bg-black/[0.03] absolute right-0" />
        </div>
        {sections?.map((section, idx: number) => {
          return (
            <GuideSectionProvider
              section={section}
              key={section._id + idx.toString()}
            >
              <Section
                number={idx + 1}
                className={cn('', {
                  'bg-gray-100 dark:bg-gray-800/40': idx % 2 === 0,
                })}
              />
            </GuideSectionProvider>
          )
        })}
      </main>
      <NextSeo
        title={truncate(guide.title, {length: 65})}
        description={guide.description}
        openGraph={{
          title: truncate(guide.title, {length: 65}),
          description: truncate(removeMarkdown(guide.description), {
            length: 155,
          }),
          site_name: 'egghead',
          images: [
            {
              url: guide.ogImage as string,
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'eggheadio',
        }}
      />
    </div>
  )
}

export default GuideTemplate

// Template Components

const Section: React.FC<{className?: string; number: number}> = ({
  className,
  number,
}) => {
  const {
    section: {title, description, resources},
  } = useGuideSection()
  return (
    <section
      key={title}
      className={cn('w-full flex items-center justify-center', className)}
    >
      <div className="max-w-screen-xl grid grid-cols-12 mx-auto md:pt-32 pt-10 w-full">
        <div className="w-full lg:col-span-4 col-span-12 relative pr-10 lg:pl-10 pl-5 md:pb-32 pb-0">
          <div className="">
            <h2 className="text-3xl font-semibold leading-tight flex items-center">
              <Balancer>{title}</Balancer>
            </h2>
            {description && (
              <ReactMarkdown className="pt-8 prose dark:prose-invert xl:prose-lg">
                {description}
              </ReactMarkdown>
            )}
          </div>
        </div>
        <div className="md:grid snap-x flex overflow-x-auto grid-cols-1 relative lg:col-span-8 col-span-12 dark:divide-white/5">
          {resources?.map((resource, idx) => {
            return (
              <GuideResourceProvider resource={resource} key={resource._id}>
                <Resource number={idx} />
              </GuideResourceProvider>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const Resource: React.FC<{className?: string; number: number}> = ({
  className,
  number,
}) => {
  const {resource, resourcesCount} = useGuideResource()
  const {
    title,
    description,
    image,
    slug,
    type,
    url,
    path,
    instructor,
    lessonCount,
  } = resource
  const link = url || path || slug
  const firstLessonPath = resource.firstLesson && resource.firstLesson.path
  const hasVideo = type && ['course', 'talk'].includes(type)

  return (
    <article
      className={cn(
        'snap-center md:scale-100 scale-90 md:py-10 py-5 w-full md:bg-transparent bg-white/5 md:rounded-none rounded-lg flex-shrink-0 border-b md:max-w-full max-w-[320px] dark:border-white/[0.05] border-black/[0.03] flex md:flex-row flex-col md:items-start items-center md:gap-0 gap-5 md:space-x-10 md:pl-10 pl-8 md:pr-5 pr-8',
        className,
        {
          'border-b-0': number + 1 === resourcesCount,
        },
      )}
    >
      {image && link && (
        <Link
          href={firstLessonPath ? firstLessonPath : link}
          className="flex-shrink-0 group relative flex items-center justify-center rounded overflow-hidden"
        >
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={200}
            height={200}
            className={cn('duration-300 transition ease-in-out', {
              'group-hover:opacity-50': hasVideo,
            })}
          />
          {hasVideo && (
            <div className="shadow-xl group-hover:opacity-100 opacity-0 scale-50 group-hover:scale-100 duration-300 translate-y-5 group-hover:translate-y-0 absolute transition ease-in-out p-2 rounded-full w-12 h-12 bg-white flex items-center justify-center">
              <PlayIcon className="w-5 ml-0.5 h-5 text-black" />
            </div>
          )}
        </Link>
      )}
      <div>
        <h3 className="sm:text-xl text-lg font-semibold">
          {link ? (
            <Link href={link} className="hover:cursor-pointer">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        {(instructor || lessonCount) && (
          <div className="mt-3 text-sm font-medium flex items-center">
            {instructor && (
              <div className="flex items-center space-x-1 mr-1">
                {instructor.image && (
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span>{instructor.name}</span>
              </div>
            )}
            {type === 'course' &&
              lessonCount &&
              ' ・ ' + lessonCount + ' lessons'}
          </div>
        )}
        {description && (
          <ReactMarkdown className="sm:block hidden pt-6 prose dark:prose-invert sm:prose-base prose-sm">
            {description}
          </ReactMarkdown>
        )}
        {link && (
          <Link
            className="dark:text-blue-400 text-blue-500 mt-5 inline-flex hover:text-blue-600 transition dark:hover:text-blue-300 group"
            href={link}
          >
            {getResourceButtonLabel(type)} <ChevronRight />
          </Link>
        )}
      </div>
    </article>
  )
}

const Header: React.FC<{guide: Guide}> = ({guide}) => {
  const {title, description, image} = guide
  const router = useRouter()
  return (
    <header className="md:grid flex flex-col-reverse grid-cols-12 items-start max-w-screen-xl mx-auto w-full relative">
      <div
        className="sm:opacity-100 opacity-0 grid grid-cols-12 w-full max-w-screen-xl absolute top-0 h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        {new Array(12).fill('').map((_, i) => (
          <div
            className={cn('w-px h-full dark:bg-white/[0.05] bg-black/[0.03]', {
              'opacity-0': i % 6 !== 0 || i === 8,
            })}
            key={i}
          />
        ))}
        <div className="w-px h-full dark:bg-white/[0.05] bg-black/[0.03] absolute right-0" />
      </div>
      <div className="pb-24 md:pt-16 pt-5 w-full lg:pl-10 pl-5 pr-10 col-span-6">
        {router.pathname !== '/guides' && (
          <Link
            href="/guides"
            className="flex md:static absolute top-3 left-2 z-10 items-center gap-0.5 group mb-10 opacity-75 text-sm hover:opacity-100 transition md:dark:bg-transparent md:bg-transparent dark:bg-gray-900 bg-white md:px-0 md:py-0 px-2 pl-0.5 rounded py-1"
          >
            <ChevronRight className="rotate-180" /> Back to all Guides
          </Link>
        )}
        <h1 className="font-bold md:text-4xl text-3xl leading-tight">
          <Balancer>{title}</Balancer>
        </h1>
        {description && (
          <Balancer>
            <ReactMarkdown className="pt-10 prose dark:prose-invert prose-lg max-w-xl">
              {description}
            </ReactMarkdown>
          </Balancer>
        )}
      </div>
      {image && (
        <div className="col-span-6 relative md:h-full h-48 w-full">
          <Image
            fill
            priority
            quality={100}
            className="flex-shrink-0 object-cover"
            src={image}
            alt=""
            aria-hidden="true"
          />
        </div>
      )}
    </header>
  )
}

const getResourceButtonLabel = (type?: string | null) => {
  switch (type) {
    case 'article':
      return 'Read more'
    case 'course':
      return 'View more'
    case 'project':
      return 'Take this challenge'
    default:
      return 'View more'
  }
}

// Section Provider

type GuideSectionContextType = {
  section: GuideSection
}

export const GuideSectionContext = React.createContext(
  {} as GuideSectionContextType,
)

const useGuideSection = () => {
  return React.useContext(GuideSectionContext)
}

export const GuideSectionProvider: React.FC<
  React.PropsWithChildren<{section: GuideSection}>
> = ({section, children}) => {
  const context = {
    section,
  }
  return (
    <GuideSectionContext.Provider value={context}>
      {children}
    </GuideSectionContext.Provider>
  )
}

// Resource Provider

type GuideResourceContextType = {
  resource: GuideResource
  resourcesCount: number
}

export const GuideResourceContext = React.createContext(
  {} as GuideResourceContextType,
)

const useGuideResource = () => {
  return React.useContext(GuideResourceContext)
}

export const GuideResourceProvider: React.FC<
  React.PropsWithChildren<{resource: GuideResource}>
> = ({resource, children}) => {
  const {section} = useGuideSection()
  const resourcesCount = section?.resources?.length || 0
  const context = {
    resource,
    resourcesCount,
  }

  return (
    <GuideResourceContext.Provider value={context}>
      {children}
    </GuideResourceContext.Provider>
  )
}

// Utils

function pad(number: number, width: number = 2) {
  const numberString = number.toString()
  const paddingWidth = width - numberString.length

  if (paddingWidth > 0) {
    return '0'.repeat(paddingWidth) + numberString
  }

  return numberString
}

const ChevronRight: React.FC<{className?: string}> = ({className}) => {
  return (
    <svg
      aria-hidden="true"
      className={cn('w-4 ml-0.5', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12L1 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="origin-left relative scale-x-0 group-hover:scale-x-100 transition"
      />
    </svg>
  )
}
