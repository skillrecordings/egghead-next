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

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

  if (ability.can('upload', 'Video')) {
    return {
      props: {},
    }
  } else {
    return {
      redirect: {
        destination: '/user/membership',
        permanent: false,
      },
    }
  }
}

const Button: React.FC<{
  onClick?: () => void
  cta?: string
  classNames?: string
}> = ({onClick, cta, classNames}) => {
  return (
    <Link href="/courses/new">
      <a
        onClick={onClick}
        className={`text-center justify-center items-center mt-4 px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 sm:block hidden ${classNames}`}
      >
        {cta}
      </a>
    </Link>
  )
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
      <ItemWrapper title="New Course">
        <p className="w-[75ch] text-slate-600 dark:text-slate-100">
          If you have an idea for a course, you can start by clicking the button
          below and describing the course that you want to build.
        </p>
        <Button cta="Create a Course" />
      </ItemWrapper>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ItemWrapper title="WIP Courses">
          <ul className="space-y-2">
            {data?.draftCourses?.map((course: any) => (
              <li key={course.slug}>
                <Link href={`/drafts/${course.slug}`}>
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
