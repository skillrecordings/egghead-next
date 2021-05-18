import React, {FunctionComponent, useState, useEffect} from 'react'
import {animateScroll as scroll} from 'react-scroll'
import {get, first, noop} from 'lodash'
import ReactMarkdown from 'react-markdown'
import CodeBlock from 'components/code-block'

type TranscriptProps = {
  player: any
  className?: string
  playVideo: () => any
  initialTranscript?: string
  enhancedTranscript: string
  playerAvailable: boolean
}

const hmsToSeconds = (str: string) => {
  let p = str.split(':') || [],
    s = 0,
    m = 1

  while (p.length > 0) {
    s += m * parseInt(p.pop() as string, 10)
    m *= 60
  }
  return s
}

// https://regexr.com/58bnr
const regex =
  /[0-9]:[0-9][0-9]|[0-9]{2}:[0-9][0-9]|[[0-9]{2}:[0-9][0-9]]|[[0-9]{3}:[0-9][0-9]]/g

const Transcript: FunctionComponent<TranscriptProps> = ({
  player,
  className,
  playVideo = noop,
  initialTranscript = '',
  enhancedTranscript,
  playerAvailable,
}: TranscriptProps) => {
  const transcriptText = enhancedTranscript || initialTranscript
  const [transcript, setTranscript] = useState<string>()

  const LinkReference = (props: any) => {
    const children = get(props, 'children', [''])
    const linkText: any = first(children)
    const value: string = linkText.props.children
    const number: string = value.replace('[', '').replace(']', '')
    const secondsToSeek = hmsToSeconds(number)

    if (value.match(regex)) {
      return (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            const duration = player.current.getDuration()
            const fractionToSeek = secondsToSeek / duration
            player.current.seekTo(fractionToSeek)
            playVideo()
            scroll.scrollToTop({
              duration: 300,
              smooth: 'true',
            })
          }}
        >
          {number}
        </button>
      )
    }
    return <a href={props.href}>{value}</a>
  }

  useEffect(() => {
    if (transcriptText && playerAvailable) {
      const matches = transcriptText && transcriptText.match(regex)
      let result = transcriptText
      matches &&
        matches.forEach((match: any, i: number) => {
          result = result.replace(
            match,
            `[[${match.replace('[', '').replace(']', '')}]](${match
              .replace('[', '')
              .replace(']', '')})`,
          )
          if (i === matches.length - 1) {
            setTranscript(result)
          }
        })
    } else {
      setTranscript(transcriptText)
    }
  }, [transcriptText, playerAvailable, initialTranscript])

  if (!transcript) {
    return null
  }

  return (
    <>
      <ReactMarkdown
        skipHtml={false}
        components={{
          link: LinkReference,
          code: (props) => {
            return <CodeBlock {...(props as any)} />
          },
        }}
        className={
          className
            ? className
            : 'prose dark:prose-dark max-w-none text-gray-800 dark:text-gray-100'
        }
      >
        {enhancedTranscript || transcript || ''}
      </ReactMarkdown>
    </>
  )
}

export default Transcript
