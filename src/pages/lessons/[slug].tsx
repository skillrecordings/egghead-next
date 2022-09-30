import * as React from 'react'
import {GetServerSideProps} from 'next'
import {loadLesson} from 'lib/lessons'
import {LessonResource, VideoResource} from 'types'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src/index'
import Lesson from 'components/lessons/Lesson'

const tracer = getTracer('lesson-page')

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
}) {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  try {
    const initialLesson: LessonResource | undefined =
      params && (await loadLesson(params.slug as string))

    if (initialLesson && initialLesson?.slug !== params?.slug) {
      return {
        redirect: {
          destination: initialLesson.path,
          permanent: true,
        },
      }
    } else {
      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          initialLesson,
        },
      }
    }
  } catch (e) {
    console.error(e)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

const LessonPage: React.FC<{initialLesson: VideoResource}> = ({
  initialLesson,
  ...props
}) => {
  return <Lesson initialLesson={initialLesson} {...props} />
}

export default LessonPage
