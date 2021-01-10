import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'
import Share from 'components/share'

const RecommendNextStepOverlay: React.FunctionComponent<{
  lesson: any
}> = ({lesson}) => {
  const courseImage = lesson?.collection?.square_cover_480_url
  return (
    <div className="flex flex-col items-center">
      {courseImage && (
        <div className="w-12 h-12 md:w-16 md:h-16 lg:w-32 lg:h-32 relative">
          <Image
            src={courseImage}
            alt={`illustration of ${lesson?.collection.title} course`}
            layout="fill"
          />
        </div>
      )}
      <h2 className="text-md md:text-lg lg:text-md  mt-4 text-center">
        Congrats, you finished!
      </h2>
      <h3 className="text-md md:text-xl lg:text-2xl  mt-2 text-center">
        {' '}
        <span className="font-semibold">
          {lesson?.collection ? lesson?.collection?.title : lesson.title}
        </span>
      </h3>
      <Share
        resource={lesson?.collection}
        instructor={lesson?.instructor}
        className="text-black flex items-center mt-3"
        label
      >
        <div className="max-w-md mt-2">
          If this course was useful for you, please share it with your
          colleagues. It will really help{' '}
          {lesson.instructor.full_name.split(' ')[0]} get the word out.
        </div>
      </Share>
      <div className="mt-8 text-xs md:mt-12 lg:mt-20">
        Ready for something new?{' '}
        <Link href="/">
          <a
            onClick={() => {
              track('clicked ready for new', {
                collection: lesson?.collection.slug,
              })
            }}
            className="font-semibold"
          >
            Click here to start your next project.
          </a>
        </Link>
      </div>
    </div>
  )
}

export default RecommendNextStepOverlay
