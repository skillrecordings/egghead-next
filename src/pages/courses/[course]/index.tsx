import * as React from 'react'
import useSWR from 'swr'
import {loadPlaylist, loadAuthedPlaylistForUser} from '@/lib/playlists'
import {GetServerSideProps} from 'next'
import CollectionPageLayout from '@/components/layouts/collection-page-layout'
import DraftCourseLayout from '@/components/layouts/draft-course-page-layout'
import MultiModuleCollectionPageLayout from '@/components/layouts/multi-module-collection-page-layout'
import PhpCollectionPageLayout from '@/components/layouts/php-collection-page-layout'
import ScrimbaPageLayout from '@/components/layouts/scrimba-course-layout'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import getTracer from '@/utils/honeycomb-tracer'
import {setupHttpTracing} from '@/utils/tracing-js/dist/src'
import courseDependencies from '@/data/courseDependencies'
import {loadDraftSanityCourse} from '@/lib/courses'
import {getAbilityFromToken} from '@/server/ability'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {useViewer} from '@/context/viewer-context'
import {useRouter} from 'next/router'
const tracer = getTracer('course-page')

type CourseProps = {
  course: any
  draftCourse: any
}

const Course: React.FC<React.PropsWithChildren<CourseProps>> = (props) => {
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

  const {slug, sections, lessons}: {slug: string; sections: any; lessons: any} =
    props.course

  const items = get(props.course, 'items', [])

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
          course={props.course}
          ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
        />
      )
    case slug === 'build-ai-apps-with-chatgpt-dall-e-and-gpt-4-9bc61e99':
      return (
        <ScrimbaPageLayout
          sections={sections}
          lessons={courseLessons}
          course={props.course}
          ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
        />
      )
    case multiModuleCourse?.multiModuleCourse:
      return (
        <MultiModuleCollectionPageLayout
          lessons={courseLessons}
          course={props.course}
          ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
        />
      )
  }

  return (
    <CollectionPageLayout
      lessons={courseLessons}
      course={props.course}
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

const getSlugFromPath = (path: string) => {
  return path.split('/').pop()
}

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  params,
  query,
}) => {
  setupHttpTracing({name: getServerSideProps.name, tracer, req, res})
  try {
    const course =
      params &&
      (await loadPlaylist(
        params.course as string,
        req.cookies[ACCESS_TOKEN_KEY],
      ))

    const courseSlug = getSlugFromPath(course?.path)
    if (course && courseSlug !== params?.course) {
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
    const draftCourse =
      params && (await loadDraftCourse(params.course as string))
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
