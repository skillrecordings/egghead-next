'use client'
import {Tip} from '@/lib/tips'
import {useRouter} from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/icons/tip-icons'
import Balancer from 'react-wrap-balancer'
import {Card, CardContent, CardHeader} from './ui/card'
import {trpc} from '@/app/_trpc/client'

const TipCard: React.FC<{tip: Tip}> = ({tip}) => {
  const {title} = tip
  const muxPlaybackId = tip?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  const data = tip?.eggheadRailsLessonId
    ? trpc.tips.loadTipProgress.useQuery({
        id: tip?.eggheadRailsLessonId,
      })
    : {data: {tipCompleted: false}}
  const tipCompleted = data.data?.tipCompleted
  return (
    <Card className="relative flex flex-col items-center overflow-hidden rounded-xl border border-transparent bg-white shadow-2xl shadow-gray-500/20 dark:border-gray-800 dark:bg-gray-400/5 dark:shadow-black/50">
      <CardHeader className="relative flex aspect-video w-full flex-shrink-0 items-center justify-center border-b border-transparent dark:border-gray-800">
        {/* <button
          onClick={() => {
            router
              .push({
                pathname: '/tips/[tip]',
                query: {
                  tip: tip.slug,
                },
              })
              .then(() => {
                const videoElement = document.getElementById(
                  'mux-player',
                ) as HTMLVideoElement
                return videoElement?.play()
              })
          }}
          className="group  flex items-center justify-center"
        > */}
        <Link
          href={`/tips/${tip.slug}`}
          className="group  flex items-center justify-center"
        >
          <span className="sr-only">
            Play {title}{' '}
            {tipCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-full items-center overflow-hidden justify-center min-h-[8rem]">
            <Image
              src={thumbnail}
              alt=""
              className="object-cover"
              fill={true}
              aria-hidden="true"
            />
          </div>
          <div
            className="absolute flex items-center justify-center rounded-full text-white opacity-100 drop-shadow-xl duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-150"
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" name="Playmark" />
          </div>
        </Link>
        {/* </button> */}
      </CardHeader>
      <CardContent className="flex h-full w-full flex-col items-start p-6">
        <div
          className="absolute right-5 top-5 z-20 flex items-center gap-2"
          aria-hidden="true"
        >
          {tipCompleted && (
            <div className="font-heading rounded-full bg-gray-100 px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-gray-500">
              Watched
            </div>
          )}
          <div className="font-heading rounded-full bg-sky-400/20 px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-sky-600 dark:text-sky-400">
            Tip
          </div>
        </div>
        <h2 className="text-base font-semibold leading-tight sm:text-xl">
          <Link
            href={`/tips/${tip.slug}`}
            className="inline-flex items-start gap-1 decoration-gray-300 hover:underline dark:decoration-gray-600"
          >
            {title} {tipCompleted && <span className="sr-only">(watched)</span>}
          </Link>
        </h2>
      </CardContent>
    </Card>
  )
}

export const TipTeaser: React.FC<{tip: Tip}> = ({tip}) => {
  const {title, muxPlaybackId} = tip
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  // const {tipCompleted} = useTipComplete(tip.slug)
  const tipCompleted = false

  return (
    <article className="flex items-center gap-4 py-3">
      <header className="flex-shrink-0">
        <button
          onClick={() => {
            // router
            //   .push({
            //     pathname: '/tips/[tip]',
            //     query: {
            //       tip: tip.slug,
            //     },
            //   })
            //   .then(() => {
            //     const videoElement = document.getElementById(
            //       'mux-player',
            //     ) as HTMLVideoElement
            //     return videoElement?.play()
            //   })
          }}
          className="group relative flex items-center justify-center overflow-hidden rounded"
        >
          <span className="sr-only">
            Play {title}{' '}
            {tipCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-16 items-center justify-center sm:w-auto">
            <Image
              src={thumbnail}
              alt=""
              width={240 / 2}
              height={135 / 2}
              aria-hidden="true"
              className=" brightness-75 transition duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
          <div
            className="absolute flex scale-50 items-center justify-center text-white opacity-100 transition"
            aria-hidden="true"
          >
            {tipCompleted ? (
              <>
                <Icon
                  name="Checkmark"
                  className="absolute h-10 w-10 text-white transition group-hover:opacity-0"
                  aria-hidden="true"
                />
                <Icon
                  name="Playmark"
                  className="absolute h-8 w-8 text-white opacity-0 transition group-hover:opacity-100"
                />
              </>
            ) : (
              <Icon name="Playmark" className="h-8 w-8" />
            )}
          </div>
        </button>
      </header>
      <h2 className="font-bold  sm:text-lg">
        <Link
          href={{
            pathname: '/tips/[tip]',
            query: {
              tip: tip.slug,
            },
          }}
          className="inline-flex items-start gap-1 leading-tight hover:underline"
        >
          <Balancer>{title}</Balancer>{' '}
          {tipCompleted && <span className="sr-only">(watched)</span>}
        </Link>
      </h2>
    </article>
  )
}

export default TipCard
