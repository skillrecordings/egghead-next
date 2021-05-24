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

const InProgressSection: FunctionComponent<InProgressSectionProps> = ({
  viewer,
  progress,
  currentCourse,
  coursesInProgress,
}) => {
  return (
    <section className="pt-4 pb-10">
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
      {isEmpty(progress) ? (
        <div className="flex items-center justify-center w-full sm:py-16 py-8">
          <Spinner color="gray-500" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <InProgressResource
            className="h-full flex items-center w-full"
            resource={currentCourse.collection}
          />
          {coursesInProgress && (
            <div
              className={`${coursesInProgress.length > 1 ? 'grid gap-4' : ''}`}
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
      )}
    </section>
  )
}

export default InProgressSection
