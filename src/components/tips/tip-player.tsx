'use client'
import React from 'react'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import Image from 'next/legacy/image'
import {useRouter} from 'next/navigation'

import {XIcon, PlayIcon} from '@heroicons/react/solid'
import {shuffle, take} from 'lodash'
import {useMuxPlayer} from '@/hooks/mux/use-mux-player'
import './styles.css'
import {useVideoResource} from '@/hooks/use-video-resource'
import {Tip} from '@/lib/tips'
import cx from 'classnames'

const TipPlayer: React.FC<{
  tip: Tip
  tips: Tip[]
  coursesFromTag: any
  ref: any
}> = React.forwardRef(({tip, tips, coursesFromTag}, ref: any) => {
  const {muxPlayerProps, displayOverlay} = useMuxPlayer()
  const {videoResource} = useVideoResource()

  return (
    <div className="w-full relative aspect-video">
      {displayOverlay && (
        <TipOverlay tips={tips} coursesFromTag={coursesFromTag} />
      )}
      <div
        className={cx('', {
          hidden: displayOverlay,
          flex: !displayOverlay,
        })}
      >
        <MuxPlayer
          playbackId={tip.muxPlaybackId || videoResource?.muxPlaybackId}
          ref={ref}
          {...(muxPlayerProps as MuxPlayerProps)}
        />
      </div>
    </div>
  )
})

const TipOverlay: React.FC<{tips: Tip[]; coursesFromTag: any}> = ({
  tips,
  coursesFromTag,
}) => {
  const {setDisplayOverlay, handlePlay} = useMuxPlayer()

  const buttonStyles =
    'py-2 px-3 font-medium rounded flex items-center gap-1 hover:bg-gray-700/50 bg-black/80 transition text-gray-200'
  return (
    <div
      id="video-overlay"
      className="relative left-0 top-0 flex w-full items-center justify-center bg-[#070B16] aspect-video"
    >
      <div className="absolute right-8 top-8 z-50 flex items-center justify-center gap-3">
        <button className={buttonStyles} onClick={handlePlay}>
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            // track('dismissed video overlay', {
            //   lesson: lesson.slug,
            //   module: module.slug.current,
            //   moduleType: 'tip',
            //   lessonType: lesson._type,
            // })
            setDisplayOverlay(false)
          }}
        >
          Dismiss <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center p-3 text-center text-xs md:text-base lg:text-lg leading-relaxed lg:absolute">
        {/* <ShareTip lesson={tip} /> */}
        <div className="grid h-full grid-cols-2 gap-3 grid-rows-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-3 lg:[&>*:nth-child(n+10)]:hidden [&>*:nth-child(n+5)]:hidden sm:[&>*:nth-child(n+7)]:hidden sm:[&>*:nth-child(n+5)]:flex lg:[&>*:nth-child(n+7)]:flex">
          {take(shuffle(tips), 3).map((tip) => {
            return <VideoOverlayTipCard suggestedTip={tip} key={tip.slug} />
          })}
          {take(shuffle(coursesFromTag?.moreCoursesFromTag), 6).map(
            (course) => (
              <VideoOverlayCourseCard
                suggestedCourse={course}
                key={course.slug}
              />
            ),
          )}
        </div>
      </div>
    </div>
  )
}

const VideoOverlayTipCard: React.FC<{suggestedTip: Tip}> = ({suggestedTip}) => {
  const router = useRouter()
  // const {tipCompleted} = useTipComplete(suggestedTip.slug)

  const thumbnail = `https://image.mux.com/${suggestedTip.muxPlaybackId}/thumbnail.png?width=288&height=162&fit_mode=preserve`

  return (
    <button
      key={suggestedTip.slug}
      onClick={() => {
        // track('clicked suggested tip thumbnail', {
        //   lesson: suggestedTip.slug,
        // })
        router.push(`/tips/${suggestedTip.slug}`)
      }}
      className="group relative z-0 flex h-full w-full items-end justify-start rounded-md overflow-hidden bg-gray-900/60 p-4 md:p-6 lg:p-8 text-left font-medium leading-tight text-gray-200"
    >
      <div className="relative z-10 flex flex-col">
        <span className="pb-1 font-mono text-xs font-semibold uppercase text-gray-500">
          Tip
        </span>
        <span className="font-medium line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
          {suggestedTip.title}{' '}
          {/* {tipCompleted && <span className="sr-only">(watched)</span>} */}
        </span>
      </div>
      <Image
        src={thumbnail}
        alt=""
        aria-hidden="true"
        layout="fill"
        className="blur-xs z-0 object-cover opacity-30 transition group-hover:opacity-40 group-hover:brightness-150"
        quality={100}
      />
      <div
        className="absolute left-0 top-0 flex h-full w-full items-start justify-end p-5"
        aria-hidden="true"
      >
        {/* {tipCompleted ? (
          <>
            <CheckCircleIcon
              className="absolute h-10 w-10 text-teal-400 transition group-hover:opacity-0"
              aria-hidden="true"
            />
            <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-teal-400 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
          </>
        ) : (
          <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-gray-300 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
        )} */}
        <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-gray-300 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
      </div>
    </button>
  )
}

const VideoOverlayCourseCard: React.FC<{suggestedCourse: any}> = ({
  suggestedCourse,
}) => {
  const router = useRouter()

  return (
    <button
      key={suggestedCourse.slug}
      onClick={() => {
        // track('clicked suggested tip thumbnail', {
        //   lesson: suggestedTip.slug,
        // })
        router.push(suggestedCourse.path)
      }}
      className="group relative z-0 flex h-full w-full items-end justify-start rounded-md overflow-hidden bg-gray-900/60 p-4 md:p-6 lg:p-8 text-left font-medium leading-tight text-gray-200"
    >
      <div className="relative z-10 flex flex-col">
        <span className="pb-1 font-mono text-xs font-semibold uppercase text-gray-500">
          Course
        </span>
        <span className="font-medium line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
          {suggestedCourse.title}
        </span>
      </div>
      {suggestedCourse.image ? (
        <div className="aspect-square absolute right-2 top-2 bottom-2">
          <Image
            src={suggestedCourse.image}
            alt=""
            aria-hidden="true"
            layout="fill"
            className="blur-xs z-0 object-cover opacity-30 transition group-hover:opacity-40 group-hover:brightness-150"
            quality={100}
          />
        </div>
      ) : null}
      <div
        className="absolute left-0 top-0 flex h-full w-full items-start justify-end p-5"
        aria-hidden="true"
      >
        <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-gray-300 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
      </div>
    </button>
  )
}

export default TipPlayer
