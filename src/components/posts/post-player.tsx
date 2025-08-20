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
  const {mutate: markLessonComplete} = trpc.progress.markLessonComplete.useMutation()
  const {mutateAsync: addProgressToLesson} = trpc.progress.addProgressToLesson.useMutation()
  const {data: viewer} = trpc.user.current.useQuery()
  const isPro = post.fields.access === 'pro'
  const {setMuxPlayerRef} = useMuxPlayer()
  const playerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {dispatch: dispatchVideoPlayerOverlay} = useVideoPlayerOverlay()

  const canView = !isPro || (isPro && Boolean(viewer) && Boolean(viewer?.is_pro))

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
        if (eggheadLessonId) {
          // Determine which CTA to show based on primary tag first, then fallback to any tag
          let ctaType: string | null = null
          let overlayShown = 'none'

          // Check primary tag first
          if (primaryTagName === 'cursor') {
            ctaType = 'cursor_workshop'
            overlayShown = 'cursor_workshop'
            track('overlay decision', {
              primaryTag: primaryTagName,
              shown: overlayShown,
              source: 'primary_tag',
              resource: post.fields.slug,
            })
          } else if (primaryTagName === 'claude-code') {
            ctaType = 'claude_code_workshop'
            overlayShown = 'claude_code_workshop'
            track('overlay decision', {
              primaryTag: primaryTagName,
              shown: overlayShown,
              source: 'primary_tag',
              resource: post.fields.slug,
            })
          } else {
            // Fallback: check if either tag exists in the tags array
            const hasCursor = postTags.some((tag) => tag.name === 'cursor')
            const hasClaudeCode = postTags.some((tag) => tag.name === 'claude-code')

            if (hasCursor) {
              ctaType = 'cursor_workshop'
              overlayShown = 'cursor_workshop'
              track('overlay decision', {
                primaryTag: primaryTagName || 'none',
                shown: overlayShown,
                source: 'fallback_tags',
                resource: post.fields.slug,
              })
            } else if (hasClaudeCode) {
              ctaType = 'claude_code_workshop'
              overlayShown = 'claude_code_workshop'
              track('overlay decision', {
                primaryTag: primaryTagName || 'none',
                shown: overlayShown,
                source: 'fallback_tags',
                resource: post.fields.slug,
              })
            } else {
              track('overlay decision', {
                primaryTag: primaryTagName || 'none',
                shown: 'none',
                source: 'no_relevant_tags',
                resource: post.fields.slug,
              })
            }
          }

          // Dispatch appropriate overlay
          if (ctaType) {
            dispatchVideoPlayerOverlay({
              type: 'COMPLETED',
              playerRef,
              cta: ctaType,
            })
          } else {
            dispatchVideoPlayerOverlay({type: 'COMPLETED', playerRef})
          }

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
      className="relative z-10 flex items-center max-h-[calc(100vh-240px)] h-full bg-black justify-center"
    />
  )
}