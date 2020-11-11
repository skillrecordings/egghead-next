import React, {FunctionComponent, useState, useEffect} from 'react'
import useSWR from 'swr'
import {animateScroll as scroll} from 'react-scroll'
import {get, first} from 'lodash'
import ReactMarkdown from 'react-markdown'

type TranscriptProps = {
  player: any
  fetcher: any
  url: string
  setIsPlaying: any
}

const hmsToSeconds = (str: string) => {
  var p = str.split(':') || [],
    s = 0,
    m = 1

  while (p.length > 0) {
    s += m * parseInt(p.pop() as string, 10)
    m *= 60
  }
  return s
}

const Transcript: FunctionComponent<TranscriptProps> = ({
  player,
  fetcher,
  url,
  setIsPlaying,
}: TranscriptProps) => {
  const {data} = useSWR(url, fetcher)
  const dataText = get(data, 'text')

  const [transcript, setTranscript] = useState(null)

  const LinkReference = (props: any) => {
    const children = get(props, 'children', [''])
    const linkText: any = first(children)
    const secondsToSeek = hmsToSeconds(
      linkText.props.children.replace('[', '').replace(']', ''),
    )

    return (
      <button
        className="text-blue-600 hover:underline"
        onClick={() => {
          const duration = player.current.getDuration()
          const fractionToSeek = secondsToSeek / duration
          player.current.seekTo(fractionToSeek)
          setIsPlaying(true)
          scroll.scrollToTop({
            duration: 300,
            smooth: 'true',
          })
        }}
      >
        {children}
      </button>
    )
  }

  useEffect(() => {
    if (dataText) {
      let matches =
        dataText &&
        dataText.match(
          /[0-9]:[0-9][0-9]|[0-9]{2}:[0-9][0-9]|[[0-9]{2}:[0-9][0-9]]|[[0-9]{3}:[0-9][0-9]]/g, // https://regexr.com/58bnr
        )
      let result = dataText
      matches &&
        matches.forEach((match: any, i: number) => {
          result = result.replace(
            match,
            `[${match.replace('[', '').replace(']', '')}](${match
              .replace('[', '')
              .replace(']', '')})`,
          )
          if (i === matches.length - 1) {
            setTranscript(result)
          }
        })
    }
  }, [dataText])

  if (!dataText) {
    return null
  }

  return (
    <ReactMarkdown
      children={transcript || ''}
      skipHtml={false}
      renderers={{link: LinkReference}}
      className="prose md:prose-xl"
    />
  )
}

export default Transcript
