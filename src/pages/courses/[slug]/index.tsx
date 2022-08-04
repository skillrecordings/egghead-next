import * as React from 'react'
import useSWR from 'swr'
import {loadPlaylist, loadAuthedPlaylistForUser} from 'lib/playlists'
import {GetServerSideProps} from 'next'
import CollectionPageLayout from 'components/layouts/collection-page-layout'
import PhpCollectionPageLayout from 'components/layouts/php-collection-page-layout'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src'
const tracer = getTracer('course-page')

type CourseProps = {
  course: any
}

const Course: React.FC<CourseProps> = (props) => {
  const {data} = useSWR(`${props.course.slug}`, loadAuthedPlaylistForUser)

  const course = {...props.course, ...data}

  const {slug, lessons}: {slug: string; lessons: any} = course
  const items = get(course, 'items', [])

  const courseLessons = isEmpty(lessons)
    ? filter(items, (item) => {
        return ['lesson', 'talk'].includes(item.type)
      })
    : lessons

  return (
    <>
      {/*  Not setting a pattern. This hard coded ternary is just an experiment for */}
      {/* displaying modules on courses */}

      {slug === 'beginner-s-guide-to-php-33d9d04c' ? (
        <PhpCollectionPageLayout
          lessons={courseLessons}
          course={course}
          ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
        />
      ) : (
        <CollectionPageLayout
          lessons={courseLessons}
          course={course}
          ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
        />
      )}
    </>
  )
}

export default Course

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  params,
}) => {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})

  try {
    const course = params && (await loadPlaylist(params.slug as string))

    if (course && course?.slug !== params?.slug) {
      return {
        redirect: {
          destination: course.path,
          permanent: true,
        },
      }
    } else {
      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          course,
        },
      }
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
