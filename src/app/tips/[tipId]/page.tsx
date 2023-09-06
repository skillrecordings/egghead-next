import {getAllTips, getTip} from 'lib/tips'
import TipPlayer from 'components/tips/tip-player'
import {VideoTranscript} from 'components/video/video-transcript'
import MarkdownCodeblock from 'components/tips/ui/markdown-codeblock'
import RelatedTips from 'components/tips/related-tips'

export default async function Tip({params}: {params: {tipId: string}}) {
  const tip = await getTip(params.tipId)
  const tips = await getAllTips()

  return (
    tip && (
      <>
        <main className="mx-auto w-full" id="tip">
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex w-full max-w-screen-xl flex-col">
              <div className="flex items-center justify-center overflow-hidden shadow-gray-600/40 sm:shadow-2xl xl:rounded-b-md">
                <TipPlayer tip={tip} />
              </div>
            </div>
          </div>
          <article className="relative z-10 border-l border-transparent px-5 pb-16 pt-8 sm:pt-10 xl:border-gray-800 xl:pt-10">
            <div className="mx-auto w-full max-w-screen-lg pb-5 lg:px-5">
              <div className="flex w-full grid-cols-5 flex-col gap-0 sm:gap-10 xl:grid">
                <div className="col-span-3">
                  <h1 className="font-heading inline-flex w-full max-w-2xl items-baseline text-3xl font-black lg:text-4xl">
                    {tip.title}
                  </h1>

                  {tip.body && (
                    <>
                      <div className="prose w-full max-w-none pb-5 pt-5 dark:prose-invert lg:prose-lg">
                        <MarkdownCodeblock tip={tip.body} />
                      </div>
                      <hr className="bg-indigo-400" />
                    </>
                  )}
                  {tip.transcriptBody && tip.body && (
                    <div className="w-full max-w-2xl pt-5">
                      <VideoTranscript transcript={tip.transcriptBody} />
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
              {tip.transcriptBody && !tip.body && (
                <div className="w-full max-w-2xl pt-5">
                  <VideoTranscript transcript={tip.transcriptBody} />
                </div>
              )}
              {!tip.body && <RelatedTips currentTip={tip} tips={tips} />}
            </div>
          </article>
        </main>
      </>
    )
  )
}
