import * as React from 'react'

import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import {BookmarksList} from 'components/pages/user/components'
import {getAbilityFromToken} from 'server/ability'
import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {GetServerSideProps} from 'next/types'
import {useAccount} from 'hooks/use-account'
import Link from 'next/link'
import {trpc} from 'trpc/trpc.client'

type Instructor = {
  _id: string
  eggheadInstructorId: string
  person: {
    _id: string
    name: string
    image: string
  }
}

type Topic = {
  name: string
  id: string
}

const InstructorTabContent: React.FC<any> = ({
  instructors,
  topics,
}: {
  instructors: Instructor[]
  topics: Topic[]
}) => {
  const {instructorId} = useAccount()

  const {data, isLoading} = trpc.instructor.draftCourses.useQuery({
    instructorId,
  })

  return (
    <div className="space-y-10 md:space-y-14 xl:space-y-16">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ItemWrapper title="Draft Courses">
          <ul className="space-y-2">
            {data?.draftCourses?.map((course: any) => (
              <li key={course.slug}>
                <Link href={`/courses/${course.slug}`}>
                  <a className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-slate-900 bg-white  dark:bg-gray-800 rounded dark:text-gray-100 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>{course.title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </ItemWrapper>
      )}
    </div>
  )
}

export default InstructorTabContent
