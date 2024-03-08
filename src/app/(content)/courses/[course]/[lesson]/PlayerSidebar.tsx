'use client'

import {LessonResource} from '@/types'
import * as React from 'react'
import {use} from 'react'
import {GenericErrorBoundary} from '@/components/generic-error-boundary'
import {useEggheadPlayerPrefs} from '@/components/EggheadPlayer/use-egghead-player'
import {Tabs, TabPanels, TabPanel} from '@reach/tabs'
import Image from 'next/legacy/image'
import Link from '@/components/link'
import {track} from '@/utils/analytics'

export default function PlayerSidebar({
  lesson,
  courseLoader,
}: {
  lesson: LessonResource
  courseLoader: Promise<any>
}) {
  const {setPlayerPrefs, getPlayerPrefs} = useEggheadPlayerPrefs()
  const {activeSidebarTab} = getPlayerPrefs()

  return (
    <GenericErrorBoundary>
      <div className="relative h-full">
        <Tabs
          index={activeSidebarTab || 0}
          onChange={(tabIndex) => setPlayerPrefs({activeSidebarTab: tabIndex})}
          className="top-0 left-0 flex flex-col w-full h-full text-gray-900 bg-gray-100 shadow-sm lg:absolute dark:bg-gray-1000 dark:text-white"
        >
          <TabPanels className="relative flex-grow">
            <TabPanel className="inset-0 lg:absolute">
              <LessonListTab
                lesson={lesson}
                courseLoader={courseLoader}
                onActiveTab={activeSidebarTab === 0}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </GenericErrorBoundary>
  )
}

function LessonListTab({
  courseLoader,
  lesson,
  onActiveTab,
}: {
  courseLoader: Promise<any>
  lesson: LessonResource
  onActiveTab: boolean
}) {
  const course = use(courseLoader)

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-1000">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4 border-gray-100 sm:border-b dark:border-gray-800">
          <CourseHeader course={course} currentLessonSlug={lesson.slug} />
        </div>

        <div className="flex-grow overflow-hidden">
          <CollectionLessonsList />
        </div>
      </div>
    </div>
  )
}

function CourseHeader({
  course,
  currentLessonSlug,
}: {
  course: any
  currentLessonSlug: string
}) {
  return (
    <div className="flex items-center">
      <div className="relative flex-shrink-0 block w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
        <Image
          src={course.square_cover_480_url}
          alt={`illustration for ${course.title}`}
          layout="fill"
        />
      </div>
      <div className="ml-2 lg:ml-4">
        <span className="mb-px text-xs font-semibold text-gray-700 uppercase dark:text-gray-100">
          Course
        </span>
        <Link href={course.path}>
          <a
            onClick={() => {
              track(`clicked open course`, {
                lesson: currentLessonSlug,
              })
            }}
            className="hover:underline"
          >
            <h2 className="font-bold leading-tighter 2xl:text-lg">
              {course.title}
            </h2>
          </a>
        </Link>
      </div>
    </div>
  )
}

function CollectionLessonsList() {
  return <>test</>
}
