import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import Topic from 'components/search/components/topic'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import Image from 'next/image'

type LandingProps = {
  course: any
}

const landingPage: FunctionComponent<LandingProps> = (props) => {
  const {course} = props

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
              <Markdown>{course.projects.description}</Markdown>
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
