import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import Image from 'next/image'
import {find} from 'lodash'
import {track} from 'utils/analytics'

type LandingProps = {
  course: any
}

const landingPage: FunctionComponent<LandingProps> = (props) => {
  const {course} = props
  const {title, ogImage, path, image, tags} = course

  const introduction: any = find(course?.projects?.content, {
    label: 'Introduction',
  })
  const projectBrief: any = find(course?.projects?.content, {
    label: 'Project Brief',
  })
  const appRequirements: any = find(course?.projects?.content, {
    label: 'App Requirements',
  })
  const appData: any = find(course?.projects?.content, {
    label: 'App Data',
  })
  const developmentStandards: any = find(course?.projects?.content, {
    label: 'Development Standards',
  })
  const stretchGoal: any = find(course?.projects?.content, {
    label: 'Stretch Goal',
  })
  const appDesign: any = find(course?.projects?.content, {
    label: 'App Design',
  })
  const Submission: any = find(course?.projects?.content, {label: 'Submission'})

  const {productCard, productPage} = course?.projects

  console.log(course)

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
      <div className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
        <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto">
          <div className="mt-10 mb-16 text-center">
            <div className="mb-10">
              <Image priority src={image} height="270" width="270" />
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
              <Markdown>{projectBrief.text}</Markdown>
              <section className="flex-none sm:flex sm:justify-between sm:mt-4 w-full">
                <Markdown className="col-span-1">
                  {appRequirements.text}
                </Markdown>
                <Markdown className="rounded-md sm:mt-24">
                  {appData.text}
                </Markdown>
              </section>
              <Markdown>{developmentStandards.text}</Markdown>

              <ProjectCTA
                title="Show you're hard won Vue skills. Make it stick."
                meta="Fork the codesandbox and get started with your solution."
                buttonText="Start the Vue Fundamentals Project"
                projectLink={course.projects.projectLink}
              />
              <Markdown>{stretchGoal.text}</Markdown>
              <Markdown>{appDesign.text}</Markdown>
              <Markdown>{productPage.description}</Markdown>
              <Image
                src={productPage.url}
                height="826"
                width="736"
                className="rounded-md z-0"
              />
              <section className="flex-none sm:flex sm:justify-between sm:mt-4 w-full">
                <Markdown className="sm:w-1/2 mr-4 w-full">
                  {productCard.description}
                </Markdown>
                <span className="mt-4 flex justify-center">
                  <Image
                    src={productCard.url}
                    height="471"
                    width="296"
                    layout="fixed"
                    className="rounded-md z-0"
                  />
                </span>
              </section>
              <Markdown>{Submission.text}</Markdown>
              <a
                className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:scale-105 transform hover:shadow-xl  hover:bg-blue-700 ease-in-out duration-200"
                title="Share on twitter"
                onClick={() =>
                  track(`clicked Vue 3 fundamentals challenge CTA`)
                }
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

type projectCTAProps = {
  title: string
  meta: string
  buttonText: string
  projectLink: string
}

const ProjectCTA = ({
  title,
  meta,
  buttonText,
  projectLink,
}: projectCTAProps) => {
  return (
    <div className="flex flex-col items-center p-16 my-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <h1 className="text-black dark:text-white text-2xl tracking-tight font-light text-center max-w-xl mx-auto">
          {title}
        </h1>
        <p className="font-normal text-blue-600 sm:text-lg text-base mt-4">
          {meta}
        </p>
        <div className="flex justify-center items-center w-full">
          <a
            href={projectLink}
            className="mt-4 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 transform hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md"
            title="Open Project in Codesandbox"
            rel="noopener noreferrer"
            target="_blank"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            {buttonText}
          </a>
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
  'ogImage': images[label == 'og-image'][0].url,
  resources[]{
    title,
    path
  },
	projects[0] {
    title,
    description,
		content,
    "productCard": images[label == 'product-card-design'][0] {
    url,
    description
  },
    "productPage": images[label == 'product-page-design'][0] {
    url,
    description
  },
  "tweetCTA": urls[label == 'tweetCTA'][0].url,
  "projectLink": urls[label == 'projectLink'][0].url,
  },
}[0]`

async function loadCourse(id: number) {
  const params = {
    courseId: id,
  }

  const course = await sanityClient.fetch(courseQuery, params)
  return course
}

export async function getStaticProps() {
  const course = await loadCourse(447580)

  return {
    props: {
      course,
    },
  }
}

export default landingPage
