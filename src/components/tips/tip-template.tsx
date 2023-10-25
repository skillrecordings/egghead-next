'use client'
import React from 'react'
import {VideoTranscript} from 'components/video/video-transcript'
import TipPlayer from './tip-player'
import MarkdownCodeblock from './ui/markdown-codeblock'
import RelatedTips from './related-tips'
import {type Tip} from 'lib/tips'
import {VideoProvider} from 'hooks/mux/use-mux-player'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react/.'
import {LessonProvider} from 'hooks/use-lesson'
import {VideoResourceProvider} from 'hooks/use-video-resource'
import {trpc} from 'app/_trpc/client'
import {CheckCircleIcon as CheckCircleIconOutline} from '@heroicons/react/outline'
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/solid'

const TipTemplate = ({
  tip,
  tips,
  coursesFromTag,
}: {
  tip: Tip
  tips: Tip[]
  coursesFromTag: any
}) => {
  const data = tip?.eggheadRailsLessonId
    ? trpc.tips.loadTipProgress.useQuery({
        id: tip?.eggheadRailsLessonId,
      })
    : {data: {tipCompleted: false}}
  const tipCompleted = data.data?.tipCompleted

  const markComplete = trpc.tips.markTipComplete.useMutation()

  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const handleVideoEnded = async () => {
    if (tip?.eggheadRailsLessonId) {
      await markComplete.mutateAsync({tipId: tip?.eggheadRailsLessonId})
    }
    // await localProgressDb.progress
    //   .add({
    //     eventName: 'completed video',
    //     module: 'tips',
    //     lesson: tip.slug,
    //     createdOn: new Date(),
    //   })
    //   .then(console.debug)
    console.log('video ended')
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
          <main className="mx-auto w-full" id="tip">
            <div className="relative z-10 flex items-center justify-center">
              <div className="flex w-full max-w-screen-xl flex-col">
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
            <article className="relative z-10 border-l border-transparent px-5 pb-16 pt-8 sm:pt-10 xl:border-gray-800 xl:pt-10">
              <div className="mx-auto w-full max-w-screen-lg pb-5 lg:px-5">
                <div className="flex w-full grid-cols-5 flex-col gap-0 sm:gap-10 xl:grid">
                  <div className="col-span-3">
                    <div className="flex space-x-2 -ml-7">
                      {tipCompleted ? (
                        <span className="self-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-500  rounded-full" />
                        </span>
                      ) : (
                        <span className="self-center ">
                          <CheckCircleIconOutline className="h-5 w-5 text-gray-300 hover:text-green-500 hover:cursor-pointer " />
                        </span>
                      )}
                      <h1 className="leading-tighter inline-flex w-full max-w-2xl items-baseline text-3xl font-black lg:text-3xl">
                        {tip.title}
                      </h1>
                    </div>
                    {tip.body && (
                      <>
                        <div className="prose w-full max-w-none pb-5 pt-5 dark:prose-invert lg:prose-lg">
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
              <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-10 sm:pt-10 md:flex-row">
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

export default TipTemplate
