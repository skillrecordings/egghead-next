import React, {FunctionComponent} from 'react'

import ReactMarkdown from 'react-markdown'
import CodeBlock from 'components/code-block'

type TranscriptProps = {
  className?: string
  initialTranscript?: string
  enhancedTranscript: string
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
  className,
  initialTranscript = '',
  enhancedTranscript,
}: TranscriptProps) => {
  const transcript = enhancedTranscript || initialTranscript

  if (!transcript) {
    return null
  }

  return (
    <>
      <ReactMarkdown
        skipHtml={false}
        renderers={{
          code: (props) => {
            return <CodeBlock {...props} />
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
