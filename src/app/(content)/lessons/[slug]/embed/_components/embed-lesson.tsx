'use client'
import React from 'react'
import {useViewer} from '@/context/viewer-context'
import {type VideoResource} from '@/types'
import dynamic from 'next/dynamic'
import {trpc} from '@/app/_trpc/client'
const ReactPlayer = dynamic(() => import('react-player'), {ssr: false})

export default function Embed({initialLesson}: {initialLesson: VideoResource}) {
  const {viewer} = useViewer()

  const markComplete = trpc.progress.markLessonComplete.useMutation()
  return (
    <React.Suspense fallback={<div>Loading player...</div>}>
      <ReactPlayer
        url={initialLesson.hls_url}
        height="100vh"
        width="100vw"
        playing={false} // Start paused
        controls={true} // Show video controls
        light={initialLesson.thumb_url || false} // Use thumbnail as preview image
        pip={true} // Enable picture-in-picture mode
        stopOnUnmount={true} // Stop playing when component unmounts
        playsinline={true} // Play inline on mobile devices
        config={{
          file: {
            forceHLS: true, // Force HLS playback if available
            hlsOptions: {
              enableWorker: true, // Enable web worker for better performance
              startLevel: -1, // Auto-select starting quality
            },
          },
        }}
        onReady={() => console.log('Player is ready')}
        onStart={() => console.log('Video started playing')}
        onPause={() => console.log('Video paused')}
        onEnded={() => {
          markComplete.mutate({
            lessonId: initialLesson.id as number,
            collectionId: initialLesson.collection?.id as number,
          })
        }}
        onError={(e) => console.error('Player error:', e)}
      />
    </React.Suspense>
  )
}
