'use client'
import {Tip} from '@/lib/tips'
import {useRouter} from 'next/navigation'
import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/icons/tip-icons'
import Balancer from 'react-wrap-balancer'
import {Card, CardContent, CardHeader} from './ui/card'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'
import {trpc} from '@/app/_trpc/client'
import isEmpty from 'lodash/isEmpty'
import {convertTimeWithTitles} from '@/utils/time-utils'
import ReactMarkdown from 'react-markdown'
import analytics from '@/utils/analytics'

const TipCard: React.FC<{tip: Tip; i: number}> = ({tip, i}) => {
  const {title} = tip
  const muxPlaybackId = tip?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const router = useRouter()
  const {data} = tip?.eggheadRailsLessonId
    ? trpc.tips.loadTipProgress.useQuery({
        id: tip?.eggheadRailsLessonId,
      })
    : {data: {tipCompleted: false}}
  const tipCompleted = data?.tipCompleted
  const tipTopic = tip?.tags ? tip.tags[0]?.name : ''

  return (
    <Link
      className={twMerge(
        cx(
          'group relative flex flex-row items-center overflow-hidden rounded border border-transparent bg-white hover:bg-gray-100 dark:bg-gray-400/5 hover:dark:bg-gray-800 transition duration-300 ease-in-out',
          {
            'dark:bg-gray-900 bg-gray-50': i % 2 === 0,
          },
        ),
      )}
      href={`/tips/${tip.slug}`}
      onClick={() => {
        analytics.events.activityInternalLinkClick(
          'tip',
          'tips index',
          tipTopic,
          tip.slug,
        )
      }}
    >
      <CardHeader className="relative hidden aspect-video w-full max-w-[100px] items-center justify-center sm:flex sm:max-w-[200px]">
        <div className=" flex items-center justify-center">
          <span className="sr-only">
            Play {title}{' '}
            {tipCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-full items-center justify-center">
            <Image
              src={thumbnail}
              alt=""
              objectFit="cover"
              layout="fill"
              aria-hidden="true"
              className="brightness-90 transition duration-300 group-hover:brightness-75 dark:brightness-50"
            />
          </div>
          <div
            className="absolute flex items-center justify-center rounded-full text-white opacity-100 drop-shadow-xl duration-500 ease-in-out group-hover:opacity-100"
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" name="Playmark" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full flex-col px-6  py-4">
        <div
          className="absolute right-5 top-5 z-20 flex items-center gap-2"
          aria-hidden="true"
        >
          {tipCompleted && (
            <div className="font-heading rounded-full bg-gray-100 px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-gray-500">
              Watched
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold leading-tight sm:text-xl inline-flex items-start gap-1 decoration-gray-300 hover:underline dark:decoration-gray-600">
          {title} {tipCompleted && <span className="sr-only">(watched)</span>}
        </h2>
        <div className="flex flex-row flex-wrap gap-2 items-center  md:space-y-0 pt-2">
          <div className="flex gap-2 items-center place-items-center">
            {tip?.instructor && tip?.instructor.image && (
              <div className="w-5 h-5 overflow-hidden flex-shrink-0 rounded-full lg:w-7 lg:h-7">
                <Image
                  aria-hidden
                  src={tip.instructor.image}
                  alt={tip.instructor.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            )}
            <span className="text-left dark:text-indigo-100 text-gray-700 lg:text-sm text-[0.75rem] opacity-80 leading-none">
              <span className="sr-only">{tip.title} by </span>
              {tip?.instructor?.name}
            </span>
          </div>
          {tip?.duration && (
            <span className="text-xs dark:text-indigo-100 text-gray-700">
              {convertTimeWithTitles(Math.floor(tip.duration), {
                showSeconds: true,
              })}
            </span>
          )}
          <TagList tags={tip.tags} />
        </div>
        {tip?.description && (
          <ReactMarkdown className="prose dark:prose-dark dark:prose-dark-sm dark:prose-a:text-blue-300 prose-a:text-blue-500 prose-sm line-clamp-2 max-w-[50ch] pt-2">
            {tip.description}
          </ReactMarkdown>
        )}
      </CardContent>
    </Link>
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

const TagList: FunctionComponent<
  React.PropsWithChildren<{
    tags: any
    className?: string
  }>
> = ({
  tags,
  className = 'flex justify-center md:justify-start flex-wrap items-center',
}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <ul className={className}>
          {tags.map((tag: any, index: number) => (
            <li
              key={index}
              className="inline-flex items-center mr-4 mt-0 dark:text-indigo-100 text-gray-700 lg:text-sm text-[0.75rem] opacity-80 leading-none"
            >
              <Link
                href={`/q/${tag.name}`}
                onClick={() => {
                  // track(`clicked view topic`, {
                  //   course: courseSlug,
                  //   topic: tag.name,
                  // })
                }}
                className="inline-flex items-center hover:underline"
              >
                <Image
                  src={tag.image_url}
                  alt={tag.name}
                  width={18}
                  height={18}
                  className="flex-shrink-0"
                  quality={100}
                />
                <span className="ml-1">{tag.label}</span>
              </Link>
              {tag.version && (
                <div className="ml-2 opacity-70">
                  <code>{tag.version}</code>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default TipCard
