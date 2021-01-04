import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'

const RecommendNextStepOverlay: React.FunctionComponent<{
  lesson: any
}> = ({lesson}) => {
  const courseImage = lesson?.course?.square_cover_480_url
  return (
    <>
      {courseImage && (
        <div className="w-12 h-12 md:w-16 md:h-16 lg:w-32 lg:h-32 relative">
          <Image
            src={courseImage}
            alt={`illustration of ${lesson.course.title} course`}
            layout="fill"
          />
        </div>
      )}
      <div className="mt-4 md:mt-6 lg:mt-8">What's Next?</div>
      <h3 className="text-md md:text-lg lg:text-xl font-semibold mt-4 text-center">
        Congrats, you finished!
      </h3>
      <div className="mt-8 text-xs md:mt-12 lg:mt-20">
        Ready for something new?{' '}
        <Link href="/">
          <a
            onClick={() => {
              track('clicked ready for new', {
                lesson: lesson.slug,
              })
            }}
            className="font-semibold"
          >
            Click here to start your next project.
          </a>
        </Link>
      </div>
    </>
  )
}

export default RecommendNextStepOverlay
