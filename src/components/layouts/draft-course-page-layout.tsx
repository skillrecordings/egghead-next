import * as React from 'react'
import InstructorProfile from 'components/pages/courses/instructor-profile'
import {PlusIcon} from '@heroicons/react/outline'
import {get, truncate} from 'lodash'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'
import ClockIcon from '../icons/clock'
import CommunityResource from 'components/community-resource'
import TagList from './tag-list'
import ClosedCaptionIcon from '../icons/closed-captioning'
import {logCollectionResource} from './collection-page-layout'
import {TitleChangeForm} from 'components/course/draft/title-change-form'
import {DescriptionChangeForm} from 'components/course/draft/description-change-form'
import {LessonCreationDialog} from 'components/course/draft/lesson-creation-dialog'
import {LessonList} from 'components/course/draft/lesson-list'
import {CourseArtwork} from 'components/course/draft/course-artwork'
import type {SanityDraftCourse, SanityLesson} from 'lib/courses'

type CoursePageLayoutProps = {
  lessons: SanityLesson[]
  course: SanityDraftCourse
  ogImageUrl: string
}

export const Duration: React.FunctionComponent<
  React.PropsWithChildren<{duration: string}>
> = ({duration}) => (
  <div className="flex flex-row items-center">
    <ClockIcon className="w-4 h-4 mr-1 opacity-60" />
    <span>{duration}</span>{' '}
    <ClosedCaptionIcon className="inline-block w-4 h-4 ml-2" />
  </div>
)

export type RequestDraftCourseFormProps = {
  description?: string
  title?: string
  sanityCourseId: string
}

const DraftCourseLayout: React.FunctionComponent<
  React.PropsWithChildren<CoursePageLayoutProps>
> = ({lessons = [], course, ogImageUrl}) => {
  const {
    id: sanityCourseId,
    title,
    square_cover_480_url,
    instructor,
    description,
    tags,
  } = course

  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)

  logCollectionResource(course as any)

  const {full_name: name, avatar_url, slug} = instructor || {}

  const image_url = square_cover_480_url

  const imageIsTag = image_url.includes('tags/image')

  return (
    <>
      <NextSeo
        description={truncate(removeMarkdown(description), {length: 155})}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: truncate(removeMarkdown(description), {length: 155}),
          site_name: 'egghead',
        }}
      />
      <div className="container pb-8 sm:pb-16 dark:text-gray-100">
        <div className="left-0 grid w-full grid-cols-1 gap-5 mt-10 mb-4 rounded-md md:grid-cols-5 md:gap-16">
          <div className="flex flex-col w-full h-full mx-auto md:col-span-3 md:row-start-auto max-w-screen-2xl">
            <header>
              {image_url && (
                <div className="flex items-center justify-center md:hidden">
                  <CourseArtwork
                    course={course}
                    trackText="clicked course image on mobile"
                    size={imageIsTag ? 100 : 200}
                  />
                </div>
              )}
              <div className="flex justify-center my-2 space-x-3 md:justify-start md:m-0 md:mb-2">
                <div
                  className="items-center px-2 py-1 text-xs font-bold text-center text-white uppercase bg-orange-500 rounded-full cursor-default"
                  title="Draft Course"
                >
                  Draft
                </div>
              </div>

              <TitleChangeForm title={title} sanityCourseId={sanityCourseId} />

              {/* Start of metadata block */}
              <div className="flex flex-col items-center my-6 space-y-3 md:space-y-4 md:items-start">
                {instructor && (
                  <InstructorProfile
                    name={name}
                    avatar_url={avatar_url}
                    url={slug}
                  />
                )}

                <div className="flex flex-col flex-wrap items-center md:flex-row space-y-3 md:space-y-0">
                  <TagList tags={tags} courseSlug={course.slug} />
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span>&middot;</span>
                    <div className="flex items-center space-x-1">
                      <span>{lessons.length} lessons</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of metadata block */}

              <DescriptionChangeForm
                description={description}
                sanityCourseId={sanityCourseId}
              />

              <div className="block pt-5 md:hidden">
                {get(course, 'access_state') === 'free' && (
                  <div className="p-4 my-8 border border-gray-100 rounded-md bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                    <CommunityResource type="course" />
                  </div>
                )}
              </div>
            </header>
          </div>
          <div className="flex flex-col items-center justify-start mb-4 md:col-span-2 md:mb-0">
            {image_url && (
              <div className="hidden md:block">
                <CourseArtwork
                  course={course}
                  size={imageIsTag ? 200 : 420}
                  trackText="clicked course image"
                />
              </div>
            )}
            <section className="mt-8">
              <div className="flex flex-col mb-2 space-y-4 ">
                <div className="flex flex-row gap-4 justify-between">
                  <div>
                    <h2 className="text-lg font-bold cursor-default">
                      Conent Editor
                    </h2>
                    <div className="text-sm font-normal text-gray-600 dark:text-gray-300 cursor-default">
                      {lessons.length} lessons{' '}
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-500  hover:bg-blue-400  text-white  rounded flex flex-row gap-1 align-middle justify-center place-self-center font-medium"
                    onClick={() => setDialogIsOpen(true)}
                  >
                    <PlusIcon className="self-center" height={16} />
                    Add Lesson
                  </button>
                </div>
              </div>

              <LessonCreationDialog
                isOpen={dialogIsOpen}
                setIsOpen={setDialogIsOpen}
                sanityCourseId={sanityCourseId}
              />
              <LessonList
                courseId={sanityCourseId}
                setDialog={setDialogIsOpen}
              />
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default DraftCourseLayout
