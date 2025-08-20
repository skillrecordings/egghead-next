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
import {VideoPlayerOverlayProvider} from '@/hooks/mux/use-video-player-overlay'
import {MuxPlayerProvider} from '@/hooks/use-mux-player'

import 'highlight.js/styles/night-owl.css'
import {CopyAsPromptButton} from '@/components/copy-as-prompt-button'

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
    return {
      notFound: true,
    }
  }

  const result = await getPost(params.post as string)
  if (!result) {
    return {
      notFound: true,
    }
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
              <CopyAsPromptButton
                title={post.fields.title}
                description={post.fields.body}
                transcript={videoResource?.fields?.transcript}
                contentType={post.fields.postType}
                contentId={post.fields.eggheadLessonId || post.id}
              />
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
            <div className="flex sm:items-center items-start sm:justify-center gap-2 flex-wrap">
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
