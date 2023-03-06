import * as React from 'react'
import {GetServerSideProps} from 'next'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src'
import {loadWipSanityCourse} from 'lib/courses'
import {getAbilityFromToken} from 'server/ability'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
const tracer = getTracer('course-page')

type CourseProps = {
  course: any
}

const Course: React.FC<CourseProps> = ({course}) => {
  return (
    <div className="container pb-8 sm:pb-16 dark:text-gray-100">
      <div className="left-0 grid w-full grid-cols-1 gap-5 mt-10 mb-4 rounded-md md:grid-cols-5 md:gap-16">
        <div className="flex flex-col w-full h-full mx-auto md:col-span-3 md:row-start-auto max-w-screen-2xl">
          <pre>{JSON.stringify(course, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Course

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  params,
}) => {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])
  if (ability.cannot('upload', 'Video')) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  try {
    const course = params && (await loadWipSanityCourse(params.slug as string))

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return {
      props: {
        course,
      },
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
