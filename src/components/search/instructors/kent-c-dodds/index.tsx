import Image from 'next/legacy/image'
import {get} from 'lodash'
import ExternalTrackedLink from '@/components/external-tracked-link'

import SearchInstructorEssential from '../instructor-essential'
import CtaCard from '@/components/search/components/cta-card'
import {VerticalResourceCard} from '@/components/card/verticle-resource-card'

const SearchKentCDodds = ({instructor}: any) => {
  instructor = {...instructor, ...curatedInstructorData}
  const {
    collection,
    courses,
    podcast,
    products,
    caseStudy,
    epicReactCaseStudy,
  } = instructor

  const courseResources = courses?.resources ?? []
  const collectionResources = collection?.resources ?? []
  const testingJavascriptProduct = products?.testingJavascript
  const epicReactProduct = products?.epicReact
  const [primaryCourse] = courseResources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          primaryCourse ? (
            <CtaCard
              resource={primaryCourse}
              trackTitle="clicked instructor landing page CTA resource"
              location="Kent C. Dodds instructor page"
            />
          ) : undefined
        }
      />
      <section className="mt-4 mb-10 flex sm:flex-nowrap flex-wrap flex-shrink justify-between gap-4 xl:px-0 px-5">
        {testingJavascriptProduct ? (
          <ExternalTrackedLink
            eventName="clicked testing javascript banner"
            location="Kent C. Dodds instructor page"
            href={get(testingJavascriptProduct, 'url')}
          >
            <Image
              quality={100}
              src={get(testingJavascriptProduct, 'image')}
              width={620}
              height={350}
              layout="intrinsic"
              alt={get(
                testingJavascriptProduct,
                'alt',
                `illustration for testingJavascript`,
              )}
            />
          </ExternalTrackedLink>
        ) : null}
        {epicReactProduct ? (
          <ExternalTrackedLink
            eventName="clicked epic react banner"
            location="Kent C. Dodds instructor page"
            href={get(epicReactProduct, 'url')}
          >
            <Image
              quality={100}
              src={get(epicReactProduct, 'image')}
              width={620}
              height={350}
              alt={get(epicReactProduct, 'alt', `illustration for epicreact`)}
            />
          </ExternalTrackedLink>
        ) : null}
      </section>

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          {collection?.title ?? 'Featured Collection'}
        </h2>
        <p className="max-w-md">{collection?.description ?? ''}</p>
        <div className="flex sm:flex-nowrap flex-wrap gap-4 my-12">
          {collectionResources.map((resource: any) => {
            return (
              <VerticalResourceCard
                resource={resource}
                className="sm:w-1/2 border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
                location="Kent C. Dodds instructor Landing page"
              />
            )
          })}
        </div>
      </section>

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          More From Kent
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap gap-4 mt-4">
          {podcast ? (
            <VerticalResourceCard
              className="mt-0 sm:w-1/2 w-full flex flex-col items-center justify-center text-center sm:py-8 py-6"
              resource={podcast}
              describe
              location="Kent C. Dodds instructor Landing page"
            />
          ) : null}
          {epicReactCaseStudy ? (
            <VerticalResourceCard
              resource={epicReactCaseStudy}
              className="sm:w-1/2 w-full border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
              location="Kent C. Dodds instructor Landing page"
            />
          ) : null}
          {caseStudy ? (
            <VerticalResourceCard
              className="sm:w-1/2 w-full border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
              resource={caseStudy}
              describe
              location="Kent C. Dodds instructor Landing page"
            />
          ) : null}
        </div>
      </section>
    </div>
  )
}
export default SearchKentCDodds

const curatedInstructorData = {
  caseStudy: {
    byline: 'egghead Case Study',
    description: 'Learn how Kent started working with egghead.',
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1628625842/howtoegghead/eggo_mic.svg',
    path: 'https://howtoegghead.com/instructor/case-studies/kent-c-dodds/',
    title: "Kent's Instructor Journey",
  },
  collection: {
    description:
      "Open source is an excellent way to level up your skills as a developer. You don't need to be an expert to start contributing to open source. Learn how Kent recommends starting in open source.",
    resources: [
      {
        background: null,
        byline: 'Kent C. Dodds • Course • 38m',
        description:
          '“Feel free to submit a PR!” - words often found in GitHub issues, but met with confusion and fear by many. Getting started with contributing open source is not always straightforward and can be tricky. With this course, you’ll be equipped with the the tools, knowledge, and understanding you need to be productive and contribute to the wonderful world of open source projects. Much of this series speaks about GitHub, but most of the concepts are generally applicable to contributing to any open source project, regardless of where it’s hosted.\n\nSo enjoy the course and start contributing to the projects you use and love today!',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/579/full/EGH_JSopensource_final.png',
        instructor: {
          name: 'Kent C. Dodds',
        },
        path: '/courses/how-to-contribute-to-an-open-source-project-on-github',
        title: 'How to Contribute to an Open Source Project on GitHub',
      },
      {
        background: null,
        byline: 'Kent C. Dodds • Course • 1h 30m',
        description:
          "Publishing a JavaScript library for public use requires some extra steps. You need to think about how people will use the library. From end users, to contributors your library now has a variety of people outside of yourself potentially making use of the code that you've released into the wild.\r\n\r\nFrom Github and npm, to releasing beta versions, semantic versioning, code coverage, continuous integration, and providing your library with a solid set of unit tests, there are a ton of things to learn.\r\n\r\nThis series will guide you through a set of steps to publish a JavaScript open source library.\r\n\r\nYou might also enjoy [this article about contributing to open source](https://egghead.io/articles/get-started-contributing-to-javascript-open-source).",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/524/full/EGH_Webpack-Final.png',
        instructor: {
          name: 'Kent C. Dodds',
        },
        path: '/courses/how-to-write-an-open-source-javascript-library',
        title: 'How to Write an Open Source JavaScript Library',
      },
      {
        byline: 'Kent C. Dodds • Article • 5m',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625172066/next.egghead.io/pages/instructors/kent-c-dodds/Software_Engineer_React_Training_Testing_JavaScript_Training.png',
        path: 'https://kentcdodds.com/blog/what-open-source-project-should-i-contribute-to',
        title: 'What open source project should I contribute to?',
      },
      {
        byline: 'Kent C. Dodds • Article • 3m',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/276/full/github_logo.png',
        path: 'https://kentcdodds.com/blog/becoming-an-open-source-project-maintainer',
        title: 'Becoming an Open Source Project Maintainer',
      },
    ],
    title: 'Get into Open Source',
  },
  courses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625165391/next.egghead.io/pages/instructors/kent-c-dodds/feature-card-background.png',
        byline: 'Kent C. Dodds • 2h 29m • Course',
        description:
          'This course is for React newbies and anyone looking to build a solid foundation. It’s designed to teach you everything you need to start building web apps in React right away.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/490/full/EGH_BeginnersReact2.png',
        instructor: {
          name: 'Kent C. Dodds',
        },
        path: '/courses/the-beginner-s-guide-to-react',
        title: "The Beginner's Guide to React",
      },
      {
        background: null,
        byline: 'Kent C. Dodds・38m・Course',
        description:
          'Learn Hooks by taking a modern React codebase that uses classes and refactor the entire thing to use function components as much as possible.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/510/full/EGH_SimplifyHooks_Final.png',
        instructor: {
          name: 'Kent C. Dodds',
        },
        path: '/courses/simplify-react-apps-with-react-hooks',
        title: 'Simplify React Apps with React Hooks',
      },
      {
        background: null,
        byline: 'Kent C. Dodds・1h 26m・Course',
        description: null,
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/509/full/SuspenseAsyncUI_1000.png',
        instructor: {
          name: 'Kent C. Dodds',
        },
        path: '/courses/use-suspense-to-simplify-your-async-ui',
        title: 'Use Suspense to Simplify Your Async UI',
      },
    ],
  },
  epicReactCaseStudy: {
    byline: 'Epic React Case Study',
    description: 'Learn how Epic React came to be.',
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1628626769/egghead-next-pages/instructors/Kent%20C.%20Dodds/some_illustrations_from_EpicReact.dev.png',
    path: 'https://skillrecordings.com/epic-react',
    title: 'Launching Epic React',
  },
  podcast: {
    byline: 'Podcast',
    description:
      'Kent C. Dodds chats with developers about life, career, and code.',
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625172068/next.egghead.io/pages/instructors/kent-c-dodds/Kent_C._Dodds.svg',
    path: 'https://kentcdodds.com/chats-with-kent-podcast',
    title: 'Chats with Kent',
  },
  products: {
    epicReact: {
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625165392/next.egghead.io/pages/instructors/kent-c-dodds/epic-react-card.png',
      url: 'https://epicreact.dev/',
    },
    testingJavascript: {
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625668388/next.egghead.io/pages/instructors/kent-c-dodds/testing-javascript-card.png',
      url: 'https://testingjavascript.com/',
    },
  },
  title: 'Kent C. Dodds Landing Page',
} as Record<string, any>
