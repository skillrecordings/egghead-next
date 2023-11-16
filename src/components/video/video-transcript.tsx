'use client'
import * as React from 'react'
import {PortableText} from '@portabletext/react'
import {type PortableTextComponents as PortableTextComponentsType} from '@portabletext/react/src/types'
import {hmsToSeconds} from '@skillrecordings/time'
import ReactMarkdown from 'react-markdown'
import {useMuxPlayer} from '@/hooks/mux/use-mux-player'
import {getTranscriptComponents} from '@/components/markdown/transcript-components'

export const VideoTranscript: React.FC<{
  transcript: string | any[]
}> = ({transcript}) => {
  const {handlePlay, muxPlayerRef} = useMuxPlayer()
  const transcriptMarkdownComponent = getTranscriptComponents({
    handlePlay,
    muxPlayerRef,
  })

  if (!transcript) {
    return null
  }

  return (
    <div data-video-transcript="">
      <h2 data-title="">Transcript</h2>
      <div data-transcript="">
        {typeof transcript === 'string' ? (
          <ReactMarkdown
            className="prose dark:prose-dark"
            components={transcriptMarkdownComponent}
          >
            {transcript}
          </ReactMarkdown>
        ) : (
          <PortableText
            value={transcript}
            components={
              {
                marks: {
                  timestamp: ({value}: any) => {
                    const {timestamp} = value
                    return (
                      <button
                        data-timestamp=""
                        onClick={() => {
                          if (muxPlayerRef.current) {
                            muxPlayerRef.current.currentTime =
                              hmsToSeconds(timestamp)
                            handlePlay()
                            window.scrollTo({top: 80})
                          }
                        }}
                      >
                        {timestamp}
                      </button>
                    )
                  },
                },
              } as PortableTextComponentsType
            }
          />
        )}
      </div>
    </div>
  )
}
