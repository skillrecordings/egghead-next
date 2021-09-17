import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import {LessonResource} from 'types'
import {track} from 'utils/analytics'

type JoinCTAProps = {
  lesson: LessonResource
}

const GoProCtaOverlay: FunctionComponent<JoinCTAProps> = ({lesson}) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="sm:text-2xl text-xl leading-tighter tracking-tight font-light text-center">
        This lesson is an{' '}
        <strong className="font-bold">egghead member exclusive</strong>.
      </h2>
      <Link href="/pricing">
        <a
          onClick={() => {
            track('clicked join cta on blocked lesson', {
              lesson: lesson.slug,
            })
          }}
          className="mt-8 text-white py-3 px-5 rounded-md text-base font-semibold bg-blue-600 hover:bg-indigo-600 hover:shadow-xl transition-all ease-in-out duration-300 hover:scale-105"
        >
          Become a Member
        </a>
      </Link>
    </div>
  )
}

export default GoProCtaOverlay
