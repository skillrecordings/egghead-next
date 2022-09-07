import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {track} from 'utils/analytics'
import Share from 'components/share'
import {useTrackComponent} from 'hooks/use-track-component'
import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'

const RecommendNextStepOverlay: React.FunctionComponent<{
  lesson: any
}> = ({lesson}) => {
  const courseImage = lesson?.collection?.square_cover_480_url

  useTrackComponent('show recommendations', {
    course: lesson?.collection?.slug,
    lesson: lesson?.slug,
  })

  return (
    <OverlayWrapper>
      <div className="flex flex-col items-center justify-center p-4">
        {courseImage && (
          <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 relative">
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
          resource={lesson?.collection || lesson}
          instructor={lesson?.instructor}
          className="text-black flex items-center mt-6"
        >
          <div className="max-w-md mt-2 text-center">
            If this {lesson?.collection ? 'course' : 'video'} was useful for
            you, please share it with your colleagues. It will really help{' '}
            {lesson.instructor.full_name.split(' ')[0]} get the word out.
          </div>
        </Share>
        <div className="mt-8 text-xs md:mt-10 lg:mt-6 xl:mt-16 text-center">
          Ready for something new?{' '}
          <Link href="/">
            <a
              onClick={() => {
                track('clicked ready for new', {
                  ...(lesson?.collection && {
                    collection: lesson?.collection.slug,
                  }),
                  video: lesson.slug,
                })
              }}
              className="font-semibold"
            >
              Click here to start your next project.
            </a>
          </Link>
        </div>
      </div>
    </OverlayWrapper>
  )
}

export default RecommendNextStepOverlay
