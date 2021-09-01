import * as React from 'react'
import {FunctionComponent} from 'react'
import InProgressResource from 'components/pages/users/dashboard/activity/in-progress-resource'
import {isEmpty} from 'lodash'
import Spinner from 'components/spinner'

type InProgressSectionProps = {
  viewer: any
  progress: any
  currentCourse: any
  coursesInProgress: any
}

const showPlaceholder = true

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
      {isEmpty(progress) && (
        <div className="flex items-center justify-center w-full sm:py-16 py-10 sm:h-80 h-96 bg-gray-100 rounded-lg">
          <Spinner color="gray-500" />
        </div>
      )}
      {showPlaceholder && (
        <div className="w-full sm:h-80 h-96">
          <div className="flex justify-between align-text-top">
            <h2 className="md:text-xl text-lg mb-4 text-left">
              {isEmpty(viewer.name) ? (
                `Welcome back!`
              ) : (
                <>
                  Welcome back <b>{viewer.name}</b>!
                </>
              )}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <div className="h-64 flex flex-col items-center justify-center w-full rounded-lg border-2 border-gray-200 border-dashed text-center">
              <svg height="80" width="80">
                <rect width="80" height="80" fill="#888" />
              </svg>
              <h3 className="text-lg mb-1 mt-3 font-semibold">
                No courses in progress
              </h3>
              <div className="text-base leading-tight text-gray-600">
                You haven't started watching any courses yet.
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
  'Javascript',
  'Typescript',
  'CSS',
  'Node.js',
  'AWS',
  'Angular',
  'Next.js',
]

const OnboardingSurvey = () => {
  return (
    <div className="p-2">
      <h3 className="text-lg font-medium text-grey-600 mb-1">
        What topics are you interested in learning?
      </h3>
      <div className="text-sm text-gray-600 mb-6">
        Select as many as you like
      </div>
      <div className="flex flex-row flex-wrap">
        {surveyTopics.map((topic: string) => {
          return (
            <div className="flex items-center border border-gray-300 rounded px-4 py-2 mr-2 mb-2">
              <div className="text-base text-gray-700 font-medium">{topic}</div>
            </div>
          )
        })}
      </div>
      <div className="w-full flex justify-items-end justify-end">
        <button className="bg-blue-600 px-4 py-2 text-base text-white font-medium rounded">
          Submit
        </button>
      </div>
    </div>
  )
}

export default InProgressSection
