# Post Page Refactoring Plan

## Overview

The current `[post].tsx` file is over 1000 lines and contains multiple responsibilities. This plan outlines a structured refactoring following Course Builder patterns to improve maintainability and organization.

## Current Issues

- Single file contains: types, schemas, database queries, UI components, and the main page
- Difficult to test individual components
- Hard to find specific functionality
- No clear separation of concerns

## Proposed File Structure

```
src/
├── lib/
│   ├── posts-query.ts              # Main exports for post operations
│   └── posts/
│       ├── get-post.ts             # Post fetching logic
│       ├── get-tags.ts             # Tag fetching logic
│       ├── get-course.ts           # Course metadata fetching
│       └── utils.ts                # Utility functions (parseSlugForHash, etc.)
│
├── schemas/
│   └── post.ts                     # All post-related schemas and types
│
├── components/
│   └── posts/
│       ├── post-player.tsx         # Video player component
│       ├── instructor-profile.tsx  # Instructor info component
│       ├── tag-list.tsx           # Tag display component
│       ├── podcast-links.tsx       # Podcast subscription links
│       ├── powered-by-mux.tsx     # Mux attribution badge
│       └── icons/
│           └── github-icon.tsx     # GitHub icon component
│
└── pages/
    └── [post].tsx                  # Main page (reduced to ~200 lines)
```

## Detailed Refactoring Steps

### 1. Extract Schemas and Types (`src/schemas/post.ts`)

**File contents:**

```typescript
import {z} from 'zod'

// Move all schema definitions
export const PostTypeSchema = z.union([...])
export const PostStateSchema = z.union([...])
export const PostVisibilitySchema = z.union([...])
export const PostAccessSchema = z.union([...])
export const FieldsSchema = z.object({...})
export const PostSchema = z.object({...})
export const CourseSchema = z.object({...})

// Export types
export type Fields = z.infer<typeof FieldsSchema>
export type Post = z.infer<typeof PostSchema>
export type Course = z.infer<typeof CourseSchema>

// MDX and component prop types
export type MDXSource = {
  compiledSource: string
  scope?: Record<string, unknown>
  frontmatter: Record<string, unknown>
}

export type Tag = {
  name: string
  label: string
  image_url?: string
  version?: string
}

export interface PostPageProps {
  mdxSource: MDXSource
  post: Post
  course: Course
  instructor: {
    full_name: string
    avatar_url: string
    path?: string
  }
  videoResource: {
    fields: {
      muxPlaybackId: string
      transcript?: string
    }
  }
  tags: Tag[]
  primaryTagName?: string | null
}

export interface ParsedSlug {
  hashFromSlug: string
  originalSlug: string
}
```

### 2. Extract Database Query Functions

#### `src/lib/posts-query.ts`

```typescript
'use server'

export * from './posts/get-post'
export * from './posts/get-tags'
export * from './posts/get-course'
export * from './posts/utils'
```

#### `src/lib/posts/get-post.ts`

```typescript
'use server'

import * as mysql from 'mysql2/promise'
import {ConnectionOptions, RowDataPacket} from 'mysql2/promise'
import {PostSchema, type Post} from '@/schemas/post'
import {parseSlugForHash} from './utils'
import {getTagsForPost} from './get-tags'
import {getCourseForPost} from './get-course'

const access: ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

export async function getPost(slug: string) {
  const {hashFromSlug, originalSlug} = parseSlugForHash(slug)
  const conn = await mysql.createConnection(access)

  try {
    // Get video resource query
    const [videoResourceRows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource cr_lesson
       JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
       JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id
       WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ? 
              OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE ?)
       AND cr_video.type = 'videoResource'
       LIMIT 1`,
      [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`],
    )

    // Get post data
    const [postRows] = await conn.execute<RowDataPacket[]>(
      `SELECT cr_lesson.*, egh_user.name, egh_user.image
       FROM egghead_ContentResource cr_lesson
       LEFT JOIN egghead_User egh_user ON cr_lesson.createdById = egh_user.id
       WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ? 
              OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE ?)
       LIMIT 1`,
      [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`],
    )

    const videoResource = videoResourceRows[0]
    const postRow = postRows[0]

    if (!postRow) {
      console.log('No post found for slug:', slug)
      return null
    }

    // Validate post data
    const postData = PostSchema.safeParse(postRow)
    if (!postData.success) {
      console.error('Post validation failed:', postData.error)
      throw new Error(`Invalid post data: ${postData.error.message}`)
    }

    // Get related data
    const tags = await getTagsForPost(
      postData.data.id,
      postData.data.fields.primaryTagId,
      conn,
    )
    const course = await getCourseForPost(postData.data.id, conn)

    return {
      videoResource,
      post: postData.data,
      tags: tags.tags,
      primaryTagName: tags.primaryTagName,
      course,
    }
  } catch (error) {
    console.error('Error in getPost:', error)
    throw error
  } finally {
    await conn.end()
  }
}

export async function getAllPostSlugs() {
  const conn = await mysql.createConnection(access)

  const [postRows] = await conn.execute<RowDataPacket[]>(`
    SELECT * FROM egghead_ContentResource cr_lesson
    WHERE (cr_lesson.type = 'post')
  `)

  await conn.end()

  return postRows.map((post: any) => ({
    slug: post.fields.slug,
  }))
}
```

#### `src/lib/posts/get-tags.ts`

```typescript
'use server'

import {Connection, RowDataPacket} from 'mysql2/promise'

export async function getTagsForPost(
  postId: string,
  primaryTagId: string | null | undefined,
  conn: Connection,
) {
  // Get tags for a post
  const [tagRows] = await conn.execute<RowDataPacket[]>(
    `SELECT 
      egh_tag.id, 
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.name')) AS name, 
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.slug')) AS slug, 
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.label')) AS label,
      JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.image_url')) AS image_url
    FROM egghead_ContentResourceTag crt
    LEFT JOIN egghead_Tag egh_tag ON crt.tagId = egh_tag.id
    WHERE crt.contentResourceId = ?`,
    [postId],
  )

  // Get primary tag name if exists
  let primaryTagName = null
  if (primaryTagId) {
    const [primaryTagRows] = await conn.execute<RowDataPacket[]>(
      `SELECT JSON_UNQUOTE(JSON_EXTRACT(egh_tag.fields, '$.name')) AS name
       FROM egghead_Tag egh_tag
       WHERE egh_tag.id = ?`,
      [primaryTagId],
    )
    primaryTagName = primaryTagRows[0]?.name || null
  }

  return {
    tags: tagRows,
    primaryTagName,
  }
}
```

#### `src/lib/posts/get-course.ts`

```typescript
'use server'

import {Connection, RowDataPacket} from 'mysql2/promise'

export async function getCourseForPost(postId: string, conn: Connection) {
  const [courseRows] = await conn.execute<RowDataPacket[]>(
    `SELECT 
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.title')) AS title,
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) AS slug,
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.image')) AS image,
      JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.description')) AS description,
      cr_course.id AS id,
      crr.position AS position,
      (SELECT COUNT(*) FROM egghead_ContentResourceResource lesson_crr
       WHERE lesson_crr.resourceOfId = cr_course.id) as totalLessons
    FROM egghead_ContentResourceResource crr
    INNER JOIN egghead_ContentResource cr_course ON crr.resourceOfId = cr_course.id
    WHERE crr.resourceId = ?
    LIMIT 1`,
    [postId],
  )

  return courseRows?.[0] ?? null
}
```

#### `src/lib/posts/utils.ts`

```typescript
import type {ParsedSlug} from '@/schemas/post'

export function parseSlugForHash(rawSlug: string | string[]): ParsedSlug {
  if (!rawSlug) {
    throw new Error('Slug is required')
  }

  const slug = String(rawSlug)

  // Try to get hash from tilde-separated slug first
  const tildeSegments = slug.split('~')
  if (tildeSegments.length > 1) {
    return {
      hashFromSlug: tildeSegments[tildeSegments.length - 1],
      originalSlug: slug,
    }
  }

  // Fallback to dash-separated slug
  const dashSegments = slug.split('-')
  if (dashSegments.length === 0) {
    throw new Error('Invalid slug format')
  }

  return {
    hashFromSlug: dashSegments[dashSegments.length - 1],
    originalSlug: slug,
  }
}

export function convertToSerializeForNextResponse(result: any) {
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
```

### 3. Extract UI Components

#### `src/components/posts/instructor-profile.tsx`

```typescript
import Image from 'next/image'
import Link from 'next/link'

interface InstructorProfileProps {
  instructor: {
    full_name: string
    avatar_url: string
    path?: string
  }
}

export function InstructorProfile({instructor}: InstructorProfileProps) {
  const content = (
    <div className="flex flex-shrink-0 items-center">
      {instructor?.avatar_url ? (
        <Image
          src={instructor.avatar_url}
          width={40}
          height={40}
          alt={instructor.full_name}
          className="rounded-full"
        />
      ) : null}
      <div className="ml-2 flex flex-col justify-center">
        <span className="text-gray-700 dark:text-gray-400 text-sm leading-tighter">
          Instructor
        </span>
        <h2 className="font-semibold text-base group-hover:underline">
          {instructor.full_name}
        </h2>
      </div>
    </div>
  )

  return instructor.path ? (
    <Link className="group" href={instructor.path}>
      {content}
    </Link>
  ) : (
    content
  )
}
```

#### `src/components/posts/post-player.tsx`

```typescript
'use client'

import * as React from 'react'
import MuxPlayer, {
  type MuxPlayerProps,
  type MuxPlayerRefAttributes,
} from '@mux/mux-player-react'
import MuxPlayerElement from '@mux/mux-player'
import {MaxResolution, MinResolution} from '@mux/playback-core'
import {trpc} from '@/app/_trpc/client'
import {useMuxPlayer} from '@/hooks/use-mux-player'
import {useVideoPlayerOverlay} from '@/hooks/mux/use-video-player-overlay'
import {track} from '@/utils/analytics'
import type {Post, Tag} from '@/schemas/post'

const defaultPlayerProps = {
  id: 'mux-player',
  defaultHiddenCaptions: true,
  thumbnailTime: 0,
  playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
  maxResolution: MaxResolution.upTo2160p,
  minResolution: MinResolution.noLessThan540p,
}

interface PostPlayerProps {
  playbackId: string
  eggheadLessonId?: number | null
  playerProps?: MuxPlayerProps
  post: Post
  postTags: Tag[]
  primaryTagName?: string | null
}

export function PostPlayer({
  playbackId,
  eggheadLessonId,
  playerProps = defaultPlayerProps,
  post,
  postTags,
  primaryTagName,
}: PostPlayerProps) {
  const [writingProgress, setWritingProgress] = React.useState<Boolean>(false)
  const {mutate: markLessonComplete} =
    trpc.progress.markLessonComplete.useMutation()
  const {mutateAsync: addProgressToLesson} =
    trpc.progress.addProgressToLesson.useMutation()
  const {data: viewer} = trpc.user.current.useQuery()
  const isPro = post.fields.access === 'pro'
  const {setMuxPlayerRef} = useMuxPlayer()
  const playerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {dispatch: dispatchVideoPlayerOverlay} = useVideoPlayerOverlay()

  const canView =
    !isPro || (isPro && Boolean(viewer) && Boolean(viewer?.is_pro))

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

  // Component implementation continues...
  return (
    <MuxPlayer
      {...playerProps}
      metadata={{
        video_id: post.id,
        video_title: post.fields.title,
        view_user_id: viewer?.id,
        video_category: post.fields.primaryTagId,
      }}
      playbackId={playbackId}
      ref={playerRef}
      onLoadedData={() => {
        dispatchVideoPlayerOverlay({type: 'HIDDEN'})
        setMuxPlayerRef(playerRef)
      }}
      onEnded={() => {
        // Overlay logic...
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
      className="relative z-10 flex items-center max-h-[calc(100vh-240px)] h-full bg-black justify-center"
    />
  )
}
```

#### `src/components/posts/tag-list.tsx`

```typescript
'use client'

import {isEmpty} from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import {cn} from '@/ui/utils'
import {track} from '@/utils/analytics'
import type {Tag} from '@/schemas/post'

interface TagListProps {
  tags: Tag[]
  resourceSlug: string
  className?: string
}

export function TagList({tags, resourceSlug, className}: TagListProps) {
  return (
    <>
      {!isEmpty(tags) && (
        <ul
          className={cn(
            'flex justify-center md:justify-start flex-wrap gap-5 items-center',
            className,
          )}
        >
          {tags.map((tag: Tag, index: number) => (
            <li key={index} className="inline-flex items-center mt-0">
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
                {tag?.image_url && tag?.image_url !== 'null' && (
                  <Image
                    src={tag.image_url}
                    alt={tag.name}
                    width={18}
                    height={18}
                    className="flex-shrink-0"
                    quality={100}
                  />
                )}
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
```

#### `src/components/posts/icons/github-icon.tsx`

```typescript
export function GitHubIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 16 16"
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6..."
      />
    </svg>
  )
}
```

### 4. Refactored Main Page File

The main `[post].tsx` file would be reduced to ~200 lines:

```typescript
import {GetServerSideProps, GetStaticPaths} from 'next'
import {NextSeo} from 'next-seo'
import * as React from 'react'
import {MDXRemote} from 'next-mdx-remote'
import mdxComponents from '@/components/mdx'
import {truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import router from 'next/router'

// Import refactored modules
import {
  getPost,
  getAllPostSlugs,
  convertToSerializeForNextResponse,
} from '@/lib/posts-query'
import type {PostPageProps} from '@/schemas/post'
import serializeMDX from '@/markdown/serialize-mdx'

// Import components
import {PostPlayer} from '@/components/posts/post-player'
import {InstructorProfile} from '@/components/posts/instructor-profile'
import {TagList} from '@/components/posts/tag-list'
import {PodcastLinks} from '@/components/posts/podcast-links'
import {PoweredByMuxBadge} from '@/components/posts/powered-by-mux'
import {GitHubIcon} from '@/components/posts/icons/github-icon'

import TweetResource from '@/components/tweet-resource'
import CopyToClipboard from '@/components/copy-resource'
import {LikeButton} from '@/components/like-button'
import BlueskyLink from '@/components/share-bluesky'
import {track} from '@/utils/analytics'
import {CourseLessonCta} from '@/components/posts/course-lesson-cta'
import VideoPlayerOverlay from '@/components/posts/video-player-overlay'
import {
  VideoPlayerOverlayProvider,
  MuxPlayerProvider,
} from '@/hooks/mux/use-video-player-overlay'

import 'highlight.js/styles/night-owl.css'

export const getStaticPaths: GetStaticPaths = async () => {
  const postSlugs = await getAllPostSlugs()
  return {
    paths: postSlugs.map(({slug}) => ({
      params: {post: slug},
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetServerSideProps = async function ({params}) {
  if (!params?.post) {
    return {notFound: true}
  }

  const result = await getPost(params.post as string)
  if (!result) {
    return {notFound: true}
  }

  const {post, videoResource, tags, course, primaryTagName} = result

  // Fetch legacy lesson data
  const lesson = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/lessons/${post.fields.eggheadLessonId}`,
  ).then((res) => res.json())

  // Serialize MDX content
  const mdxSource = await serializeMDX(post.fields?.body ?? '', {
    useShikiTwoslash: true,
    syntaxHighlighterOptions: {
      authorization: process.env.SHIKI_AUTH_TOKEN!,
      endpoint: process.env.SHIKI_ENDPOINT!,
    },
  })

  return {
    props: {
      mdxSource,
      post: convertToSerializeForNextResponse(post),
      course: convertToSerializeForNextResponse(course),
      instructor: {
        full_name: lesson?.instructor?.full_name || post.name,
        avatar_url: lesson?.instructor?.avatar_64_url || post.image,
        ...(lesson?.instructor?.slug && {
          path: `/q/resources-by-${lesson?.instructor?.slug}`,
        }),
      },
      videoResource: convertToSerializeForNextResponse(videoResource),
      tags: tags || [],
      primaryTagName,
    },
    revalidate: 60,
  }
}

export default function PostPage({
  post,
  videoResource,
  instructor,
  mdxSource,
  tags,
  course,
  primaryTagName,
}: PostPageProps) {
  // Redirect courses to course page
  React.useEffect(() => {
    if (post.fields.postType === 'course') {
      router.replace(`/courses/${post.fields.slug}`)
    }
  }, [post.fields.postType, post.fields.slug])

  if (post.fields.postType === 'course') {
    return null
  }

  const ogImage =
    post.fields.ogImage ??
    `${process.env.NEXT_PUBLIC_COURSE_BUILDER_DOMAIN}/api/og?resource=${post.fields.slug}`

  return (
    <div>
      <NextSeo
        title={post.fields.title}
        description={post.fields.description ?? ''}
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
          images: [{url: ogImage}],
        }}
      />

      {/* Video player section */}
      {videoResource && (
        <div>
          <MuxPlayerProvider>
            <VideoPlayerOverlayProvider>
              <div className="relative h-full w-full">
                <VideoPlayerOverlay resource={post} />
                <PostPlayer
                  playbackId={videoResource.fields.muxPlaybackId}
                  eggheadLessonId={post.fields.eggheadLessonId}
                  post={post}
                  postTags={tags}
                  primaryTagName={primaryTagName}
                />
              </div>
            </VideoPlayerOverlayProvider>
          </MuxPlayerProvider>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto w-fit">
        {/* Draft indicator */}
        {post.fields.state === 'draft' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-b-lg flex justify-center">
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              This post is a draft and not published yet.
            </p>
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col gap-5 sm:pt-8 pt-5 max-w-4xl mb-5">
          <h1 className="font-bold sm:text-2xl text-xl leading-tighter tracking-tight">
            {post.fields.title}
          </h1>
          <div className="flex md:items-center justify-between md:flex-row flex-col w-full gap-5">
            <div className="flex items-center gap-6">
              <InstructorProfile instructor={instructor} />
              <LikeButton postId={post.fields.eggheadLessonId ?? 0} />
            </div>
            <div className="flex items-center gap-5">
              {post.fields.github && (
                <Link
                  className="flex items-center gap-1 hover:underline rounded-md leading-tight transition not-prose text-base"
                  href={post.fields.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    track('clicked view source code', {
                      resource: post.fields.slug,
                      resourceType: 'post',
                    })
                  }}
                >
                  <GitHubIcon /> Code
                </Link>
              )}
              <TagList tags={tags} resourceSlug={post.fields.slug ?? ''} />
            </div>
          </div>
        </header>

        {/* Article content */}
        <main className="max-w-4xl mx-auto w-full pt-4 pb-16">
          <article className="prose dark:prose-dark dark:prose-p:text-gray-200 dark:prose-li:text-gray-200 sm:prose-lg lg:prose-lg max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500">
            <MDXRemote
              {...mdxSource}
              components={{...mdxComponents, PodcastLinks} as any}
              scope={mdxSource.scope}
            />
          </article>

          {course && <CourseLessonCta course={course} />}

          {/* Share section */}
          <div className="py-6 bg-transparent dark:border-gray-800/50 border-y border-gray-100 my-10 flex justify-center gap-5 flex-wrap items-center">
            <span className="text-sm">Share with a coworker</span>
            <div className="flex sm:items-center items-start sm:justify-center gap-2">
              <CopyToClipboard
                stringToCopy={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.fields.slug}`}
              />
              <BlueskyLink
                resource={{
                  title: post.fields.title,
                  type: post.fields.postType,
                  path: `/${post.fields.slug}`,
                }}
                instructor={instructor}
              />
              <TweetResource
                resource={{
                  title: post.fields.title,
                  type: post.fields.postType,
                  path: `/${post.fields.slug}`,
                }}
                instructor={instructor}
              />
            </div>
          </div>

          {/* Transcript */}
          {videoResource && (
            <section>
              <h2 className="text-xl tracking-tight font-bold mb-3">
                Transcript
              </h2>
              <ReactMarkdown className="prose dark:prose-p:text-gray-200 lg:prose-base prose-sm dark:prose-dark max-w-none">
                {videoResource.fields.transcript || ''}
              </ReactMarkdown>
            </section>
          )}

          <PoweredByMuxBadge />
        </main>
      </div>
    </div>
  )
}
```

## Benefits of This Refactoring

1. **Improved Maintainability**: Each piece has a single responsibility
2. **Better Testing**: Components and functions can be tested in isolation
3. **Easier Navigation**: Clear file structure makes finding code easier
4. **Type Safety**: Centralized schemas ensure consistency
5. **Reusability**: Components can be used elsewhere in the app
6. **Performance**: Smaller files = faster builds and better code splitting
7. **Developer Experience**: Following established patterns from Course Builder

## Implementation Order

1. **Phase 1**: Extract schemas and types (low risk)
2. **Phase 2**: Extract database query functions (medium risk, needs testing)
3. **Phase 3**: Extract UI components (low risk)
4. **Phase 4**: Update main page file to use refactored modules
5. **Phase 5**: Test everything thoroughly

## Testing Strategy

- Unit tests for utility functions
- Integration tests for database queries
- Component tests for UI components
- E2E test for the full page flow

## Notes

- All database queries should use the `'use server'` directive
- Follow the existing pattern of using `convertToSerializeForNextResponse` for Next.js serialization
- Maintain the existing functionality while improving organization
- Consider adding error boundaries for better error handling
