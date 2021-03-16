import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import Topic from 'components/search/components/topic'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import Image from 'next/image'
import {find} from 'lodash'

type LandingProps = {
  course: any
}

const landingPage: FunctionComponent<LandingProps> = (props) => {
  const {course} = props

  const {
    pricingPageFigmaUrl,
    crmPageFigmaUrl,
    pricingPageImageUrl,
    crmPageImageUrl,
  } = course?.projects

  const introduction: any = find(course?.projects?.content, {
    label: 'Introduction',
  })
  console.log('introduction', {introduction})
  const challenges: any = find(course?.projects?.content, {label: 'Challenges'})
  const pricingPageDescription: any = find(course?.projects?.content, {
    label: 'Pricing Page description',
  })
  const crmPageDescription: any = find(course?.projects?.content, {
    label: 'CRM page description',
  })
  const outcomes: any = find(course?.projects?.content, {label: 'Outcomes'})
  const challengeResource: any = find(course?.projects?.content, {
    label: 'Resource',
  })
  const nextSteps: any = find(course?.projects?.content, {label: 'Next Steps'})

  console.log({course})

  const title = course.title

  return (
    <>
      <NextSeo
        description={course.description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: course.description,
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/topic/${course.tags}?orientation=landscape&v=20201104`,
            },
          ],
        }}
      />
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
          <div className="flex flex-col justify-center items-start mx-auto max-w-screen-md mb-16 w-full px-4">
            <main className="prose dark:prose-dark prose-lg max-w-none w-full">
              <Markdown>{introduction.text}</Markdown>
              <Markdown>{challenges.text}</Markdown>

              <section className="relative dark:text-gray-200 shadow rounded-md mt-16 mb-16 p-10">
                <h1 className="sm:text-2xl text-xl font-bold mb-2 text-center">
                  Project Challenges
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-16 mb-16 gap-5">
                  <div className="mb-8 md:mb-0 text-center relative">
                    <Image
                      src={pricingPageImageUrl}
                      height="780"
                      width="695"
                      className="rounded-md z-0"
                    />

                    <div className="bg-white dark:bg-gray-900 rounded-xl ml-4 mr-4 md:ml-10 md:mr-10 text-center p-4 md:p-12 -mt-40 md:-mt-72 z-20 relative shadow-lg">
                      <h2 className="sm:text-xl text-lg font-bold mb-2 text-center">
                        Pricing Page
                      </h2>
                      <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0 text-left">
                        {pricingPageDescription.text}
                      </Markdown>
                      <a
                        className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 mt-12"
                        title="Share on twitter"
                        href={pricingPageFigmaUrl}
                        rel="noopener"
                      >
                        Download Figma File
                      </a>
                    </div>
                  </div>
                  <div className="text-center">
                    <Image
                      src={crmPageImageUrl}
                      height="780"
                      width="695"
                      className="rounded-md z-0"
                    />
                    <div className="bg-white dark:bg-gray-900 rounded-xl ml-4 mr-4 md:ml-10 md:mr-10 text-center p-4 md:p-12 -mt-40 md:-mt-72 z-10 relative shadow-lg">
                      <h2 className="sm:text-xl text-lg font-bold mb-2 text-center">
                        Dashboard Page
                      </h2>
                      <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0 text-left">
                        {crmPageDescription.text}
                      </Markdown>
                      <a
                        className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 mt-12"
                        title="Share on twitter"
                        href={crmPageFigmaUrl}
                        rel="noopener"
                      >
                        Download Figma File
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              <Markdown>{outcomes.text}</Markdown>
              <Markdown>{challengeResource.text}</Markdown>
              <Markdown>{nextSteps.text}</Markdown>
            </main>
          </div>
        </div>
      </div>
    </>
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
		content,
    "pricingPageFigmaUrl": urls[0].url,
    "crmPageFigmaUrl": urls[1].url,
    "pricingPageImageUrl": images[0].url,
    "crmPageImageUrl": images[1].url,
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

export default landingPage
