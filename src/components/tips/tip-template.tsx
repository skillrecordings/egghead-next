'use client'
import React, {use} from 'react'
import Link from 'next/link'
import {get} from 'lodash'
import Image from 'next/image'
import {CheckCircleIcon as CheckCircleIconOutline} from '@heroicons/react/outline'
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/solid'
import TipPlayer from './tip-player'
import MarkdownCodeblock from './ui/markdown-codeblock'
import RelatedTips from './related-tips'
import {type Tip} from '@/lib/tips'
import {VideoProvider} from '@/hooks/mux/use-mux-player'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react/.'
import {LessonProvider} from '@/hooks/use-lesson'
import {VideoResourceProvider} from '@/hooks/use-video-resource'
import {VideoTranscript} from '@/components/video/video-transcript'
import Eggo from '@/components/icons/eggo'
import Tags from '@/components/pages/lessons/tags'
import {trpc} from '@/app/_trpc/client'
import {twMerge} from 'tailwind-merge'
import analytics from '@/utils/analytics'

const TipTemplate = ({
  tip,
  coursesFromTagLoader,
}: {
  tip: Tip
  coursesFromTagLoader: any
}) => {
  const markComplete = trpc.tips.markTipComplete.useMutation()
  const {data: tips = []} = trpc.tips.published.useQuery()

  const coursesFromTag = use(coursesFromTagLoader)

  const {instructor, tags} = tip

  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const handleVideoEnded = async () => {
    if (tip?.eggheadRailsLessonId) {
      await markComplete.mutateAsync({tipId: tip?.eggheadRailsLessonId})
    }
  }

  const module: any = {
    slug: {
      current: 'tips',
    },
    moduleType: 'tip',
    lessons: tips,
    resources: tips.filter((tipToCompare) => tipToCompare.slug !== tip.slug),
  }
  const filteredTips = tips.filter((item) => item.slug !== tip.slug)
  return (
    <LessonProvider lesson={tip} module={module}>
      <VideoResourceProvider videoResourceId={tip?.videoResourceId || ''}>
        <VideoProvider
          muxPlayerRef={muxPlayerRef}
          onEnded={handleVideoEnded}
          exerciseSlug={tip.slug}
          path="/tips"
        >
          <main className="w-full mx-auto" id="tip">
            <div className="relative z-10 flex items-center justify-center">
              <div className="flex flex-col w-full max-w-screen-xl">
                <div className="flex items-center justify-center overflow-hidden shadow-gray-600/40 sm:shadow-2xl xl:rounded-b-md">
                  <TipPlayer
                    tip={tip}
                    tips={filteredTips}
                    coursesFromTag={coursesFromTag}
                    ref={muxPlayerRef}
                  />
                </div>
              </div>
            </div>
            <article className="relative z-10 px-5 pt-8 pb-16 border-l border-transparent sm:pt-10 xl:border-gray-800 xl:pt-10">
              <div className="w-full max-w-screen-lg pb-5 mx-auto lg:px-5">
                <div className="flex flex-col w-full grid-cols-5 gap-0 sm:gap-10 xl:grid">
                  <div className="col-span-3">
                    <div className="flex flex-col">
                      {tip?.eggheadRailsLessonId && (
                        <TipCompleted
                          id={tip.eggheadRailsLessonId}
                          className="block mb-2 lg:hidden"
                        />
                      )}
                      <div className="flex lg:space-x-2 lg:-ml-7">
                        {tip?.eggheadRailsLessonId && (
                          <TipCompleted
                            id={tip.eggheadRailsLessonId}
                            className="hidden lg:block "
                          />
                        )}
                        <h1 className="inline-flex items-baseline w-full max-w-2xl text-xl font-black leading-tighter lg:text-3xl">
                          {tip.title}
                        </h1>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        {instructor && (
                          <div className="flex items-center flex-shrink-0">
                            <Link
                              href={`/q/resources-by-${instructor.slug}`}
                              onClick={() => {
                                analytics.events.activityInternalLinkClick(
                                  'instructor',
                                  tip.slug,
                                  'instructor',
                                )
                              }}
                              className="flex mr-2 itemes-center"
                            >
                              {get(instructor, 'image') ? (
                                <Image
                                  width={48}
                                  height={48}
                                  src={instructor.image}
                                  alt={instructor.name}
                                  className="m-0 rounded-full"
                                />
                              ) : (
                                <Eggo className="w-8 rounded-full" />
                              )}
                            </Link>
                            <div className="flex flex-col">
                              <span className="text-xs">Instructor</span>
                              {get(instructor, 'name') && (
                                <Link
                                  href={`/q/resources-by-${instructor.slug}`}
                                  onClick={() => {
                                    analytics.events.activityInternalLinkClick(
                                      'instructor',
                                      tip.slug,
                                      'instructor',
                                    )
                                  }}
                                  className="font-semibold leading-tighter hover:underline"
                                >
                                  {instructor.name}
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                        {tags && (
                          <div className="hidden lg:block">
                            <Tags tags={tags} lessonSlug={tip.slug} />
                          </div>
                        )}
                      </div>
                      {tags && (
                        <div className="block mt-4 lg:hidden">
                          <Tags tags={tags} lessonSlug={tip.slug} />
                        </div>
                      )}
                    </div>
                    {tip.body && (
                      <>
                        <div className="w-full pt-5 pb-5 prose max-w-none dark:prose-invert lg:prose-lg">
                          <MarkdownCodeblock tip={tip.body} />
                        </div>
                        <hr className="bg-indigo-400" />
                      </>
                    )}
                    {tip.transcript && tip.body && (
                      <div className="w-full max-w-2xl pt-5">
                        <VideoTranscript transcript={tip.transcript} />
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    {/* TODO: might want to add summary? */}
                    {tip.body && <RelatedTips currentTip={tip} tips={tips} />}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full max-w-screen-xl gap-10 mx-auto sm:pt-10 md:flex-row">
                {tip.transcript && !tip.body && (
                  <div className="w-full max-w-2xl pt-5">
                    <VideoTranscript transcript={tip.transcript} />
                  </div>
                )}
                {!tip.body && <RelatedTips currentTip={tip} tips={tips} />}
              </div>
            </article>
          </main>
        </VideoProvider>
      </VideoResourceProvider>
    </LessonProvider>
  )
}

const TipCompleted = ({id, className}: {id: number; className?: string}) => {
  const {data} = id
    ? trpc.tips.loadTipProgress.useQuery({
        id,
      })
    : {data: {tipCompleted: false}}
  const tipCompleted = data?.tipCompleted

  return (
    <div className={twMerge('lg:mt-3', className)}>
      {tipCompleted ? (
        <span className="self-start">
          <CheckCircleIcon className="w-5 h-5 text-green-500 rounded-full" />
        </span>
      ) : (
        <span className="self-start">
          <CheckCircleIconOutline className="w-5 h-5 text-gray-300" />
        </span>
      )}
    </div>
  )
}

export default TipTemplate
