import {hmsToSeconds} from '@skillrecordings/time'

/**
 * @name getTranscriptComponents
 * @returns {object} markdown components
 * @example
 * // <ReactMarkdown components={getTranscriptComponents()}>{transcript}</ReactMarkdown>
 */

const getTranscriptComponents = ({
  handlePlay,
  canShowVideo,
  muxPlayerRef,
}: {
  handlePlay: () => void
  canShowVideo: boolean
  muxPlayerRef: any
}) => {
  return {
    p: ({children}: any) => {
      const text = children.toString()
      const timestampRegex = /(\d+:\d+)/
      const matches = text.match(timestampRegex)

      if (matches) {
        const timestamp = matches[1]
        const beforeText = text.split(matches[0])[0]
        const afterText = text.split(matches[0])[1]
        return (
          <p>
            {beforeText.replace('[', '')}
            {canShowVideo ? (
              <button
                data-timestamp=""
                className="after:content-[' '] inline-block underline after:inline-block"
                onClick={() => {
                  if (muxPlayerRef.current) {
                    muxPlayerRef.current.currentTime = hmsToSeconds(timestamp)
                    handlePlay()
                    window.scrollTo({top: 0})
                  }
                }}
              >
                {timestamp}
              </button>
            ) : (
              timestamp
            )}
            {afterText.replace(']', '')}
          </p>
        )
      }
      return <p>{text}</p>
    },
  }
}

export {getTranscriptComponents}
