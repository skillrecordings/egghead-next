import * as React from 'react'
import {FunctionComponent} from 'react'
import InProgressResource from 'components/pages/users/dashboard/activity/in-progress-resource'
import {isEmpty} from 'lodash'
import Spinner from 'components/spinner'
import EmptyCourseIcon from 'components/icons/empty-course-icon'

type InProgressSectionProps = {
  viewer: any
  progress: any
  currentCourse: any
  coursesInProgress: any
}

const showPlaceholder = true

const showLoader = false

const InProgressSection: FunctionComponent<InProgressSectionProps> = ({
  viewer,
  progress,
  currentCourse,
  coursesInProgress,
}) => {
  return (
    <section className="pt-4 pb-8">
      {currentCourse && !showPlaceholder && (
        <>
          <div className="flex justify-between align-text-top">
            <h2 className="md:text-xl text-lg mb-4 text-left">
              {isEmpty(viewer.name) ? (
                `Welcome back!`
              ) : (
                <>
                  Welcome back <b>{viewer.name}</b>!
                </>
              )}{' '}
              Ready to continue learning?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <InProgressResource
              className="h-full flex items-center w-full"
              resource={currentCourse.collection}
            />
            {coursesInProgress && (
              <div
                className={`${
                  coursesInProgress.length > 1 ? 'grid gap-4' : ''
                }`}
              >
                {coursesInProgress.map((item: any) => {
                  return (
                    <InProgressResource
                      small
                      key={item.slug}
                      resource={item.collection}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
      {showLoader && (
        <div className="flex items-center justify-center w-full sm:py-16 py-10 sm:h-80 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Spinner color="gray-500" />
        </div>
      )}
      {showPlaceholder && (
        <div className="w-full">
          <div className="flex justify-between align-text-top">
            <h2 className="md:text-xl text-lg mb-3 text-left font-semibold">
              {isEmpty(viewer.name) ? (
                `Welcome back!`
              ) : (
                <>
                  Welcome back <b>{viewer.name}</b>!
                </>
              )}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-10">
            <div className="h-64 flex flex-col items-center justify-center w-full rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 border-dashed text-center px-6">
              <EmptyCourseIcon />
              <h3 className="text-lg mb-1 mt-4 font-medium text-gray-600 dark:text-gray-400">
                No courses in progress
              </h3>
              <div className="text-sm leading-tight text-gray-500">
                Once you start watching courses, your progress will appear here
              </div>
            </div>
            <OnboardingSurvey />
          </div>
        </div>
      )}
    </section>
  )
}

const surveyTopics = [
  'React',
  'CSS',
  'JavaScript',
  'Node.js',
  'Vue',
  'AWS',
  'Angular',
  'Next.js',
  'TypeScript',
  'Docker',
]

const OnboardingSurvey = () => {
  return (
    <div className="flex flex-col py-2">
      <div>
        <h3 className="text-lg font-medium text-grey-600 mb-1">
          What topics are you interested in learning?
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select as many as you want. We'll use these to recommend learning
          material for you.
        </div>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-4">
        {surveyTopics.map((topic: string) => {
          return (
            <div className="pr-4 py-2">
              <label for={topic}>
                <input
                  className="w-6 h-6 rounded mr-2 border-gray-300"
                  id={topic}
                  type="checkbox"
                />
                {topic}
              </label>
            </div>
          )
        })}
      </div>
      <div className="w-full flex justify-items-end justify-end mt-2">
        <button className="bg-blue-600 hover:bg-blue-700 relative right-2 lg:right-6 transition-colors duration-300 px-4 py-2 text-base text-white rounded-md">
          Submit topics
        </button>
      </div>
    </div>
  )
}

export default InProgressSection
