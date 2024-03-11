import TipTemplate from '@/components/tips/tip-template'
import {serverClient} from '@/app/_trpc/serverClient'
import truncate from 'lodash/truncate'
import removeMarkdown from 'remove-markdown'

import type {Metadata, ResolvingMetadata} from 'next'
import {getTip} from '@/lib/tips'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

type Props = {
  params: {tipId: string}
  searchParams: {[key: string]: string | string[] | undefined}
}

export async function generateMetadata(
  {params, searchParams}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const tip = await getTip(params.tipId as string)

  if (!tip) {
    return {}
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: truncate(tip.title, {length: 65}),
    description: truncate(removeMarkdown(tip.description), {
      length: 155,
    }),
    openGraph: {
      siteName: 'egghead',
      images: [
        `https://og-image-react-egghead.now.sh/lesson/${tip.eggheadRailsLessonId}?v=20201027`,
        ...previousImages,
      ],
    },
    twitter: {
      title: truncate(tip.title, {length: 65}),
      images: [
        `https://og-image-react-egghead.now.sh/lesson/${tip.eggheadRailsLessonId}?v=20201027`,
        ...previousImages,
      ],
      site: '@eggheadio',
      card: 'summary_large_image',
      creator: tip?.instructor?.twitter,
    },
  }
}

export default async function Tip({params}: {params: {tipId: string}}) {
  const tip = await getTip(params.tipId as string)

  if (!tip) {
    return notFound()
  }

  const coursesFromTagLoader = serverClient.tips.relatedContent({
    slug: params.tipId,
  })

  const muxPlaybackId = tip?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`

  const jsonLd = {
    name: tip.title,
    image: thumbnail,
    uploadDate: tip?._createdAt,
    description: removeMarkdown(tip.description),
  }

  return (
    <>
      <Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />

        <TipTemplate tip={tip} coursesFromTagLoader={coursesFromTagLoader} />
      </Suspense>
    </>
  )
}
