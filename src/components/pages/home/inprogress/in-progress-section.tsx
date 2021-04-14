import * as React from 'react'
import {FunctionComponent} from 'react'
import InProgressResource from '../../users/dashboard/activity/inprogress-resource'
import {isEmpty} from 'lodash'

type InProgressSectionProps = {
  viewer: any
  progress: any
  courseInProgress: any
  coursesInProgress: any
}

const InProgressSection: FunctionComponent<InProgressSectionProps> = ({
  viewer,
  progress,
  courseInProgress,
  coursesInProgress,
}) => {
  return (
    <>
      {viewer && !isEmpty(progress) && (
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
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <InProgressResource
              className="h-full flex items-center w-full"
              resource={courseInProgress.collection}
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
        </section>
      )}
    </>
  )
}

export default InProgressSection
