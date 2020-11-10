import React, {FunctionComponent, useState, useEffect} from 'react'
import useSWR from 'swr'
import {animateScroll as scroll} from 'react-scroll'
import Link from 'next/link'
import Image from 'next/image'
import {isEmpty, get, first} from 'lodash'
import ReactMarkdown from 'react-markdown'
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard'
import Dialog from 'components/Dialog'
import Eggo from '../../../components/images/eggo.svg'
import {LessonResource} from 'types'

type TranscriptProps = {
  player: any
  fetcher: any
  url: string
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
}: TranscriptProps) => {
  const {data} = useSWR(url, fetcher)
  const dataText = get(data, 'text')
  console.log('player: ', player)

  const [transcript, setTranscript] = useState(null)

  const LinkReference = (props: any) => {
    const children = get(props, 'children', [''])
    const linkText: any = first(children)
    const secondsToSeek = hmsToSeconds(
      linkText.props.children.replace('[', '').replace(']', ''),
    )

    return (
      <button
        className="text-primary hover:underline"
        onClick={() => {
          const duration = player.current.getDuration()
          const fractionToSeek = secondsToSeek / duration
          player.current.seekTo(fractionToSeek)
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
      let transcript = dataText
      matches &&
        matches.forEach((match: any, i: any) => {
          transcript = transcript.replace(
            match,
            `[${match.replace('[', '').replace(']', '')}]`,
          )
          if (i === matches.length - 1) {
            setTranscript(transcript)
          }
        })
    }
  }, [dataText])

  if (isEmpty(transcript) || !dataText) {
    return null
  }

  return (
    <ReactMarkdown
      source={transcript || ''}
      skipHtml={false}
      renderers={{linkReference: LinkReference}}
      className="prose md:prose-xl"
    />
  )
}

export default Transcript
