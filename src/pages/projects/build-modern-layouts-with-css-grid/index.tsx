import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import Topic from 'components/search/components/topic'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {GetStaticProps, GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'

type LandingProps = {
  course: any
}

const landingPage: FunctionComponent<LandingProps> = (props) => {
  const {course} = props

  console.log({course})

  return (
    <div className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
      <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto">
        <div className="mt-10 mb-16 text-center">
          <div className="mb-10">
            <Image priority src={course.image} height="270" width="270" />
          </div>
          <p className="text-lg md:text-2xl leading-6 text-gray-500">
            Portfolio Project
          </p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            {course.projects.title}
          </h1>
        </div>
        <ProjectBrief
          className="pb-12"
          topic={{
            name: course.tags[0].value,
            label: 'Project Brief',
          }}
        >
          <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
            {course.projects.description}
          </Markdown>
        </ProjectBrief>

        <div className="flex justify-center">
          <svg
            width="7"
            height="155"
            viewBox="0 0 7 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="-1.5299e-07"
              x2="3.50001"
              y2="155"
              stroke="#B0B0B0"
              strokeWidth="7"
              strokeDasharray="10 10"
            />
          </svg>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 mt-16 mb-16">
          <div className="relative px-10 py-10 bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 col-span-2 shadow rounded-md border border-gray-100 sm:mr-0 md:mr-4">
            <div
              className="absolute rounded-t-lg rounded-b-none left-0 top-4 -mt-5 h-3 w-full bg-gradient-to-r"
              style={{
                background:
                  'linear-gradient(to right, #40A3DA 0%, #0972BC 100%)',
              }}
            />
            <h1 className="sm:text-2xl text-xl font-bold mb-2">Instructions</h1>
            {course.projects.instructions.features.map(
              (instruction: string) => {
                return (
                  <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
                    {`- ${instruction}`}
                  </Markdown>
                )
              },
            )}
          </div>
          <div className="relative px-10 py-10 bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 col-span-1 shadow rounded-md border border-gray-100 mt-4 md:mt-0">
            <div
              className="absolute rounded-t-lg rounded-b-none left-0 top-4 -mt-5 h-3 w-full bg-gradient-to-r"
              style={{
                background:
                  'linear-gradient(to right, #0972BC 0%, #40A3DA 100%)',
              }}
            />
            <h1 className="sm:text-2xl text-xl font-bold mb-2">Goals</h1>
            {course.projects.goals.features.map((goal: string) => {
              return (
                <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
                  {`- ${goal}`}
                </Markdown>
              )
            })}
          </div>
        </section>

        <div className="flex justify-center">
          <svg
            width="7"
            height="155"
            viewBox="0 0 7 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="-1.5299e-07"
              x2="3.50001"
              y2="155"
              stroke="#B0B0B0"
              strokeWidth="7"
              strokeDasharray="10 10"
            />
          </svg>
        </div>

        <section className="relative bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow rounded-md border border-gray-100 mt-16 mb-16 p-10">
          <div
            className="absolute rounded-t-lg rounded-b-none left-0 top-4 -mt-5 h-3 w-full bg-gradient-to-r"
            style={{
              background: 'linear-gradient(to right, #40A3DA 0%, #0972BC 100%)',
            }}
          />
          <h1 className="sm:text-2xl text-xl font-bold mb-2 text-center">
            Project Challenges
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-16 mb-16 gap-5">
            <div className="mb-8 md:mb-0 text-center relative">
              <Image
                src={course.projects.pricingPage.image}
                height="780"
                width="695"
                className="rounded-md z-0"
              />

              <div className="bg-white dark:bg-gray-900 rounded-xl ml-4 mr-4 md:ml-10 md:mr-10 text-center p-4 md:p-12 -mt-40 md:-mt-72 z-20 relative shadow-lg">
                <h2 className="sm:text-xl text-lg font-bold mb-2 text-center">
                  {course.projects.pricingPage.title}
                </h2>
                <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0 text-left">
                  {course.projects.pricingPage.description}
                </Markdown>
                <a
                  className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 mt-12"
                  title="Share on twitter"
                  href={course.projects.pricingPage.figmaUrl}
                  rel="noopener"
                >
                  Download Figma File
                </a>
              </div>
            </div>
            <div className="text-center">
              <Image
                src={course.projects.dashboardPage.image}
                height="780"
                width="695"
                className="rounded-md z-0"
              />
              <div className="bg-white dark:bg-gray-900 rounded-xl ml-4 mr-4 md:ml-10 md:mr-10 text-center p-4 md:p-12 -mt-40 md:-mt-72 z-10 relative shadow-lg">
                <h2 className="sm:text-xl text-lg font-bold mb-2 text-center">
                  {course.projects.dashboardPage.title}
                </h2>
                <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0 text-left">
                  {course.projects.dashboardPage.description}
                </Markdown>
                <a
                  className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 mt-12"
                  title="Share on twitter"
                  href={course.projects.dashboardPage.figmaUrl}
                  rel="noopener"
                >
                  Download Figma File
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <svg
            width="7"
            height="155"
            viewBox="0 0 7 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="-1.5299e-07"
              x2="3.50001"
              y2="155"
              stroke="#B0B0B0"
              strokeWidth="7"
              strokeDasharray="10 10"
            />
          </svg>
        </div>

        <section className="relative bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow rounded-md border border-gray-100 mt-16 mb-16 px-10 py-10">
          <div
            className="absolute rounded-t-lg rounded-b-none left-0 top-4 -mt-5 h-3 w-full bg-gradient-to-r"
            style={{
              background: 'linear-gradient(to right, #0972BC 0%, #40A3DA 100%)',
            }}
          />
          <h1 className="sm:text-2xl text-xl font-bold mb-2 text-center">
            Reference Material
          </h1>

          <div className="max-w-screen-sm m-auto pb-4">
            <ul className="mt-10">
              {course?.resources?.map((lesson: any) => {
                return (
                  <li key={`${course.path}::${lesson.slug}`}>
                    <div className="flex items-center leading-tight py-2">
                      <Link href={lesson.path}>
                        <a className="py-1 flex space-x-2 items-center dark:text-gray-100 text-gray-700 hover:text-blue-600 group">
                          {/* prettier-ignore */}
                          <div className="flex-shrink-0"><svg className="text-gray-400 dark:text-gray-400 group-hover:text-blue-600" width={18} height={18} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z" fill="currentColor"/></g></svg></div>
                          <Markdown className="prose dark:prose-dark md:dark:prose-lg-dark md:prose-lg text-gray-700 dark:text-gray-100 mt-0 text-base md:text-lg">
                            {lesson.title}
                          </Markdown>
                        </a>
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <div className="flex justify-center">
          <svg
            width="7"
            height="155"
            viewBox="0 0 7 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="-1.5299e-07"
              x2="3.50001"
              y2="155"
              stroke="#B0B0B0"
              strokeWidth="7"
              strokeDasharray="10 10"
            />
          </svg>
        </div>

        <section>
          <div className="mt-10 text-center pb-12">
            <h1 className="text-2xl md:text-4xl font-bold pb-4">
              Did you complete the Portfolio Project Challenge?
            </h1>
            <p className="text-lg md:text-2xl leading-6 text-gray-500">
              Let us know what you built!
            </p>

            <a
              className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 mt-12"
              title="Share on twitter"
              href={course.projects.tweetUrl}
              rel="noopener"
            >
              Tweet @eggheadio
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export enum CARD_TYPES {
  SUMMARY = 'summary',
  SUMMARY_LARGE_IMAGE = 'summary_large_image',
}

export type Topic = {
  name: string
  label: string
  title?: string
}

type ProjectBriefProps = {
  topic: Topic
  className: any
  pageData?: any
  CTAComponent?: React.FC
  ogImage?: string
  verticalImage?: string
  cardType?: CARD_TYPES
}

const ProjectBrief: React.FC<ProjectBriefProps> = ({
  topic,
  children,
  ogImage,
  className,
  cardType = CARD_TYPES.SUMMARY_LARGE_IMAGE,
}) => {
  const description = `Build a localization engine that renders data based on the Edge location nearest to the application's user using Cloudflare Workers.`

  const title =
    topic.title ||
    `Introduction to Cloudflare Workers - Portfolio Project Challenge`

  return (
    <div className={`xl:px-0 dark:bg-gray-900 ${className ? className : ''}`}>
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType,
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url:
                ogImage ||
                `https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=landscape&v=20201104`,
            },
          ],
        }}
      />
      <div className="md:grid grid-cols-1 gap-5 justify-self-center space-y-5 md:space-y-0 dark:bg-gray-900">
        <div
          className={`bg-white grid grid-cols-8 h-full relative items-center overflow-hidden shadow rounded-md border border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 col-span-8`}
        >
          <div
            className="overflow-hidden sm:col-span-3 col-span-3 w-full h-full"
            style={{
              background: `url(https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=portrait&v=20201104)`,
              backgroundSize: 'cover',
              backgroundPosition: '38%',
            }}
          />
          <div className="sm:col-span-5 col-span-5 flex flex-col justify-start h-full px-12 py-12 pt-10">
            <h1 className="sm:text-2xl text-xl font-bold mb-2">
              {topic.label}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

const courseQuery = groq`
*[_type == 'resource' && externalId == $courseId]{
  title,
  path,
  tags,
  image,
  resources[]{
    title,
    path
  },
	projects[0] {
    title,
    description,
    "goals": resources[0] {
      features
    },
    "instructions": resources[1] {
      features
    },
    "pricingPage": resources[2] {
      title,
      description,
      image,
      "figmaUrl": urls[0].url,
    },
    "dashboardPage": resources[3] {
      title,
      description,
      image,
      "figmaUrl": urls[0].url,
    }
  },
}[0]
`

async function loadCourse(id: number) {
  const params = {
    courseId: id,
  }

  const course = await sanityClient.fetch(courseQuery, params)
  return course
}

export async function getStaticProps() {
  const course = await loadCourse(418653)

  console.log('THESE THE PROPS', {course})
  return {
    props: {
      course,
    },
  }
}

// delete and ask about this
// export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
//   const course = params && (await loadCourse(418653))

//   console.log('-----heeerrreeee--------', course)
//   if (course && course?.slug !== params?.slug) {
//     res.setHeader('Location', course.path)
//     res.statusCode = 302
//     res.end()
//     return {props: {}}
//   } else {
//     return {
//       props: {
//         course: 'hey',
//       },
//     }
//   }
// }

export default landingPage
