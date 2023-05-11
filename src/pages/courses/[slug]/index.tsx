import * as React from 'react'
import useSWR from 'swr'
import {loadPlaylist, loadAuthedPlaylistForUser} from 'lib/playlists'
import {GetServerSideProps} from 'next'
import CollectionPageLayout from 'components/layouts/collection-page-layout'
import DraftCourseLayout from 'components/layouts/draft-course-page-layout'
import MultiModuleCollectionPageLayout from 'components/layouts/multi-module-collection-page-layout'
import PhpCollectionPageLayout from 'components/layouts/php-collection-page-layout'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import getTracer from 'utils/honeycomb-tracer'
import {setupHttpTracing} from 'utils/tracing-js/dist/src'
import courseDependencies from 'data/courseDependencies'
import {loadDraftSanityCourse} from 'lib/courses'
import {getAbilityFromToken} from 'server/ability'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {useViewer} from 'context/viewer-context'
import {useRouter} from 'next/router'
const tracer = getTracer('course-page')

type CourseProps = {
  course: any
  draftCourse: any
}

const Course: React.FC<CourseProps> = (props) => {
  const {data} = useSWR(`${props?.course?.slug}`, loadAuthedPlaylistForUser)
  const router = useRouter()
  const {viewer, loading} = useViewer()

  if (props.draftCourse && viewer?.roles.includes('instructor')) {
    return (
      <DraftCourseLayout
        lessons={props.draftCourse.lessons}
        course={props.draftCourse}
        ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${props.draftCourse.slug}?v=20201103`}
      />
    )
  }

  const course = {...props.course, ...data}

  const {slug, lessons}: {slug: string; lessons: any} = course
  const items = get(course, 'items', [])

  const courseLessons = isEmpty(lessons)
    ? filter(items, (item) => {
        return ['lesson', 'talk'].includes(item.type)
      })
    : lessons

  const multiModuleCourse = courseDependencies(slug)

  switch (true) {
    case slug === 'a-complete-introduction-to-php-33d9d04c':
      return (
        <PhpCollectionPageLayout
          lessons={courseLessons}
          course={course}
          ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
        />
      )
    case multiModuleCourse?.multiModuleCourse:
      return (
        <MultiModuleCollectionPageLayout
          lessons={courseLessons}
          course={course}
          ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
        />
      )
  }

  return (
    <CollectionPageLayout
      lessons={courseLessons}
      course={course}
      ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
    />
  )
}

export default Course

const loadDraftCourse = async (slug: string) => {
  try {
    const draftCourse = slug && (await loadDraftSanityCourse(slug))
    if (
      draftCourse &&
      (draftCourse.productionProcessState === 'new' ||
        draftCourse.productionProcessState === 'drafting')
    ) {
      return draftCourse
    }
  } catch (error) {
    return undefined
  }
}

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
    const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])
    const draftCourse = params && (await loadDraftCourse(params.slug as string))
    if (draftCourse && ability.can('upload', 'Video')) {
      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          draftCourse,
        },
      }
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
