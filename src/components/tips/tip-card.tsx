'use client'
import {Tip} from '@/lib/tips'
import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/icons/tip-icons'
import {Card, CardContent, CardHeader} from './ui/card'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'
import {trpc} from '@/app/_trpc/client'
import isEmpty from 'lodash/isEmpty'
import {convertTimeWithTitles} from '@/utils/time-utils'
import ReactMarkdown from 'react-markdown'
import analytics from '@/utils/analytics'
import {ClockIcon} from '@heroicons/react/solid'

const TipCard: React.FC<{tip: Tip; i: number}> = ({tip, i}) => {
  const {title} = tip
  const muxPlaybackId = tip?.muxPlaybackId
  const thumbnail = `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve`
  const {data} = tip?.eggheadRailsLessonId
    ? trpc.tips.loadTipProgress.useQuery({
        id: tip?.eggheadRailsLessonId,
      })
    : {data: {tipCompleted: false}}
  const tipCompleted = data?.tipCompleted
  const tipTopic = tip?.tags ? tip.tags[0]?.name : ''

  return (
    <article
      className={twMerge(
        cx(
          'group relative flex flex-row items-center overflow-hidden rounded border border-transparent bg-white dark:bg-gray-400/5 transition duration-300 ease-in-out px-4 py-2 min-h-[160px] ',
          {
            'dark:bg-gray-900 bg-gray-50': i % 2 === 0,
          },
        ),
      )}
    >
      <CardHeader className="relative hidden aspect-video w-full max-w-[100px] items-center justify-center sm:flex sm:max-w-[200px]">
        <div className=" flex items-center justify-center">
          <span className="sr-only">
            Play {title}{' '}
            {tipCompleted && <span className="sr-only">(completed)</span>}
          </span>
          <div className="flex w-full items-center justify-center">
            <Link
              tabIndex={-1}
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
              <Image
                src={thumbnail}
                alt=""
                objectFit="cover"
                layout="fill"
                aria-hidden="true"
                className="brightness-90 transition duration-300 group-hover:brightness-75 dark:brightness-50"
              />
            </Link>
          </div>
          <div
            className="absolute flex items-center justify-center rounded-full text-white opacity-100 drop-shadow-xl duration-500 ease-in-out group-hover:opacity-100"
            aria-hidden="true"
          >
            <Icon
              className="h-6 w-6 duration-500 ease-in-out sm:group-hover:scale-110"
              name="Playmark"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full flex-col px-6  py-4">
        <div
          className="absolute left-5 top-5 z-20 flex items-center gap-2"
          aria-hidden="true"
        >
          {tipCompleted && (
            <div className="font-heading rounded-full bg-gray-100 px-2 py-1 text-xs font-bold uppercase leading-none tracking-wider text-gray-500">
              Watched
            </div>
          )}
        </div>

        <h2>
          <Link
            className="text-lg font-semibold leading-tight sm:text-xl inline-flex items-start gap-1 decoration-gray-300 dark:decoration-gray-600 hover:underline  text-balance"
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
            {title} {tipCompleted && <span className="sr-only">(watched)</span>}
          </Link>
        </h2>
        <div className="flex flex-row flex-wrap gap-4 items-center  md:space-y-0 pt-2">
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
            <span className="text-left  lg:text-sm text-[0.75rem] opacity-80 leading-none">
              <span className="sr-only">{tip.title} by </span>
              <Link
                href={`q/resources-by-${tip?.instructor?.slug}`}
                className="hover:underline"
              >
                {tip?.instructor?.name}
              </Link>
            </span>
          </div>
          <TagList tags={tip.tags} />
          {tip?.duration && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4 opacity-60" />
              <span className="text-xs">
                {convertTimeWithTitles(Math.floor(tip.duration), {
                  showSeconds: true,
                })}
              </span>
            </div>
          )}
        </div>
        {tip?.description && (
          <ReactMarkdown
            className="prose dark:prose-dark dark:prose-dark-sm dark:prose-a:text-blue-300 prose-a:text-blue-500 prose-sm line-clamp-2 pt-2"
            components={{
              a: (props) => <span>{props.children}</span>,
              p: (props) => <p className="text-balance">{props.children}</p>,
            }}
          >
            {tip.description}
          </ReactMarkdown>
        )}
      </CardContent>
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
  className = 'flex gap-4 justify-center md:justify-start flex-wrap items-center',
}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <div className={className}>
          {tags.map((tag: any, index: number) => (
            <div
              key={index}
              className="inline-flex items-center mt-0 lg:text-sm text-[0.75rem] opacity-80 leading-none"
            >
              <Link
                href={`/q/${tag.name}`}
                onClick={() => {
                  analytics.events.activityInternalLinkClick(
                    'tag',
                    'tips index',
                    tag.name,
                    tag.slug,
                  )
                }}
                className="inline-flex gap-2 items-center hover:underline"
              >
                <Image
                  src={tag.image_url}
                  alt={tag.name}
                  width={18}
                  height={18}
                  className="flex-shrink-0"
                  quality={100}
                />
                <span>{tag.label}</span>
              </Link>
              {tag.version && (
                <div className="ml-2 opacity-70">
                  <code>{tag.version}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default TipCard
