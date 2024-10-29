import {GetServerSideProps, GetStaticPaths} from 'next'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import * as mysql from 'mysql2/promise'
import {ConnectionOptions, RowDataPacket} from 'mysql2/promise'
import {NextSeo} from 'next-seo'
import * as React from 'react'
import {MDXRemote} from 'next-mdx-remote'
import mdxComponents from '@/components/mdx'
import 'highlight.js/styles/night-owl.css'
import {serialize} from 'next-mdx-remote/serialize'
import {isEmpty, truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'
import ReactMarkdown from 'react-markdown'
import {trpc} from '@/app/_trpc/client'
import Image from 'next/image'
import Eggo from '@/components/icons/eggo'
import Typesense from 'typesense'
import {cn} from '@/ui/utils'
import MuxPlayerElement from '@mux/mux-player'
import {MaxResolution, MinResolution} from '@mux/playback-core'
import serializeMDX from '@/markdown/serialize-mdx'
import Link from 'next/link'
import Share from '@/components/share'
import TweetResource from '@/components/tweet-resource'
import CopyToClipboard from '@/components/copy-resource'
import {track} from '@/utils/analytics'

const access: ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

function convertToSerializeForNextResponse(result: any) {
  if (!result) return null

  for (const resultKey in result) {
    if (result[resultKey] instanceof Date) {
      result[resultKey] = result[resultKey].toISOString()
    } else if (
      result[resultKey]?.constructor?.name === 'Decimal' ||
      result[resultKey]?.constructor?.name === 'i'
    ) {
      result[resultKey] = result[resultKey].toNumber()
    } else if (result[resultKey]?.constructor?.name === 'BigInt') {
      result[resultKey] = Number(result[resultKey])
    } else if (result[resultKey] instanceof Object) {
      result[resultKey] = convertToSerializeForNextResponse(result[resultKey])
    }
  }

  return result
}

export const getStaticPaths: GetStaticPaths = async () => {
  const conn = await mysql.createConnection(access)

  const [postRows] = await conn.execute<RowDataPacket[]>(`
SELECT *
		FROM egghead_ContentResource cr_lesson
		WHERE (cr_lesson.type = 'post' )`)
  await conn.end()

  return {
    paths: postRows.map((post: any) => {
      return {
        params: {
          post: post.fields.slug,
        },
      }
    }),

    fallback: 'blocking',
  }
}

export const getStaticProps: GetServerSideProps = async function ({params}) {
  if (!params?.post) {
    return {
      notFound: true,
    }
  }

  let hashFromSlug: string
  let splitOnTilde = String(params.post).split('~')

  if (splitOnTilde.length > 1) {
    hashFromSlug = splitOnTilde[splitOnTilde.length - 1]
  } else {
    let splitOnDash = String(params.post).split('-')
    hashFromSlug = splitOnDash[splitOnDash.length - 1]
  }

  const conn = await mysql.createConnection(access)
  const [videoResourceRows] = await conn.execute<RowDataPacket[]>(`
SELECT *
		FROM egghead_ContentResource cr_lesson
		JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
		JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id
		WHERE (cr_lesson.id = '${params.post}' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = '${params.post}' OR cr_lesson.id LIKE '%${hashFromSlug}' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE '%${hashFromSlug}')
			AND cr_video.type = 'videoResource'
		LIMIT 1`)
  const [postRows] = await conn.execute<RowDataPacket[]>(`
SELECT cr_lesson.*, egh_user.name, egh_user.image
    FROM egghead_ContentResource cr_lesson
    LEFT JOIN egghead_User egh_user ON cr_lesson.createdById = egh_user.id
    WHERE (cr_lesson.id = '${params.post}' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = '${params.post}' OR cr_lesson.id LIKE '%${hashFromSlug}' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE '%${hashFromSlug}')
    LIMIT 1`)
  await conn.end()

  const videoResource = videoResourceRows[0]
  const post = postRows[0]

  if (!post) {
    return {
      notFound: true,
    }
  }

  const lesson = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/lessons/${post.fields.eggheadLessonId}`,
  ).then((res) => res.json())

  const resource = {
    id: `${post.fields.eggheadLessonId}`,
    externalId: post.id,
    title: post.fields.title,
    slug: post.fields.slug,
    summary: post.fields.description,
    description: post.fields.body,
    name: post.fields.title,
    path: `/${post.fields.slug}`,
    type: post.fields.postType,
    ...(lesson && {
      instructor_name: lesson.instructor?.full_name,
      instructor: lesson.instructor,
      image: lesson.image_480_url,
    }),
  }

  let client = new Typesense.Client({
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
        port: 443,
        protocol: 'https',
      },
    ],
    apiKey: process.env.TYPESENSE_WRITE_API_KEY!,
    connectionTimeoutSeconds: 2,
  })

  if (
    post.fields.state === 'published' &&
    post.fields.visibility === 'public'
  ) {
    await client
      .collections(process.env.TYPESENSE_COLLECTION_NAME!)
      .documents()
      .upsert({
        ...resource,
        published_at_timestamp: post.updatedAt.getTime(),
      })
      .catch((err) => {
        console.error(err)
      })
  } else {
    await client
      .collections(process.env.TYPESENSE_COLLECTION_NAME!)
      .documents()
      .delete(resource.id)
      .catch((err) => {
        console.error(err)
      })
  }

  const mdxSource = await serializeMDX(post.fields.body, {
    useShikiTwoslash: true,
    syntaxHighlighterOptions: {
      authorization: process.env.SHIKI_AUTH_TOKEN!,
      endpoint: process.env.SHIKI_ENDPOINT!,
    },
  })

  // const mdxSource = await serialize(post.fields.body, {
  //   mdxOptions: {
  //     remarkPlugins: [
  //       require(`remark-slug`),
  //       require(`remark-footnotes`),
  //       require(`remark-code-titles`),
  //     ],
  //     rehypePlugins: [
  //       [
  //         require(`rehype-shiki`),
  //         {
  //           theme: `./src/styles/material-theme-dark.json`,
  //           useBackground: false,
  //         },
  //       ],
  //     ],
  //   },
  // })

  return {
    props: {
      mdxSource,
      post: convertToSerializeForNextResponse(post),
      instructor: {
        full_name: lesson?.instructor?.full_name || post.name,
        avatar_url: lesson?.instructor?.avatar_64_url || post.image,
        ...(lesson?.instructor?.slug && {
          path: `/q/resources-by-${lesson?.instructor?.slug}`,
        }),
      },
      videoResource: convertToSerializeForNextResponse(videoResource),
      tags: lesson?.tags || [],
    },
    revalidate: 60,
  }
}

function InstructorProfile({
  instructor,
}: {
  instructor: {
    full_name: string
    avatar_url: string
    path?: string
  }
}) {
  const content = (
    <div className="flex flex-shrink-0 items-center">
      {instructor?.avatar_url ? (
        <Image
          className="rounded-full flex-shrink-0 bg-cover"
          src={`${instructor.avatar_url}`}
          alt={instructor.full_name}
          width={40}
          height={40}
        />
      ) : (
        <Eggo className="mr-1 sm:w-10 w-8" />
      )}
      <div className="ml-2 flex flex-col justify-center">
        <span className="text-gray-700 dark:text-gray-400 text-sm leading-tighter">
          Instructor
        </span>
        <h2 className="font-semibold text-base">{instructor.full_name}</h2>
      </div>
    </div>
  )

  return instructor.path ? (
    <Link href={instructor.path}>{content}</Link>
  ) : (
    content
  )
}

export default function PostPage({
  post,
  videoResource,
  instructor,
  mdxSource,
  tags,
}: {
  mdxSource: any
  post: any
  instructor: {
    full_name: string
    avatar_url: string
    path?: string
  }
  videoResource: any
  tags: any
}) {
  const imageParams = new URLSearchParams()
  imageParams.set('title', post.fields.title)

  return (
    <div>
      <NextSeo
        title={post.fields.title}
        description={post.fields.description}
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.fields.slug}`}
        twitter={{
          cardType: 'summary_large_image',
          site: 'eggheadio',
          handle: '@eggheadio',
        }}
        openGraph={{
          title: post.fields.title?.replace(/"/g, "'"),
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.fields.slug}`,
          description: truncate(
            removeMarkdown(post.fields.description?.replace(/"/g, "'")),
            {length: 155},
          ),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/lesson/${post.fields.eggheadLessonId}?v=20201027`,
            },
          ],
        }}
      />
      {videoResource && (
        <div className="relative z-10 flex items-center justify-center">
          <div className="flex w-full max-w-screen-lg flex-col">
            <div className="relative aspect-[16/9]">
              <div
                className={cn(
                  'flex items-center justify-center  overflow-hidden',
                  {
                    hidden: false,
                  },
                )}
              >
                <PostPlayer
                  playbackId={videoResource.fields.muxPlaybackId}
                  eggheadLessonId={post.fields.eggheadLessonId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto w-fit">
        {post.fields.state === 'draft' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-b-lg flex justify-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              This post is a draft and not published yet.
            </p>
          </div>
        )}
        <header className="pb-6 pt-7 sm:pb-18 sm:pt-16 space-y-4 ">
          <h1 className="max-w-screen-md font-extrabold sm:text-4xl text-2xl leading-tighter w-fit pb-6">
            {post.fields.title}
          </h1>
          <div className="flex items-center justify-between gap-2">
            <div>
              <InstructorProfile instructor={instructor} />
            </div>
            <div>
              <TagList tags={tags} resourceSlug={post.fields.slug} />
            </div>
          </div>
        </header>

        <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-3xl dark:prose-a:text-blue-300 prose-a:text-blue-500 pt-4 pb-8 mx-auto">
          <MDXRemote
            {...mdxSource}
            components={{
              ...mdxComponents,
              PodcastLinks,
            }}
          />
          <div className="flex justify-between sm:items-center items-start sm:flex-row  flex-col sm:space-y-0 space-y-2">
            {post.fields.github && (
              <Link
                className="flex items-center gap-2 rounded-md  font-medium leading-tight transition not-prose text-base"
                href={post.fields.github}
              >
                <GitHubIcon /> Code
              </Link>
            )}
            <div>
              <span className="text-sm not-prose">Share with a coworker</span>
              <h2 className="sr-only">Social Share Links</h2>
              <div className="flex flex-col sm:items-center items-start gap-2 md:flex-row">
                <TweetResource
                  className="not-prose"
                  resource={{
                    title: post.fields.title,
                    type: post.fields.postType,
                    path: `/${post.fields.slug}`,
                  }}
                  instructor={instructor}
                />
                <CopyToClipboard
                  stringToCopy={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.fields.slug}`}
                />
              </div>
            </div>
          </div>
          {videoResource && (
            <section>
              <h2 className="text-xl font-bold">Transcript</h2>
              <ReactMarkdown className="prose text-gray-800 dark:prose-dark max-w-none">
                {videoResource.fields.transcript}
              </ReactMarkdown>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

const defaultPlayerProps = {
  id: 'mux-player',
  defaultHiddenCaptions: true,
  thumbnailTime: 0,
  playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
  maxResolution: MaxResolution.upTo2160p,
  minResolution: MinResolution.noLessThan540p,
}

function GitHubIcon() {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 16"
        aria-hidden="true"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          fill="currentColor"
          d="M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6 C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5 c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1 c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8 c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2 c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z"
        ></path>
      </svg>
    </>
  )
}

function PostPlayer({
  playbackId,
  eggheadLessonId,
  playerProps = defaultPlayerProps,
}: {
  playbackId: string
  eggheadLessonId?: number | null
  playerProps?: MuxPlayerProps
}) {
  const [writingProgress, setWritingProgress] = React.useState<Boolean>(false)
  const {mutate: markLessonComplete} =
    trpc.progress.markLessonComplete.useMutation()

  const {mutateAsync: addProgressToLesson} =
    trpc.progress.addProgressToLesson.useMutation()

  async function writeProgressToLesson({
    currentTime,
    lessonId,
  }: {
    currentTime?: number
    lessonId?: number | null
  }) {
    const secondsWatched = Math.ceil(currentTime || 0)
    const isSegment = secondsWatched % 30 === 0 && secondsWatched > 0
    if (isSegment) {
      return addProgressToLesson({
        lessonId,
        secondsWatched,
      })
    }
  }

  return (
    <MuxPlayer
      {...playerProps}
      playbackId={playbackId}
      onEnded={() => {
        if (eggheadLessonId) {
          markLessonComplete({
            lessonId: eggheadLessonId,
          })
        }
      }}
      onTimeUpdate={async (e: any) => {
        const muxPlayer = (e?.currentTarget as MuxPlayerElement) || null
        if (!muxPlayer || writingProgress) return
        setWritingProgress(true)
        await writeProgressToLesson({
          currentTime: muxPlayer.currentTime,
          lessonId: eggheadLessonId,
        })
        setWritingProgress(false)
      }}
    />
  )
}

const LINKS = [
  {
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="23"
        viewBox="0 0 22 23"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M13.2327518,10.3921111 C13.2327518,13.2617639 8.98365108,13.2617639 8.98365108,10.3921111 C8.98365108,7.52245833 13.2327518,7.52245833 13.2327518,10.3921111 Z M12.1704766,21.156 L10.0459263,21.156 C8.98365108,21.156 8.45251349,16.9639497 8.45251349,15.7740556 C8.45251349,14.5841615 9.64135876,13.6212778 11.1082014,13.6212778 C12.5750441,13.6212778 13.7638894,14.5841615 13.7638894,15.7740556 C13.7638894,16.9639497 13.2327518,21.156 12.1704766,21.156 Z M11.1082014,1.781 L11.1082227,1.781 C15.7930156,1.781 19.6064241,5.64507465 19.6064241,10.3921111 C19.6064241,13.8797187 17.5461945,16.881875 14.597956,18.2357569 C14.6726499,17.7711337 14.722444,17.3296635 14.7556401,16.9512483 C17.0129749,15.6559219 18.5441383,13.2025625 18.5441383,10.3917344 C18.5441383,6.2375191 15.2079569,2.85701215 11.1082121,2.85701215 C7.00846723,2.85701215 3.6722858,6.2375191 3.6722858,10.3917344 C3.6722858,13.2027778 5.20344925,15.656191 7.460784,16.9490955 C7.4939801,17.3275 7.54377425,17.7689917 7.61846813,18.2336042 C4.6702296,16.8821979 2.61,13.8798802 2.61,10.3921111 C2.61,5.64507465 6.42340855,1.781 11.1082014,1.781 Z M11.1082014,5.01011285 L11.1082014,5.01011285 C14.0377439,5.01011285 16.4195773,7.42359201 16.4195773,10.3920573 C16.4195773,12.0402778 15.6830488,13.5161146 14.5273997,14.5041858 C14.3697262,14.1846059 14.1518801,13.8944976 13.8904595,13.6380156 C14.7867542,12.8496684 15.3573022,11.6870608 15.3573022,10.3920573 C15.3573022,8.01851215 13.4506244,6.08650174 11.1082014,6.08650174 C8.76577844,6.08650174 6.85910072,8.01851215 6.85910072,10.3920573 C6.85910072,11.6871146 7.42964872,12.8496684 8.32801484,13.6401684 C8.06660485,13.8966719 7.84875877,14.1867856 7.69107464,14.5063385 C6.53335404,13.5182674 5.79682554,12.0403316 5.79682554,10.3921111 C5.79682554,7.42364583 8.17865895,5.01011285 11.1082014,5.01011285 Z"
        />
      </svg>
    ),
    title: 'Listen on Apple Podcasts',
    link: 'https://itunes.apple.com/us/podcast/egghead-io-instructor-chats/id1308497805',
  },
  {
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <path
          fill="currentColor"
          d="M10.992,1 C5.474,1 1,5.474 1,10.992 C1,16.51 5.474,20.984 10.992,20.984 C16.51,20.984 20.984,16.51 20.984,10.992 C20.984,5.474 16.51,1 10.992,1 Z M15.34,16.683 C15.213,17.012 14.985,17.195 14.75,17.195 C14.6218364,17.1921857 14.499269,17.1419473 14.406,17.054 C12.61,15.466 10.536,15.211 9.112,15.276 C7.534,15.349 6.377,15.82 6.365,15.825 C6.002,15.975 5.625,15.651 5.526,15.101 C5.426,14.551 5.64,13.982 6.003,13.831 C6.055,13.809 7.3,13.297 9.032,13.211 C10.0153223,13.1562496 11.0009334,13.2643729 11.949,13.531 C13.1146302,13.866817 14.1898211,14.4604618 15.095,15.268 C15.421,15.557 15.531,16.19 15.34,16.683 L15.34,16.683 Z M16.61,13.62 C16.46,13.949 16.19,14.132 15.911,14.132 C15.7636009,14.1305623 15.6206986,14.0810556 15.504,13.991 C13.377,12.403 10.92,12.148 9.233,12.213 C7.363,12.286 5.993,12.757 5.98,12.762 C5.549,12.912 5.104,12.588 4.985,12.038 C4.867,11.488 5.12,10.919 5.551,10.768 C5.612,10.746 7.087,10.234 9.138,10.148 C10.346,10.097 11.508,10.205 12.594,10.468 C13.9410167,10.7881185 15.208761,11.37912 16.32,12.205 C16.706,12.493 16.836,13.127 16.61,13.62 L16.61,13.62 Z M17.392,10.624 C17.2154321,10.6236484 17.042396,10.5745062 16.892,10.482 C11.835,7.404 5.276,9.234 5.21,9.252 C4.682,9.405 4.135,9.082 3.99,8.531 C3.844,7.98 4.155,7.411 4.683,7.259 C4.759,7.237 6.568,6.725 9.083,6.639 C10.5039142,6.58350095 11.9265109,6.69086674 13.323,6.959 C15.009,7.292 16.546,7.876 17.893,8.697 C18.367,8.985 18.526,9.618 18.25,10.111 C18.0784686,10.4252071 17.7499713,10.6216164 17.392,10.624 L17.392,10.624 Z"
        />
      </svg>
    ),
    title: 'Listen on Spotify',
    link: 'https://open.spotify.com/show/4FKWy0vjNbt6uFwAzwd7XF',
  },
  {
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <path
          fill="currentColor"
          d="M2,2 C11.941,2 20,10.059 20,20 L17,20 C17,11.716 10.284,5 2,5 L2,2 Z M2,9 C8.075,9 13,13.925 13,20 L10,20 C10,15.581722 6.418278,12 2,12 L2,9 Z M2,16 C4.209139,16 6,17.790861 6,20 L2,20 L2,16 Z"
        />
      </svg>
    ),
    title: 'Subscribe via RSS',
    link: 'https://rss.simplecast.com/podcasts/3762/rss',
  },
]

function PodcastLinks() {
  return (
    <div className="flex content-center justify-center ml-2 text-gray-900">
      {LINKS.map(({link, title, image}) => (
        <a
          key={link}
          title={title}
          className="flex items-center justify-center w-12 h-12 mr-2 transition-colors duration-300 ease-in-out rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {image}
        </a>
      ))}
    </div>
  )
}

const TagList = ({
  tags,
  resourceSlug,
  className = 'flex justify-center md:justify-start flex-wrap items-center',
}: {
  tags: any
  resourceSlug: string
  className?: string
}) => {
  return (
    <>
      {!isEmpty(tags) && (
        <ul className={className}>
          {tags.map((tag: any, index: number) => (
            <li key={index} className="inline-flex items-center mr-4 mt-0">
              <Link
                href={`/q/${tag.name}`}
                onClick={() => {
                  track(`clicked view topic`, {
                    resource: resourceSlug,
                    topic: tag.name,
                  })
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
