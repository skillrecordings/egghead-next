import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import Image from 'next/image'
import {find} from 'lodash'

type LandingProps = {
  course: any
}

const landingPage: FunctionComponent<React.PropsWithChildren<LandingProps>> = (
  props,
) => {
  const {course} = props

  const {
    pricingPageFigmaUrl,
    crmPageFigmaUrl,
    pricingPageImageUrl,
    crmPageImageUrl,
    ogImage,
  } = course?.projects

  const introduction: any = find(course?.projects?.content, {
    label: 'Introduction',
  })
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
  const pricingPageChallenge: any = find(course?.projects?.content, {
    label: 'Pricing page challenge',
  })
  const dashboardPageChallenge: any = find(course?.projects?.content, {
    label: 'Dashboard page challenge',
  })
  const studyQuestions: any = find(course?.projects?.content, {
    label: 'Self-Study Questions',
  })
  const bestPractices: any = find(course?.projects?.content, {
    label: 'Best Practices',
  })
  const Submission: any = find(course?.projects?.content, {label: 'Submission'})

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
              url: ogImage,
            },
          ],
        }}
      />
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container pb-10 mt-5 mb-10">
          <div className="pt-10 mb-16 text-center">
            <div className="mb-10">
              <Image priority src={course.image} height="270" width="270" />
            </div>
            <p className="text-lg leading-6 text-gray-500 md:text-2xl">
              Portfolio Project
            </p>
            <h1 className="mt-2 text-2xl font-bold md:text-4xl">
              {course.projects.title}
            </h1>
          </div>
          <div className="flex flex-col items-start justify-center w-full max-w-screen-md mx-auto mb-16">
            <main className="w-full prose prose-lg dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 max-w-none">
              <Markdown>{introduction.text}</Markdown>
              <Markdown>{challenges.text}</Markdown>

              <section className="relative mt-16 mb-16 ml-0 mr-0 dark:text-gray-200 md:-ml-20 md:-mr-20">
                <h2 className="mb-2 font-bold text-center">
                  Project Challenges
                </h2>
                <div className="grid grid-cols-1 gap-5 mt-16 mb-16 lg:grid-cols-2">
                  <div className="relative mb-8 text-center md:mb-0">
                    <Image
                      src={pricingPageImageUrl}
                      height="780"
                      width="695"
                      className="z-0 rounded-md"
                    />

                    <div className="relative z-20 p-4 ml-4 mr-4 -mt-32 text-center bg-gray-50 dark:bg-gray-900 rounded-xl md:p-8">
                      <h3
                        className="m-2 mb-2 text-lg font-medium text-center sm:text-xl"
                        style={{margin: 0}}
                      >
                        Pricing Page Layout
                      </h3>
                      <Markdown className="pt-2 mt-0 text-sm leading-normal prose text-left text-gray-800 dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:text-base dark:text-gray-200">
                        {pricingPageDescription.text}
                      </Markdown>
                      <a
                        className="inline-flex items-center justify-center px-6 py-4 mt-12 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700"
                        title="Share on twitter"
                        href={pricingPageFigmaUrl}
                        style={{
                          color: 'white',
                          textDecoration: 'none',
                        }}
                        target="_blank"
                        rel="noreferrer"
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
                      className="z-0 rounded-md"
                    />
                    <div className="relative z-10 p-4 ml-4 mr-4 -mt-32 text-center bg-gray-50 dark:bg-gray-900 rounded-xl md:p-8 ">
                      <h3
                        className="m-2 mb-2 text-lg font-medium text-center sm:text-xl"
                        style={{margin: 0}}
                      >
                        Dashboard Page Layout
                      </h3>
                      <Markdown className="pt-2 mt-0 text-sm leading-normal prose text-left text-gray-800 dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:text-base dark:text-gray-200">
                        {crmPageDescription.text}
                      </Markdown>
                      <a
                        className="inline-flex items-center justify-center px-6 py-4 mt-12 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700"
                        title="Share on twitter"
                        href={crmPageFigmaUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: 'white',
                          textDecoration: 'none',
                        }}
                      >
                        Download Figma File
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              <Markdown>{outcomes.text}</Markdown>
              <section className="relative mt-16 mb-16 ml-0 mr-0 dark:text-gray-200 md:-ml-28 md:-mr-28">
                <div className="grid grid-cols-1 gap-5 mt-16 mb-16 lg:grid-cols-2">
                  <div className="relative mb-8 text-center md:mb-0">
                    <div className="relative z-20 p-4 text-center bg-white shadow-lg dark:bg-gray-800 rounded-xl md:p-8 h-full">
                      <Markdown className="pt-2 mt-0 text-sm leading-normal prose text-left text-gray-800 dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:text-base dark:text-gray-200">
                        {pricingPageChallenge.text}
                      </Markdown>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="relative z-10 p-4 text-center bg-white shadow-lg dark:bg-gray-800 rounded-xl md:p-8">
                      <Markdown className="pt-2 mt-0 text-sm leading-normal prose text-left text-gray-800 dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:text-base dark:text-gray-200">
                        {dashboardPageChallenge.text}
                      </Markdown>
                    </div>
                  </div>
                </div>
              </section>

              <Markdown>{studyQuestions.text}</Markdown>
              <Markdown>{bestPractices.text}</Markdown>
              <Markdown>{challengeResource.text}</Markdown>
              <Markdown>{Submission.text}</Markdown>
              <a
                className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white transition-all duration-200 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700"
                title="Share on twitter"
                href={course.projects.tweetCTA}
                rel="noopener"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                Tweet @eggheadio
              </a>
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
    "tweetCTA": urls[2].url,
    "pricingPageImageUrl": images[0].url,
    "crmPageImageUrl": images[1].url,
    "ogImage": images[2].url,
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

  return {
    props: {
      course,
    },
  }
}

export default landingPage
